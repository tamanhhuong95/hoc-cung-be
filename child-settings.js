"use strict";

// Local-first learning limits. These are in-app usage limits, not anti-bypass parental controls.
(() => {
  const VERSION = 1;
  const LOCAL_PREFIX = "hoc-cung-be:child-settings:";
  const PENDING_PREFIX = "hoc-cung-be:child-settings-pending:";
  const LEGACY_AUDIO_KEY = "hoc-cung-be:audio-settings";
  let firestore = null, db = null, user = null, settings = defaults(), generation = 0;
  let breakTimer = null, breakEndsAt = 0, learningStartedAt = 0;
  const $ = (selector, root = document) => root.querySelector(selector);
  const safeGet = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const parse = (value) => { try { return value ? JSON.parse(value) : null; } catch { return null; } };
  const activeChild = () => window.HocCungBeChildren?.getActiveChild?.() || null;
  const activeChildId = () => activeChild()?.id || null;
  const localKey = (childId = activeChildId()) => childId ? `${LOCAL_PREFIX}${childId}` : null;
  const pendingKey = (uid = user?.uid, childId = activeChildId()) => uid && childId ? `${PENDING_PREFIX}${uid}:${childId}` : null;
  const dateKey = (date = new Date()) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function defaults(audio = parse(safeGet(LEGACY_AUDIO_KEY)) || {}) {
    return { settingsVersion: VERSION, dailyTimeLimitMinutes: null, dailyLessonLimit: null, breakEnabled: false, breakAfterMinutes: null, breakDurationMinutes: null, allowedTimeEnabled: false, allowedStartTime: null, allowedEndTime: null, soundEnabled: typeof audio.soundEnabled === "boolean" ? audio.soundEnabled : true, speechEnabled: typeof audio.speechEnabled === "boolean" ? audio.speechEnabled : true };
  }
  const nullableInt = (value, min, max) => value === null || value === "" || value === undefined ? null : (Number.isInteger(Number(value)) && Number(value) >= min && Number(value) <= max ? Number(value) : null);
  const validTime = (value) => typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
  function normalize(raw) {
    const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    const fallback = defaults();
    return {
      settingsVersion: VERSION,
      dailyTimeLimitMinutes: nullableInt(source.dailyTimeLimitMinutes, 1, 1440),
      dailyLessonLimit: nullableInt(source.dailyLessonLimit, 1, 100),
      breakEnabled: typeof source.breakEnabled === "boolean" ? source.breakEnabled : false,
      breakAfterMinutes: nullableInt(source.breakAfterMinutes, 1, 240),
      breakDurationMinutes: nullableInt(source.breakDurationMinutes, 1, 120),
      allowedTimeEnabled: typeof source.allowedTimeEnabled === "boolean" ? source.allowedTimeEnabled : false,
      allowedStartTime: validTime(source.allowedStartTime) ? source.allowedStartTime : null,
      allowedEndTime: validTime(source.allowedEndTime) ? source.allowedEndTime : null,
      soundEnabled: typeof source.soundEnabled === "boolean" ? source.soundEnabled : fallback.soundEnabled,
      speechEnabled: typeof source.speechEnabled === "boolean" ? source.speechEnabled : fallback.speechEnabled,
    };
  }
  function valid(value) {
    const normalized = normalize(value);
    return value?.settingsVersion === VERSION
      && JSON.stringify(normalized) === JSON.stringify({ ...value, updatedAt: undefined }, (key, item) => key === "updatedAt" ? undefined : item)
      && (!normalized.breakEnabled || (normalized.breakAfterMinutes && normalized.breakDurationMinutes))
      && (!normalized.allowedTimeEnabled || (normalized.allowedStartTime && normalized.allowedEndTime));
  }
  function saveLocal(value, childId = activeChildId()) {
    const key = localKey(childId); const safe = normalize(value);
    if (key) safeSet(key, JSON.stringify(safe));
    return safe;
  }
  function loadLocal(childId = activeChildId()) {
    const key = localKey(childId); return key ? normalize(parse(safeGet(key)) || defaults()) : defaults();
  }
  function apply(value = settings) {
    settings = normalize(value);
    window.HocCungBeLearning?.applyAudioSettings?.({ soundEnabled: settings.soundEnabled, speechEnabled: settings.speechEnabled });
    render();
    window.dispatchEvent(new CustomEvent("hoc-cung-be:child-settings-applied", { detail: { childId: activeChildId(), settings: { ...settings } } }));
    return settings;
  }

  function todayUsage(progress = window.loadProgress?.() || {}) {
    const today = dateKey();
    const seconds = Math.max(0, Number(progress.studyTime?.studyTimeByDate?.[today]) || 0);
    const lessons = (Array.isArray(progress.history) ? progress.history : []).filter((entry) => entry?.completedAt && dateKey(new Date(entry.completedAt)) === today).length;
    return { today, seconds, lessons };
  }
  function withinAllowedTime(value = settings, now = new Date()) {
    if (!value.allowedTimeEnabled || !value.allowedStartTime || !value.allowedEndTime) return true;
    const current = now.getHours() * 60 + now.getMinutes();
    const toMinutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
    const start = toMinutes(value.allowedStartTime), end = toMinutes(value.allowedEndTime);
    return start <= end ? current >= start && current <= end : current >= start || current <= end;
  }
  function evaluateStart(progress = window.loadProgress?.() || {}, value = settings, now = new Date()) {
    const usage = todayUsage(progress);
    if (!withinAllowedTime(value, now)) return { allowed: false, reason: "allowed-time", message: "Hiện chưa đến giờ học do phụ huynh cài đặt." };
    if (value.dailyTimeLimitMinutes !== null && usage.seconds >= value.dailyTimeLimitMinutes * 60) return { allowed: false, reason: "daily-time", message: "Hôm nay bé đã học đủ thời gian phụ huynh cài đặt." };
    if (value.dailyLessonLimit !== null && usage.lessons >= value.dailyLessonLimit) return { allowed: false, reason: "daily-lessons", message: "Hôm nay bé đã hoàn thành đủ số bài được phép học." };
    return { allowed: true, reason: null };
  }
  function showLimit(message) {
    ensureMarkup(); const modal = $("#learning-limit-dialog"); $("#learning-limit-message").textContent = message; modal.hidden = false; modal.querySelector("button")?.focus();
  }
  function canStartLesson(progress) { if (!user || !activeChildId()) return true; const result = evaluateStart(progress); if (!result.allowed) showLimit(result.message); return result.allowed; }

  function startLearningSession() {
    learningStartedAt = Date.now(); clearInterval(breakTimer); breakTimer = null;
    if (!settings.breakEnabled || !settings.breakAfterMinutes || !settings.breakDurationMinutes) return;
    breakTimer = setInterval(() => {
      if (Date.now() - learningStartedAt >= settings.breakAfterMinutes * 60000) showBreak(settings.breakDurationMinutes);
    }, 1000);
  }
  function stopLearningSession() { clearInterval(breakTimer); breakTimer = null; learningStartedAt = 0; }
  function showBreak(minutes) {
    stopLearningSession(); ensureMarkup(); breakEndsAt = Date.now() + minutes * 60000; const overlay = $("#learning-break-overlay"); overlay.hidden = false;
    window.dispatchEvent(new CustomEvent("hoc-cung-be:child-break-started", { detail: { childId: activeChildId(), endsAt: breakEndsAt } }));
    const tick = () => { const left = Math.max(0, Math.ceil((breakEndsAt - Date.now()) / 1000)); $("#learning-break-countdown").textContent = left ? `Còn ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : "Bé có thể học tiếp rồi."; if (!left) clearInterval(showBreak.timer); };
    tick(); clearInterval(showBreak.timer); showBreak.timer = setInterval(tick, 1000);
  }
  function dismissBreak(force = false) {
    if (!force && Date.now() < breakEndsAt) return false;
    clearInterval(showBreak.timer); breakEndsAt = 0; const overlay = $("#learning-break-overlay"); if (overlay) overlay.hidden = true;
    window.dispatchEvent(new CustomEvent("hoc-cung-be:child-break-ended", { detail: { childId: activeChildId(), forced: Boolean(force) } }));
    return true;
  }
  function closeBreak() { return dismissBreak(false); }

  async function sync(childId = activeChildId(), syncGeneration = generation) {
    if (!user || !firestore || !db || !childId || !navigator.onLine) return false;
    const ref = firestore.doc(db, "users", user.uid, "children", childId, "settings", "learning");
    try {
      const snapshot = await firestore.getDoc(ref);
      if (syncGeneration !== generation || childId !== activeChildId()) return false;
      const local = loadLocal(childId), pending = safeGet(pendingKey(user.uid, childId)) === "1";
      if (snapshot.exists() && !pending) saveLocal(snapshot.data(), childId);
      else await firestore.setDoc(ref, { ...local, updatedAt: firestore.serverTimestamp() });
      safeSet(pendingKey(user.uid, childId), "0"); apply(loadLocal(childId)); return true;
    } catch (error) { console.warn("Không thể đồng bộ cài đặt của bé; tiếp tục dùng bản local.", error); return false; }
  }
  async function persist(next) {
    const childId = activeChildId(); if (!user || !childId) return false;
    settings = saveLocal(next, childId); safeSet(pendingKey(), "1"); apply(settings); await sync(childId); return true;
  }

  function formValue() {
    return normalize({ settingsVersion: VERSION, dailyTimeLimitMinutes: $("#child-daily-time").value, dailyLessonLimit: $("#child-daily-lessons").value, breakEnabled: $("#child-break-enabled").checked, breakAfterMinutes: $("#child-break-after").value, breakDurationMinutes: $("#child-break-duration").value, allowedTimeEnabled: $("#child-allowed-enabled").checked, allowedStartTime: $("#child-allowed-start").value, allowedEndTime: $("#child-allowed-end").value, soundEnabled: $("#child-sound-enabled").checked, speechEnabled: $("#child-speech-enabled").checked });
  }
  function render() {
    const form = $("#child-settings-form"), child = activeChild(); if (!form) return;
    $("#child-settings-context-avatar").textContent = child?.avatar || "🧒"; $("#child-settings-context-name").textContent = child?.name || "Chưa chọn bé";
    $("#child-daily-time").value = settings.dailyTimeLimitMinutes ?? ""; $("#child-daily-lessons").value = settings.dailyLessonLimit ?? "";
    $("#child-break-enabled").checked = settings.breakEnabled; $("#child-break-after").value = settings.breakAfterMinutes ?? 20; $("#child-break-duration").value = settings.breakDurationMinutes ?? 10;
    $("#child-allowed-enabled").checked = settings.allowedTimeEnabled; $("#child-allowed-start").value = settings.allowedStartTime || "18:00"; $("#child-allowed-end").value = settings.allowedEndTime || "20:30";
    $("#child-sound-enabled").checked = settings.soundEnabled; $("#child-speech-enabled").checked = settings.speechEnabled;
    $("#child-break-options").hidden = !settings.breakEnabled; $("#child-allowed-options").hidden = !settings.allowedTimeEnabled;
    form.querySelectorAll("input, select, button").forEach((control) => { control.disabled = !user || !child; });
    $("#child-settings-pin-note").textContent = window.HocCungBeParentPin?.hasPin?.() ? "Thay đổi được bảo vệ bằng mã PIN phụ huynh." : "Nên đặt mã PIN phụ huynh để bảo vệ cài đặt.";
  }
  function ensureMarkup() {
    if (!$("#child-settings-section")) {
      const context = $("#dashboard-child-context");
      context?.insertAdjacentHTML("afterend", `<section class="parent-section child-settings" id="child-settings-section"><p class="eyebrow">Giới hạn sử dụng trong ứng dụng</p><h2>⚙️ Cài đặt cho bé</h2><div class="child-settings__context"><span id="child-settings-context-avatar">🧒</span><strong>Đang cài đặt cho: <b id="child-settings-context-name">Chưa chọn bé</b></strong></div><form id="child-settings-form"><div class="setting-card"><label for="child-daily-time"><strong>Giới hạn thời gian học mỗi ngày</strong><small>Không bắt đầu bài mới khi đã đủ thời gian.</small></label><select id="child-daily-time"><option value="">Không giới hạn</option><option value="15">15 phút</option><option value="20">20 phút</option><option value="30">30 phút</option><option value="45">45 phút</option><option value="60">60 phút</option></select></div><div class="setting-card"><label for="child-daily-lessons"><strong>Giới hạn số bài mỗi ngày</strong><small>Đếm quiz/lesson hoàn thành trong ngày.</small></label><select id="child-daily-lessons"><option value="">Không giới hạn</option><option value="3">3 bài</option><option value="5">5 bài</option><option value="10">10 bài</option><option value="15">15 bài</option></select></div><div class="setting-card setting-card--stack"><label class="setting-toggle"><span><strong>Nhắc bé nghỉ</strong><small>Hiện lời nhắc nhẹ nhàng, không reset tiến độ.</small></span><input id="child-break-enabled" type="checkbox" role="switch" /></label><div class="setting-options" id="child-break-options"><label>Nhắc nghỉ sau<select id="child-break-after"><option value="15">15 phút</option><option value="20">20 phút</option><option value="30">30 phút</option></select></label><label>Nghỉ trong<select id="child-break-duration"><option value="5">5 phút</option><option value="10">10 phút</option><option value="15">15 phút</option></select></label></div></div><div class="setting-card setting-card--stack"><label class="setting-toggle"><span><strong>Chỉ cho phép học trong khung giờ</strong><small>Dùng giờ địa phương của thiết bị trong giai đoạn hiện tại.</small></span><input id="child-allowed-enabled" type="checkbox" role="switch" /></label><div class="setting-options" id="child-allowed-options"><label>Từ<input id="child-allowed-start" type="time" /></label><label>Đến<input id="child-allowed-end" type="time" /></label></div></div><div class="setting-card"><label class="setting-toggle"><span><strong>Âm thanh</strong><small>Hiệu ứng âm thanh cho riêng bé này.</small></span><input id="child-sound-enabled" type="checkbox" role="switch" /></label></div><div class="setting-card"><label class="setting-toggle"><span><strong>Đọc câu hỏi</strong><small>Tắt tự đọc; nút đọc tay vẫn theo khả năng trình duyệt.</small></span><input id="child-speech-enabled" type="checkbox" role="switch" /></label></div><p class="child-settings__note" id="child-settings-pin-note"></p><p class="account-status" id="child-settings-status" role="status"></p><button class="primary-button" type="submit">Lưu cài đặt cho bé</button></form></section>`);
    }
    if (!$("#learning-limit-dialog")) document.body.insertAdjacentHTML("beforeend", `<div class="learning-limit-dialog" id="learning-limit-dialog" hidden><section role="dialog" aria-modal="true" aria-labelledby="learning-limit-title"><span>🌙</span><h2 id="learning-limit-title">Tạm dừng học nhé</h2><p id="learning-limit-message"></p><button class="primary-button" type="button" data-limit-close>Đã hiểu</button></section></div><div class="learning-break-overlay" id="learning-break-overlay" hidden><section><span>🌿</span><h2>Đến giờ nghỉ rồi</h2><p>Nghỉ mắt một chút nhé.</p><strong id="learning-break-countdown"></strong><button class="secondary-button" type="button" data-break-close>Tiếp tục khi hết giờ</button></section></div>`);
    bind(); render();
  }
  function bind() {
    const form = $("#child-settings-form"); if (!form || form.dataset.bound) return; form.dataset.bound = "true";
    form.addEventListener("change", (event) => { if (event.target.id === "child-break-enabled") $("#child-break-options").hidden = !event.target.checked; if (event.target.id === "child-allowed-enabled") $("#child-allowed-options").hidden = !event.target.checked; });
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); const status = $("#child-settings-status"), next = formValue();
      const authorized = await (window.HocCungBeParentPin?.authorizeChange?.("cài đặt cho bé") ?? Promise.resolve(true));
      if (!authorized) { status.textContent = "Chưa xác thực mã PIN phụ huynh."; status.className = "account-status is-error"; return; }
      status.textContent = "Đang lưu…"; status.className = "account-status"; await persist(next); status.textContent = navigator.onLine ? "Đã lưu cài đặt cho bé." : "Đã lưu trên thiết bị; sẽ đồng bộ khi có mạng."; status.className = "account-status is-success";
    });
    document.addEventListener("click", (event) => { if (event.target.closest("[data-limit-close]")) $("#learning-limit-dialog").hidden = true; if (event.target.closest("[data-break-close]")) closeBreak(); });
  }
  async function loadActive() { generation += 1; stopLearningSession(); dismissBreak(true); settings = loadLocal(); apply(settings); await sync(activeChildId(), generation); }
  async function configure(options) { firestore = options?.firestore || null; db = options?.db || null; user = options?.user || null; ensureMarkup(); await loadActive(); }
  function disconnect() { generation += 1; user = null; firestore = null; db = null; stopLearningSession(); dismissBreak(true); settings = defaults(); apply(settings); }

  window.addEventListener("hoc-cung-be:child-changed", loadActive);
  window.addEventListener("online", () => { if (safeGet(pendingKey()) === "1") sync(); });
  window.addEventListener("hoc-cung-be:parent-dashboard-open", ensureMarkup);
  ensureMarkup();
  window.HocCungBeChildSettings = { configure, disconnect, loadLocal, saveLocal, normalize, valid, getSettings: () => ({ ...settings }), evaluateStart, canStartLesson, todayUsage, withinAllowedTime, startLearningSession, stopLearningSession, dismissBreak, sync, localKey, cloudPath: (uid, childId) => `users/${uid}/children/${childId}/settings/learning` };

  async function selfTests() {
    const results = [], test = (id, passed) => results.push({ id, passed: Boolean(passed) });
    const a = normalize({ ...defaults(), dailyTimeLimitMinutes: 15, soundEnabled: false }), b = normalize({ ...defaults(), dailyLessonLimit: 3, speechEnabled: false });
    const progress = { studyTime: { studyTimeByDate: { [dateKey()]: 15 * 60 } }, history: Array.from({ length: 3 }, (_, index) => ({ completedAt: new Date(Date.now() - index * 1000).toISOString() })) };
    let rules = "", sw = "", script = "", authSource = "", css = "";
    try { [rules, sw, script, authSource, css] = await Promise.all([fetch("firestore.rules", { cache: "no-store" }).then((r) => r.text()), fetch("service-worker.js", { cache: "no-store" }).then((r) => r.text()), fetch("script.js", { cache: "no-store" }).then((r) => r.text()), fetch("parent-auth.js", { cache: "no-store" }).then((r) => r.text()), fetch("styles.css", { cache: "no-store" }).then((r) => r.text())]); } catch {}
    test("A", $("#parent-account-entry")?.hidden !== false && $("#home-parent-section")?.hidden !== false && $("#header-parent-entry")?.hidden !== false);
    test("B", Boolean(document.querySelector('[data-auth-open="login"]'))); test("C", Boolean(document.querySelector('[data-auth-open="register"]'))); test("D", document.body.textContent.includes("Học thử"));
    test("E", script.includes('data-auth-only') && script.includes('parentEntry.hidden = !currentLearningUser') && Boolean($("#parent-section-nav")));
    test("F", Boolean($("#child-settings-section")) && Boolean($("#child-settings-form")) && document.body.textContent.includes("Đang cài đặt cho:"));
    test("G", localKey("child-A") === `${LOCAL_PREFIX}child-A` && localKey("child-A") !== localKey("child-B")); test("H", JSON.stringify(a) !== JSON.stringify(b) && a.dailyTimeLimitMinutes === 15 && b.dailyLessonLimit === 3);
    test("I", !evaluateStart(progress, a).allowed); test("J", !evaluateStart(progress, b).allowed); test("K", typeof showBreak === "function" && typeof stopLearningSession === "function");
    test("L", !withinAllowedTime({ ...defaults(), allowedTimeEnabled: true, allowedStartTime: "18:00", allowedEndTime: "20:30" }, new Date(2026, 9, 3, 12, 0)) && withinAllowedTime({ ...defaults(), allowedTimeEnabled: true, allowedStartTime: "22:00", allowedEndTime: "06:00" }, new Date(2026, 9, 3, 23, 0)));
    test("M", a.soundEnabled === false && b.soundEnabled === true); test("N", a.speechEnabled === true && b.speechEnabled === false); test("O", typeof window.HocCungBeParentPin?.authorizeChange === "function");
    test("P", loadLocal("offline-test").settingsVersion === 1 && typeof sync === "function" && localKey("offline-test") === `${LOCAL_PREFIX}offline-test`); test("Q", window.HocCungBeChildSettings?.cloudPath("uid", "child") === "users/uid/children/child/settings/learning");
    test("R", rules.includes("ownsUserData(userId)") && rules.includes("validChildSettings") && rules.includes("match /settings/{settingsId}") && !rules.includes("allow delete"));
    test("S", script.includes('hoc-cung-be:child-will-change') && script.includes('hoc-cung-be:child-changed') && typeof loadActive === "function" && typeof dismissBreak === "function"); test("T", typeof window.completeGuestTrialLevel === "function" || document.body.textContent.includes("2 level học thử"));
    test("U", typeof window.HocCungBeCloudSync?.syncNow === "function"); test("V", document.body.textContent.includes("Liên kết số điện thoại") || document.body.textContent.includes("Số điện thoại"));
    test("W", document.querySelector('meta[name="viewport"]')?.content.includes("width=device-width") && css.includes("@media (max-width: 760px)") && css.includes(".setting-card { grid-template-columns: 1fr")); test("X", sw.includes("hoc-cung-be-v18") && sw.includes('"./child-settings.js"') && document.querySelector('link[rel="manifest"]'));
    return { passed: results.every((item) => item.passed), results };
  }
  window.__hocCungBeChildSettingsTests = selfTests();
})();