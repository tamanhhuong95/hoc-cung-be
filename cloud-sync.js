"use strict";

// Local-first Firestore sync. Only the whitelisted learning payload below is sent to cloud.
(() => {
  const STORAGE_KEY = "hoc-cung-be:math-grade-1-progress";
  const COURSE_IDS = ["math-grade-1", "vietnamese-grade-1"];
  const DIRTY_KEY = "hoc-cung-be:cloud-sync-pending";
  const LAST_SYNC_KEY = "hoc-cung-be:last-cloud-sync";
  const SYNC_DEBOUNCE_MS = 5000;
  let firestore = null, db = null, user = null, debounceTimer = null, lastStatus = "idle", applyingCloud = false, authGeneration = 0;
  const syncPromises = new Map();

  const safeNumber = (value, max = Number.MAX_SAFE_INTEGER) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(0, Math.floor(Number(value)))) : 0;
  const validObject = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));
  const safeGet = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const parse = (value) => { try { return value ? JSON.parse(value) : null; } catch { return null; } };
  const newerTime = (a, b) => [a, b].filter((value) => typeof value === "string" && !Number.isNaN(new Date(value).getTime())).sort().at(-1) || null;
  const activeChildId = () => window.HocCungBeChildren?.getActiveChildId?.() || null;
  const scopedKey = (base, childId = activeChildId(), uid = user?.uid, courseId = window.HocCungBeLearning?.getActiveCourseId?.() || "math-grade-1") => uid && childId ? `${base}:${uid}:${childId}:${courseId}` : base;
  const cloudReady = (currentUser, firestoreSdk, database, childId = activeChildId()) => Boolean(currentUser && firestoreSdk && database && childId);
  const normal = (value) => typeof window.normalizeProgress === "function" ? window.normalizeProgress(value) : value;
  const withCourse = (courseId, callback) => { const previous = window.HocCungBeLearning?.getActiveCourseId?.(); if (courseId && previous && previous !== courseId) window.HocCungBeLearning?.setActiveCourse?.(courseId); try { return callback(); } finally { if (previous && previous !== courseId) window.HocCungBeLearning?.setActiveCourse?.(previous); } };
  const loadLocal = (courseId = window.HocCungBeLearning?.getActiveCourseId?.() || "math-grade-1") => typeof window.loadProgress === "function" ? window.loadProgress(localStorage, courseId) : normal(parse(safeGet(STORAGE_KEY)) || {});
  const saveLocal = (value, courseId = window.HocCungBeLearning?.getActiveCourseId?.() || "math-grade-1") => typeof window.saveProgress === "function" ? window.saveProgress(value, localStorage, courseId) : (safeSet(STORAGE_KEY, JSON.stringify(normal(value))), normal(value));
  const fingerprint = (entry) => typeof window.historyFingerprint === "function" ? window.historyFingerprint(entry) : [entry.levelId, entry.score, entry.correct, entry.questionCount, entry.completedAt].join("|");

  function mergeHistory(localHistory, cloudHistory) {
    const unique = new Map();
    [...(Array.isArray(localHistory) ? localHistory : []), ...(Array.isArray(cloudHistory) ? cloudHistory : [])].forEach((entry) => {
      if (!validObject(entry)) return;
      const key = typeof entry.historyId === "string" && entry.historyId ? entry.historyId : fingerprint(entry);
      if (!unique.has(key)) unique.set(key, { ...entry, historyId: key });
    });
    return [...unique.values()].sort((a, b) => String(a.completedAt || "").localeCompare(String(b.completedAt || ""))).slice(-50);
  }

  function betterBest(a, b) {
    const first = validObject(a) ? a : {}; const second = validObject(b) ? b : {};
    if (safeNumber(second.bestScore, 100) !== safeNumber(first.bestScore, 100)) return safeNumber(second.bestScore, 100) > safeNumber(first.bestScore, 100) ? second : first;
    return safeNumber(second.bestCorrect, 100) > safeNumber(first.bestCorrect, 100) ? second : first;
  }

  function mergeStudyTime(a, b) {
    const first = validObject(a) ? a : {}; const second = validObject(b) ? b : {}; const studyTimeByDate = {};
    const days = new Set([...Object.keys(validObject(first.studyTimeByDate) ? first.studyTimeByDate : {}), ...Object.keys(validObject(second.studyTimeByDate) ? second.studyTimeByDate : {})]);
    days.forEach((day) => { if (/^\d{4}-\d{2}-\d{2}$/.test(day)) studyTimeByDate[day] = Math.max(safeNumber(first.studyTimeByDate?.[day], 864000), safeNumber(second.studyTimeByDate?.[day], 864000)); });
    const legacySeconds = Math.max(safeNumber(first.legacySeconds), safeNumber(second.legacySeconds));
    const totalSeconds = legacySeconds + Object.values(studyTimeByDate).reduce((sum, seconds) => sum + seconds, 0);
    return { totalSeconds, todaySeconds: safeNumber(studyTimeByDate[new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)], 864000), todayDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), lastStudyDate: newerTime(first.lastStudyDate, second.lastStudyDate), legacySeconds, studyTimeByDate };
  }

  function mergeProgress(localRaw, cloudRaw, courseId = window.HocCungBeLearning?.getActiveCourseId?.() || "math-grade-1") { return withCourse(courseId, () => {
    const local = normal(localRaw); const cloud = normal(cloudRaw); const history = mergeHistory(local.history, cloud.history); const levels = {};
    Object.keys(local.levels || {}).forEach((levelId) => {
      const a = local.levels[levelId] || {}; const b = cloud.levels?.[levelId] || {}; const best = betterBest(a, b); const historyAttempts = history.filter((entry) => entry.levelId === levelId).length;
      levels[levelId] = { bestScore: Math.max(safeNumber(a.bestScore, 100), safeNumber(b.bestScore, 100)), bestCorrect: safeNumber(best.bestCorrect, 100), bestQuestionCount: safeNumber(best.bestQuestionCount, 100) || 10, bestStars: Math.max(safeNumber(a.bestStars, 3), safeNumber(b.bestStars, 3)), attempts: Math.max(safeNumber(a.attempts, 999999), safeNumber(b.attempts, 999999), historyAttempts), completed: Boolean(a.completed || b.completed), unlocked: Boolean(a.unlocked || b.unlocked), lastPlayedAt: newerTime(a.lastPlayedAt, b.lastPlayedAt) };
    });
    const merged = normal({ progressVersion: 2, levels, history, studyTime: mergeStudyTime(local.studyTime, cloud.studyTime), totalCompleted: Math.max(safeNumber(local.totalCompleted, 999999), safeNumber(cloud.totalCompleted, 999999), Object.values(levels).reduce((sum, level) => sum + level.attempts, 0)) });
    return merged;
  }); }

  function cloudPayload(progress, courseId = window.HocCungBeLearning?.getActiveCourseId?.() || "math-grade-1") { return withCourse(courseId, () => {
    const value = normal(progress); const levels = {};
    Object.entries(value.levels || {}).forEach(([levelId, item]) => { levels[levelId] = { bestScore: item.bestScore, bestCorrect: item.bestCorrect, bestQuestionCount: item.bestQuestionCount, bestStars: item.bestStars, attempts: item.attempts, completed: item.completed, unlocked: item.unlocked, lastPlayedAt: item.lastPlayedAt }; });
    return { progressVersion: 2, levels, history: value.history.map((entry) => ({ historyId: entry.historyId || fingerprint(entry), levelId: entry.levelId, topic: entry.topic, score: entry.score, correct: entry.correct, stars: entry.stars, questionCount: entry.questionCount, completedAt: entry.completedAt })), studyTime: value.studyTime, totalCompleted: value.totalCompleted };
  }); }

  function lastSyncForCurrentUser(courseId = window.HocCungBeLearning?.getActiveCourseId?.() || "math-grade-1") { const saved = parse(safeGet(LAST_SYNC_KEY)); const childId = activeChildId(); return user && childId && validObject(saved) ? saved[`${user.uid}:${childId}:${courseId}`] || null : null; }
  function setLastSync(value, childId = activeChildId(), courseId = window.HocCungBeLearning?.getActiveCourseId?.() || "math-grade-1") { const saved = parse(safeGet(LAST_SYNC_KEY)); const map = validObject(saved) ? saved : {}; if (user && childId) map[`${user.uid}:${childId}:${courseId}`] = value; safeSet(LAST_SYNC_KEY, JSON.stringify(map)); }
  function statusText(status) { return ({ syncing: "Đang đồng bộ...", synced: "Đã đồng bộ", pending: "Chưa đồng bộ", offline: "Không có mạng", error: "Lỗi đồng bộ", guest: "Đăng nhập để đồng bộ" })[status] || "Chưa đồng bộ"; }
  function renderStatus(status = lastStatus) {
    lastStatus = status; document.querySelectorAll("[data-cloud-sync-status]").forEach((element) => { element.textContent = statusText(status); element.dataset.state = status; });
    document.querySelectorAll("[data-cloud-sync-time]").forEach((element) => { const value = lastSyncForCurrentUser(); element.textContent = value ? `Lần đồng bộ gần nhất: ${new Date(value).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}` : "Lần đồng bộ gần nhất: Chưa có"; });
    document.querySelectorAll("[data-cloud-sync-button]").forEach((button) => { button.disabled = status === "syncing" || !user; });
  }

  function installUi() {
    const accountPanel = document.querySelector("#account-me-screen .account-panel");
    if (accountPanel && !accountPanel.querySelector("[data-cloud-sync-panel]")) accountPanel.insertAdjacentHTML("beforeend", `<section class="account-subpanel cloud-sync-panel" data-cloud-sync-panel><h2>☁️ Đồng bộ tiến độ</h2><p>Tiến độ học được lưu trên thiết bị trước, sau đó hợp nhất an toàn với Cloud Firestore.</p><button class="secondary-button" type="button" data-cloud-sync-button>☁️ Đồng bộ tiến độ</button><strong data-cloud-sync-status>Chưa đồng bộ</strong><small data-cloud-sync-time>Lần đồng bộ gần nhất: Chưa có</small></section>`);
    document.querySelectorAll("[data-cloud-sync-button]").forEach((button) => { button.onclick = () => syncNow("manual"); }); renderStatus(user && activeChildId() ? (safeGet(scopedKey(DIRTY_KEY)) === "1" ? "pending" : (lastSyncForCurrentUser() ? "synced" : "pending")) : "guest");
  }

  function markPending(childId = activeChildId(), courseId = window.HocCungBeLearning?.getActiveCourseId?.() || "math-grade-1") { if (user && childId) safeSet(scopedKey(DIRTY_KEY, childId, user.uid, courseId), "1"); if (user) renderStatus(navigator.onLine ? "pending" : "offline"); }
  function scheduleSync() { markPending(); if (!user || !firestore || !navigator.onLine) return; clearTimeout(debounceTimer); debounceTimer = setTimeout(() => syncNow("debounced"), SYNC_DEBOUNCE_MS); }

  async function syncNow(reason = "manual", requestedCourseId = null) {
    const childId = activeChildId();
    if (!cloudReady(user, firestore, db, childId)) { renderStatus("guest"); return null; }
    if (!navigator.onLine) { markPending(); renderStatus("offline"); return null; }
    const courseIds = requestedCourseId ? [requestedCourseId] : COURSE_IDS;
    const syncUser = user, syncFirestore = firestore, syncDb = db, generation = authGeneration, syncChildId = childId;
    const syncKey = `${syncUser.uid}:${syncChildId}:${generation}:${courseIds.join(",")}`;
    if (syncPromises.has(syncKey)) return syncPromises.get(syncKey);
    renderStatus("syncing");
    const promise = (async () => {
      try {
        const results = {};
        for (const courseId of courseIds.filter((id) => COURSE_IDS.includes(id))) {
          const localBefore = loadLocal(courseId); const progressRef = syncFirestore.doc(syncDb, "users", syncUser.uid, "children", syncChildId, "progress", courseId); let merged = localBefore;
          await syncFirestore.runTransaction(syncDb, async (transaction) => { const snapshot = await transaction.get(progressRef); const cloud = snapshot.exists() ? snapshot.data() : null; merged = cloud ? mergeProgress(localBefore, cloud, courseId) : withCourse(courseId, () => normal(localBefore)); transaction.set(progressRef, { ...cloudPayload(merged, courseId), updatedAt: syncFirestore.serverTimestamp(), syncReason: reason }); });
          if (generation !== authGeneration || user?.uid !== syncUser.uid || activeChildId() !== syncChildId) return results;
          const currentLocal = loadLocal(courseId); const finalMerged = mergeProgress(currentLocal, merged, courseId); const changedDuringSync = JSON.stringify(cloudPayload(finalMerged, courseId)) !== JSON.stringify(cloudPayload(merged, courseId)); applyingCloud = true; try { saveLocal(finalMerged, courseId); } finally { applyingCloud = false; } safeSet(scopedKey(DIRTY_KEY, syncChildId, syncUser.uid, courseId), changedDuringSync ? "1" : "0"); const completedAt = new Date().toISOString(); setLastSync(completedAt, syncChildId, courseId); results[courseId] = finalMerged; if (changedDuringSync) scheduleSync();
        }
        renderStatus("synced"); window.dispatchEvent(new CustomEvent("hoc-cung-be:cloud-synced", { detail: { progressByCourse: results, childId: syncChildId } })); return results;
      } catch (error) {
        console.warn("Không thể đồng bộ Cloud Firestore; dữ liệu local được giữ nguyên.", error);
        if (generation === authGeneration && user?.uid === syncUser.uid && activeChildId() === syncChildId) { markPending(syncChildId); renderStatus(navigator.onLine ? "error" : "offline"); }
        return null;
      } finally { syncPromises.delete(syncKey); }
    })();
    syncPromises.set(syncKey, promise);
    return promise;
  }

  async function configure(options) {
    authGeneration += 1; firestore = options?.firestore || null; db = options?.db || null; user = options?.user || null; installUi();
    if (!user) { clearTimeout(debounceTimer); renderStatus("guest"); return; }
    if (firestore && db) await syncNow("login");
  }

  function disconnect() { authGeneration += 1; user = null; clearTimeout(debounceTimer); renderStatus("guest"); }

  window.addEventListener("hoc-cung-be:progress-saved", () => { if (!applyingCloud) scheduleSync(); });
  window.addEventListener("hoc-cung-be:quiz-completed", () => syncNow("quiz-completed"));
  window.addEventListener("hoc-cung-be:parent-dashboard-open", () => syncNow("dashboard"));
  window.addEventListener("online", () => { if (user && safeGet(scopedKey(DIRTY_KEY)) === "1") syncNow("online"); });
  window.addEventListener("offline", () => { if (user) renderStatus("offline"); });
  document.addEventListener("visibilitychange", () => { if (document.hidden && user) syncNow("background"); });
  window.addEventListener("pagehide", () => { if (user) syncNow("background"); });
  window.addEventListener("hoc-cung-be:child-changed", () => { authGeneration += 1; clearTimeout(debounceTimer); installUi(); if (user && activeChildId()) syncNow("child-changed"); });

  async function runSelfTests() {
    const testResults = []; const test = (id, passed) => testResults.push({ id, passed: Boolean(passed) });
    const empty = normal({}); const local80 = normal({ ...empty, levels: { ...empty.levels, "addition-1": { ...empty.levels["addition-1"], bestScore: 80, bestCorrect: 4, bestQuestionCount: 5, bestStars: 2, attempts: 1, completed: true } } }); const cloud100 = normal({ ...empty, levels: { ...empty.levels, "addition-1": { ...empty.levels["addition-1"], bestScore: 100, bestCorrect: 10, bestQuestionCount: 10, bestStars: 3, attempts: 1, completed: true, unlocked: true } } });
    test("A", mergeProgress(local80, empty).levels["addition-1"].bestScore === 80);
    test("B", mergeProgress(empty, cloud100).levels["addition-1"].bestScore === 100);
    test("C", mergeProgress(local80, cloud100).levels["addition-1"].bestScore === 100);
    test("D", mergeProgress(cloud100, local80).levels["addition-1"].bestScore === 100);
    test("E", mergeProgress(local80, cloud100).levels["addition-1"].unlocked === true);
    test("F", mergeProgress(empty, local80).levels["addition-1"].completed === true);
    const oldEntry = { levelId: "addition-1", topic: "addition", score: 80, correct: 8, questionCount: 10, stars: 2, completedAt: "2026-10-01T00:00:00.000Z" }; const duplicateHistory = mergeHistory([oldEntry], [oldEntry]); test("G", duplicateHistory.length === 1);
    const many = Array.from({ length: 60 }, (_, index) => ({ historyId: `h-${index}`, levelId: "addition-1", topic: "addition", score: 80, correct: 4, questionCount: 5, stars: 2, completedAt: `2026-10-01T${String(index % 24).padStart(2, "0")}:${String(index).padStart(2, "0")}:00.000Z` })); test("H", mergeHistory(many, []).length === 50);
    test("I", normal(local80).levels["addition-1"].bestScore === 80);
    const failureSnapshot = JSON.stringify(local80); try { await Promise.reject(new Error("mock sync failure")); } catch {} test("J", JSON.stringify(local80) === failureSnapshot);
    test("K", cloudReady(null, {}, {}, "child") === false);
    test("L", mergeProgress(local80, empty).levels["addition-1"].bestScore === 80);
    const logoutSnapshot = JSON.stringify(local80); test("M", JSON.stringify(local80) === logoutSnapshot && typeof disconnect === "function");
    const payload = JSON.stringify(cloudPayload(local80)); test("N", !payload.includes("parent-pin") && !payload.includes("password") && !payload.includes("guest-trial"));
    test("O", mergeProgress(empty, cloud100).levels["addition-1"].bestQuestionCount === 10);
    test("P", mergeProgress(local80, empty).levels["addition-1"].bestQuestionCount === 5);
    const generationBefore = authGeneration; authGeneration += 1; test("Q", generationBefore !== authGeneration); authGeneration = generationBefore;
    test("R", scopedKey(DIRTY_KEY, "child-A", "parent") !== scopedKey(DIRTY_KEY, "child-B", "parent"));
    return { passed: testResults.every((item) => item.passed), results: testResults };
  }

  window.HocCungBeCloudSync = { configure, disconnect, installUi, syncNow, markPending, mergeProgress, mergeHistory, cloudPayload };
  window.__hocCungBeCloudSyncTests = runSelfTests();
})();