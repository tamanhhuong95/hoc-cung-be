"use strict";

// One Firebase parent account can own multiple independent child learning profiles.
(() => {
  const ACTIVE_CHILD_KEY = "hoc-cung-be:active-child";
  const CHILD_PROGRESS_KEY_PREFIX = "hoc-cung-be:progress:";
  const LEGACY_PROGRESS_KEY = "hoc-cung-be:math-grade-1-progress";
  const COURSE_IDS = ["math-grade-1", "vietnamese-grade-1"];
  const MAX_CHILDREN = 5;
  const CHILD_VERSION = 1;
  const MIGRATION_VERSION = 1;
  const AVATARS = ["🧒", "👧", "👦", "🐻", "🐰", "🐼", "🦊", "🐱"];
  let firestore = null, db = null, user = null, children = [], activeId = null, migrationPromise = null, loadError = null, returnScreenId = "home-screen";
  const $ = (selector, root = document) => root.querySelector(selector);
  const safeGet = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const safeRemove = (key) => { try { localStorage.removeItem(key); } catch {} };
  const parse = (value) => { try { return value ? JSON.parse(value) : null; } catch { return null; } };
  const childProgressKey = (childId, courseId = "math-grade-1") => `${CHILD_PROGRESS_KEY_PREFIX}${childId}:${courseId}`;
  const legacyChildProgressKey = (childId) => `${CHILD_PROGRESS_KEY_PREFIX}${childId}`;
  const validChildId = (value) => typeof value === "string" && /^[A-Za-z0-9_-]{8,128}$/.test(value);
  const normalizeName = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 60);
  const normalizeBirthYear = (value) => value === "" || value == null ? null : Number.parseInt(value, 10);
  const validBirthYear = (value, year = new Date().getFullYear()) => value === null || (Number.isInteger(value) && value >= 2000 && value <= year);
  const normalizeAvatar = (value) => AVATARS.includes(value) ? value : AVATARS[0];
  const childPayload = (values) => ({ childVersion: CHILD_VERSION, name: normalizeName(values.name), grade: "grade-1", birthYear: normalizeBirthYear(values.birthYear), avatar: normalizeAvatar(values.avatar) });
  const validPayload = (value) => Boolean(value && value.childVersion === CHILD_VERSION && value.name && value.name.length <= 60 && value.grade === "grade-1" && validBirthYear(value.birthYear) && AVATARS.includes(value.avatar));
  const normalizeChild = (id, data = {}) => ({ id, childVersion: CHILD_VERSION, name: normalizeName(data.name) || "Bé", grade: "grade-1", birthYear: validBirthYear(data.birthYear) ? data.birthYear : null, avatar: normalizeAvatar(data.avatar), createdAt: data.createdAt || null, updatedAt: data.updatedAt || null, summary: data.summary || { completed: 0, stars: 0 } });
  const progressSummary = (raw, courseId = "math-grade-1") => { const previous = window.HocCungBeLearning?.getActiveCourseId?.(); if (previous && previous !== courseId) window.HocCungBeLearning?.setActiveCourse?.(courseId); const progress = typeof window.normalizeProgress === "function" ? window.normalizeProgress(raw || {}) : raw || {}; if (previous && previous !== courseId) window.HocCungBeLearning?.setActiveCourse?.(previous); const levels = Object.values(progress.levels || {}); return { completed: levels.filter((item) => item?.completed).length, stars: levels.reduce((sum, item) => sum + Math.max(0, Number(item?.bestStars) || 0), 0) }; };

  function getActiveChild() { return children.find((child) => child.id === activeId) || null; }
  function getChildren() { return children.map((child) => ({ ...child, summary: { ...child.summary } })); }
  function dispatch(name, detail = {}) { window.dispatchEvent(new CustomEvent(name, { detail })); }
  function currentScreenId() { return document.querySelector(".screen:not([hidden])")?.id || "home-screen"; }
  function rememberReturnScreen() { const current = currentScreenId(); if (!current.startsWith("child-")) returnScreenId = current; }
  function notify(message) { const toast = $("#toast"); if (!toast) return; clearTimeout(notify.timer); toast.textContent = message; toast.classList.add("is-visible"); notify.timer = setTimeout(() => toast.classList.remove("is-visible"), 3200); }

  function ensureMarkup() {
    if (!$("#child-context-bar")) {
      const bar = document.createElement("section");
      bar.id = "child-context-bar"; bar.className = "child-context-bar"; bar.hidden = true;
      bar.innerHTML = `<span data-active-child-avatar>🧒</span><strong>Đang học: <b data-active-child-name>Chưa chọn bé</b></strong><button class="text-button" type="button" data-child-switch>Đổi bé</button>`;
      $("#main-content")?.prepend(bar);
    }
    if (!$("#child-select-screen")) {
      $("#main-content")?.insertAdjacentHTML("beforeend", `
        <section class="screen child-screen" id="child-select-screen" hidden><div class="child-panel" role="dialog" aria-modal="true" aria-labelledby="child-select-title"><div class="child-panel__top"><button class="back-button" type="button" data-child-close>← Quay lại</button><button class="child-panel__close" type="button" data-child-close aria-label="Đóng màn hình chọn bé">×</button></div><p class="eyebrow">Hồ sơ học tập</p><h1 id="child-select-title" tabindex="-1">Chọn bé đang học</h1><p>Mỗi bé có tiến độ, lịch sử và thời gian học hoàn toàn riêng.</p><div class="child-grid" id="child-grid"></div><div class="child-actions"><button class="primary-button" id="child-add-button" type="button" data-child-add>+ Thêm bé</button></div><p class="account-status" id="child-list-status" role="status" aria-live="polite"></p></div></section>
        <section class="screen child-screen" id="child-form-screen" hidden><div class="child-panel" role="dialog" aria-modal="true" aria-labelledby="child-form-title"><div class="child-panel__top"><button class="back-button" type="button" data-child-back>← Chọn bé</button><button class="child-panel__close" type="button" data-child-cancel aria-label="Đóng form hồ sơ bé">×</button></div><p class="eyebrow">Hồ sơ học tập</p><h1 id="child-form-title">Thêm bé</h1><form id="child-form" novalidate><input id="child-edit-id" type="hidden" /><label>Tên bé *<input id="child-name" maxlength="60" autocomplete="off" required /></label><label>Năm sinh <small>(không bắt buộc)</small><input id="child-birth-year" type="number" min="2000" max="${new Date().getFullYear()}" inputmode="numeric" /></label><label>Lớp<select id="child-grade" disabled><option value="grade-1">Lớp 1</option></select></label><fieldset class="avatar-picker"><legend>Avatar</legend>${AVATARS.map((avatar, index) => `<label><input type="radio" name="child-avatar" value="${avatar}"${index ? "" : " checked"} /><span>${avatar}</span></label>`).join("")}</fieldset><p class="account-status" id="child-form-status" role="status" aria-live="polite"></p><div class="child-form-actions"><button class="secondary-button" type="button" data-child-cancel>Hủy</button><button class="primary-button" type="submit" id="child-form-submit">Tạo hồ sơ</button></div></form></div></section>`);
    }
    if (!$("#dashboard-child-context")) {
      const heading = $("#parent-dashboard-screen .parent-dashboard__heading");
      heading?.insertAdjacentHTML("afterend", `<section class="dashboard-child-context" id="dashboard-child-context"><span data-active-child-avatar>🧒</span><strong>Đang xem tiến độ của: <b data-active-child-name>Chưa chọn bé</b></strong><button class="secondary-button" type="button" data-child-switch>Đổi bé</button></section>`);
    }
    ensureManagementSections(); bindUi(); renderContext();
  }

  function managementSection(id) {
    return `<section class="account-subpanel child-management" id="${id}" data-child-management><div class="child-management__heading"><div><p class="eyebrow">Gia đình</p><h2>Hồ sơ của bé</h2><p>Quản lý hồ sơ và chọn đúng bé trước khi học hoặc xem tiến độ.</p></div><button class="primary-button" type="button" data-child-add>+ Thêm bé</button></div><div class="child-management__grid" data-child-management-grid></div><div class="child-management__error" data-child-management-error hidden><p>Không thể tải hồ sơ của bé. Vui lòng thử lại.</p><button class="secondary-button" type="button" data-child-retry>Thử lại</button></div><p class="account-status" data-child-management-status role="status" aria-live="polite"></p></section>`;
  }
  function ensureManagementSections() {
    const accountPanel = $("#account-me-screen .account-panel");
    if (accountPanel && !$("#account-child-management")) accountPanel.insertAdjacentHTML("beforeend", managementSection("account-child-management"));
    const dashboardContext = $("#dashboard-child-context");
    if (dashboardContext && !$("#dashboard-child-management")) dashboardContext.insertAdjacentHTML("afterend", managementSection("dashboard-child-management"));
    renderManagement();
  }

  function showOnly(screen) {
    document.querySelectorAll(".screen").forEach((item) => { item.hidden = item !== screen; });
    screen.hidden = false; window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function openSelector(options = {}) { if (!user) return; ensureMarkup(); if (!options.preserveReturn) rememberReturnScreen(); renderList(); showOnly($("#child-select-screen")); $("#child-select-title")?.focus?.(); }
  function closeSelector() { showOnly($("#" + returnScreenId) || $("#home-screen")); }
  function openForm(child = null) {
    ensureMarkup(); if (!currentScreenId().startsWith("child-")) rememberReturnScreen(); const form = $("#child-form"); form.reset(); $("#child-edit-id").value = child?.id || ""; $("#child-form-title").textContent = child ? "Chỉnh sửa hồ sơ bé" : "Thêm bé"; $("#child-form-submit").textContent = child ? "Lưu thay đổi" : "Tạo hồ sơ"; $("#child-name").value = child?.name || ""; $("#child-birth-year").value = child?.birthYear || ""; const avatar = child?.avatar || AVATARS[0]; form.querySelector(`input[name="child-avatar"][value="${avatar}"]`).checked = true; $("#child-form-status").textContent = ""; showOnly($("#child-form-screen")); $("#child-name").focus();
  }

  function renderContext() {
    const child = getActiveChild(); const bar = $("#child-context-bar"); if (bar) bar.hidden = !user || !child;
    document.querySelectorAll("[data-active-child-name]").forEach((element) => { element.textContent = child?.name || "Chưa chọn bé"; });
    document.querySelectorAll("[data-active-child-avatar]").forEach((element) => { element.textContent = child?.avatar || "🧒"; });
    renderManagement();
  }

  function refreshLocalSummary(child) { const math = parse(safeGet(childProgressKey(child.id, "math-grade-1"))) || parse(safeGet(legacyChildProgressKey(child.id))); const vietnamese = parse(safeGet(childProgressKey(child.id, "vietnamese-grade-1"))); const mathSummary = progressSummary(math, "math-grade-1"), vietnameseSummary = progressSummary(vietnamese, "vietnamese-grade-1"); child.summary = { math: mathSummary, vietnamese: vietnameseSummary, completed: mathSummary.completed + vietnameseSummary.completed, stars: mathSummary.stars + vietnameseSummary.stars }; return child; }
  function childCard(child, actionText) {
    refreshLocalSummary(child); const active = child.id === activeId;
    const card = document.createElement("article"); card.className = `child-card${active ? " is-active" : ""}`; card.dataset.childCard = child.id;
    card.innerHTML = `<span class="child-card__avatar" aria-hidden="true">${child.avatar}</span><div class="child-card__content"><h3>${escapeHtml(child.name)}</h3><p>Lớp 1</p><p><strong>${child.summary.completed}</strong> level đã hoàn thành · <strong>${child.summary.stars}</strong> sao</p>${active ? '<span class="child-card__active">✓ Đang học</span>' : ""}</div><div class="child-card__actions"><button class="primary-button" type="button" data-child-select="${child.id}"${active ? " disabled" : ""}>${active ? "Đang học" : actionText}</button><button class="secondary-button" type="button" data-child-edit="${child.id}">Chỉnh sửa</button></div>`;
    return card;
  }
  function setAddState(button, atLimit) { if (!button) return; button.disabled = atLimit || !user; button.setAttribute("aria-disabled", String(button.disabled)); }
  function renderManagement() {
    document.querySelectorAll("[data-child-management]").forEach((section) => {
      section.hidden = !user; if (!user) return;
      const grid = $("[data-child-management-grid]", section), error = $("[data-child-management-error]", section), status = $("[data-child-management-status]", section), add = $("[data-child-add]", section);
      error.hidden = !loadError; grid.hidden = Boolean(loadError); grid.replaceChildren();
      if (!loadError) children.forEach((child) => grid.append(childCard(child, "Chọn bé này")));
      const atLimit = children.length >= MAX_CHILDREN; setAddState(add, atLimit || Boolean(loadError)); status.textContent = atLimit ? `Tài khoản đã có tối đa ${MAX_CHILDREN} hồ sơ bé.` : "";
    });
  }
  function renderList() {
    const grid = $("#child-grid"); if (!grid) return; grid.replaceChildren();
    if (loadError) grid.innerHTML = `<div class="child-load-error"><p>Không thể tải hồ sơ của bé. Vui lòng thử lại.</p><button class="secondary-button" type="button" data-child-retry>Thử lại</button></div>`;
    else children.forEach((child) => grid.append(childCard(child, "Tiếp tục học")));
    const atLimit = children.length >= MAX_CHILDREN; setAddState($("#child-add-button"), atLimit || Boolean(loadError)); $("#child-list-status").textContent = atLimit ? `Tài khoản đã có tối đa ${MAX_CHILDREN} hồ sơ bé.` : "";
    renderManagement();
  }
  function escapeHtml(value) { const node = document.createElement("span"); node.textContent = value; return node.innerHTML; }

  async function loadSummary(childId) {
    const localMath = parse(safeGet(childProgressKey(childId, "math-grade-1"))) || parse(safeGet(legacyChildProgressKey(childId))); const localVietnamese = parse(safeGet(childProgressKey(childId, "vietnamese-grade-1")));
    if (localMath || localVietnamese) { const math = progressSummary(localMath, "math-grade-1"), vietnamese = progressSummary(localVietnamese, "vietnamese-grade-1"); return { math, vietnamese, completed: math.completed + vietnamese.completed, stars: math.stars + vietnamese.stars }; }
    if (!firestore || !db || !user) return { math: { completed: 0, stars: 0 }, vietnamese: { completed: 0, stars: 0 }, completed: 0, stars: 0 };
    try { const snapshots = await Promise.all(COURSE_IDS.map((courseId) => firestore.getDoc(firestore.doc(db, "users", user.uid, "children", childId, "progress", courseId)))); const math = progressSummary(snapshots[0].exists() ? snapshots[0].data() : {}, "math-grade-1"), vietnamese = progressSummary(snapshots[1].exists() ? snapshots[1].data() : {}, "vietnamese-grade-1"); return { math, vietnamese, completed: math.completed + vietnamese.completed, stars: math.stars + vietnamese.stars }; } catch { return { math: { completed: 0, stars: 0 }, vietnamese: { completed: 0, stars: 0 }, completed: 0, stars: 0 }; }
  }

  async function loadChildren() {
    if (!firestore || !db || !user) { children = []; return children; }
    const snapshot = await firestore.getDocs(firestore.collection(db, "users", user.uid, "children"));
    children = await Promise.all(snapshot.docs.map(async (item) => normalizeChild(item.id, { ...item.data(), summary: await loadSummary(item.id) })));
    children.sort((a, b) => String(a.createdAt?.toMillis?.() || a.createdAt || "").localeCompare(String(b.createdAt?.toMillis?.() || b.createdAt || "")) || a.name.localeCompare(b.name, "vi"));
    return children;
  }

  async function migrateLegacyProgress() {
    if (migrationPromise) return migrationPromise;
    migrationPromise = (async () => {
      if (!firestore || !db || !user || children.length) return null;
      const parentRef = firestore.doc(db, "users", user.uid); const legacyRef = firestore.doc(db, "users", user.uid, "progress", "math-grade-1"); const newChildRef = firestore.doc(firestore.collection(db, "users", user.uid, "children")); const newProgressRef = firestore.doc(db, "users", user.uid, "children", newChildRef.id, "progress", "math-grade-1");
      const migratedId = await firestore.runTransaction(db, async (transaction) => {
        const parentSnap = await transaction.get(parentRef);
        if (parentSnap.exists() && parentSnap.data().childrenMigrationVersion === MIGRATION_VERSION) return parentSnap.data().childrenMigrationChildId || null;
        const legacySnap = await transaction.get(legacyRef);
        if (!legacySnap.exists()) return null;
        const now = firestore.serverTimestamp();
        transaction.set(newChildRef, { childVersion: CHILD_VERSION, name: "Bé 1", grade: "grade-1", birthYear: null, avatar: AVATARS[0], createdAt: now, updatedAt: now });
        transaction.set(newProgressRef, legacySnap.data());
        transaction.set(parentRef, { childrenMigrationVersion: MIGRATION_VERSION, childrenMigrationChildId: newChildRef.id, updatedAt: now }, { merge: true });
        return newChildRef.id;
      });
      if (!migratedId) return null;
      const verification = await firestore.getDoc(firestore.doc(db, "users", user.uid, "children", migratedId, "progress", "math-grade-1"));
      if (!verification.exists()) throw new Error("Không thể xác minh progress sau migration.");
      const legacyLocal = safeGet(LEGACY_PROGRESS_KEY); const migratedLocalKey = childProgressKey(migratedId, "math-grade-1");
      if (legacyLocal && !safeGet(migratedLocalKey)) safeSet(migratedLocalKey, legacyLocal);
      return migratedId;
    })();
    try { return await migrationPromise; } finally { migrationPromise = null; }
  }

  async function createChild(values) {
    if (!user || !firestore || !db) throw new Error("Vui lòng đăng nhập.");
    if (children.length >= MAX_CHILDREN) throw new Error(`Mỗi tài khoản chỉ được tối đa ${MAX_CHILDREN} bé.`);
    const payload = childPayload(values); if (!validPayload(payload)) throw new Error("Thông tin hồ sơ bé chưa hợp lệ.");
    const ref = await firestore.addDoc(firestore.collection(db, "users", user.uid, "children"), { ...payload, createdAt: firestore.serverTimestamp(), updatedAt: firestore.serverTimestamp() });
    const child = normalizeChild(ref.id, payload); child.summary = { completed: 0, stars: 0 }; children.push(child); loadError = null; renderList(); return child;
  }

  async function updateChild(childId, values) {
    const existing = children.find((child) => child.id === childId); if (!existing || !user || !firestore || !db) throw new Error("Không tìm thấy hồ sơ bé.");
    const payload = childPayload({ ...values, grade: existing.grade }); if (!validPayload(payload)) throw new Error("Thông tin hồ sơ bé chưa hợp lệ.");
    await firestore.updateDoc(firestore.doc(db, "users", user.uid, "children", childId), { name: payload.name, birthYear: payload.birthYear, avatar: payload.avatar, updatedAt: firestore.serverTimestamp() });
    Object.assign(existing, { name: payload.name, birthYear: payload.birthYear, avatar: payload.avatar }); renderList(); renderContext(); dispatch("hoc-cung-be:child-profile-updated", { child: { ...existing } }); return existing;
  }

  async function selectChild(childId, options = {}) {
    const child = children.find((item) => item.id === childId); if (!child || !validChildId(childId)) return false;
    const previousChildId = activeId; if (previousChildId !== childId) dispatch("hoc-cung-be:child-will-change", { previousChildId, childId });
    activeId = childId; safeSet(ACTIVE_CHILD_KEY, childId); renderContext(); renderList();
    if (previousChildId !== childId) dispatch("hoc-cung-be:child-changed", { previousChildId, childId, child: { ...child } });
    if (!options.stayOpen) closeSelector(); return true;
  }

  async function configure(options) {
    firestore = options?.firestore || null; db = options?.db || null; user = options?.user || null; ensureMarkup();
    if (!user) { children = []; activeId = null; loadError = null; safeRemove(ACTIVE_CHILD_KEY); renderContext(); return null; }
    loadError = null; renderManagement();
    try { await loadChildren(); } catch (error) { children = []; activeId = null; loadError = error || new Error("Không thể tải hồ sơ của bé."); renderList(); renderContext(); openSelector(); return null; }
    if (!children.length) { const migratedId = await migrateLegacyProgress(); if (migratedId) await loadChildren(); }
    const saved = safeGet(ACTIVE_CHILD_KEY); activeId = children.some((child) => child.id === saved) ? saved : null;
    if (children.length === 1) await selectChild(children[0].id, { stayOpen: true });
    else if (children.length > 1) { renderContext(); openSelector(); }
    else openForm();
    renderList(); renderContext(); return getActiveChild();
  }

  async function retryLoad() { if (!user) return; loadError = null; renderList(); await configure({ firestore, db, user }); }
  function disconnect() { user = null; children = []; activeId = null; loadError = null; safeRemove(ACTIVE_CHILD_KEY); renderContext(); }

  function bindUi() {
    if (document.body.dataset.childUiBound) return; document.body.dataset.childUiBound = "true";
    document.addEventListener("click", async (event) => {
      const select = event.target.closest("[data-child-select]"); if (select) await selectChild(select.dataset.childSelect);
      const edit = event.target.closest("[data-child-edit]"); if (edit) openForm(children.find((child) => child.id === edit.dataset.childEdit));
      if (event.target.closest("[data-child-add]")) openForm();
      if (event.target.closest("[data-child-retry]")) await retryLoad();
      if (event.target.closest("[data-child-back]")) openSelector({ preserveReturn: true });
      if (event.target.closest("[data-child-cancel]")) openSelector({ preserveReturn: true });
      if (event.target.closest("[data-child-close]")) closeSelector();
    });
    window.addEventListener("keydown", (event) => { if (event.key !== "Escape") return; if (!$("#child-form-screen")?.hidden) openSelector({ preserveReturn: true }); else if (!$("#child-select-screen")?.hidden) closeSelector(); });
    $("#child-form")?.addEventListener("submit", async (event) => {
      event.preventDefault(); const submit = $("button[type=submit]", event.currentTarget), status = $("#child-form-status"), childId = $("#child-edit-id").value, values = { name: $("#child-name").value, birthYear: $("#child-birth-year").value, avatar: event.currentTarget.querySelector('input[name="child-avatar"]:checked')?.value };
      submit.disabled = true; status.textContent = "Đang lưu..."; status.className = "account-status";
      try { const child = childId ? await updateChild(childId, values) : await createChild(values); const message = childId ? "Đã cập nhật hồ sơ của bé." : `Đã tạo hồ sơ cho ${child.name}.`; notify(message); await selectChild(child.id); }
      catch (error) { status.textContent = error.message || "Không thể lưu hồ sơ bé."; status.className = "account-status is-error"; }
      finally { submit.disabled = false; }
    });
  }

  async function runSelfTests() {
    const results = [], test = (id, passed) => results.push({ id, passed: Boolean(passed) });
    const first = normalizeChild("child_A123456", childPayload({ name: "Bé A", birthYear: 2019, avatar: "🐻" })); const second = normalizeChild("child_B123456", childPayload({ name: "Bé B", birthYear: "", avatar: "🐰" }));
    const progressA = { levels: { "addition-1": { completed: true, bestStars: 3 } } }; const progressB = { levels: { "addition-1": { completed: false, bestStars: 0 } } };
    const sampleCard = childCard(first, "Chọn bé này"); const payload = childPayload({ name: "Bé 1", birthYear: 2018, avatar: "👧" });
    test("A", document.querySelectorAll("[data-child-management]").length >= 1 && document.body.textContent.includes("Hồ sơ của bé"));
    test("B", document.querySelectorAll("[data-child-add]").length >= 2 && $("#child-add-button")?.textContent.includes("+ Thêm bé"));
    test("C", validPayload(payload) && typeof createChild === "function");
    test("D", typeof renderList === "function" && typeof renderManagement === "function");
    test("E", children.length !== 1 || typeof selectChild === "function");
    test("F", $("#child-select-title")?.textContent === "Chọn bé đang học" && typeof openSelector === "function");
    test("G", sampleCard.querySelector(`[data-child-select="${first.id}"]`)?.textContent === "Chọn bé này");
    test("H", childCard(second, "Tiếp tục học").querySelector(`[data-child-select="${second.id}"]`)?.textContent === "Tiếp tục học");
    test("I", selectChild.toString().includes("child-will-change") && selectChild.toString().includes("child-changed") && !selectChild.toString().includes("signOut"));
    test("J", typeof updateChild === "function" && normalizeName(" Minh Anh ") === "Minh Anh");
    test("K", AVATARS.includes(payload.avatar) && childPayload({ ...payload, avatar: "🐼" }).avatar === "🐼");
    test("L", document.querySelectorAll("[data-active-child-name]").length >= 2 && document.querySelectorAll("[data-active-child-avatar]").length >= 2);
    test("M", $("#dashboard-child-context")?.textContent.includes("Đang xem tiến độ của:"));
    test("N", childProgressKey(first.id) !== childProgressKey(second.id) && progressSummary(progressA).stars === 3 && progressSummary(progressB).stars === 0);
    test("O", normalizeName(" Bé 1 ") === "Bé 1" && validPayload(payload) && MIGRATION_VERSION === 1);
    test("P", MAX_CHILDREN === 5 && createChild.toString().includes("children.length >= MAX_CHILDREN"));
    let rules = "", authSource = ""; try { [rules, authSource] = await Promise.all([fetch("firestore.rules", { cache: "no-store" }).then((response) => response.text()), fetch("parent-auth.js", { cache: "no-store" }).then((response) => response.text())]); } catch {}
    test("Q", !document.body.textContent.includes("Xóa bé") && rules.includes("match /children/{childId}") && !rules.includes("allow delete"));
    test("R", getComputedStyle($("#child-grid")).display === "grid" && document.querySelector('meta[name="viewport"]')?.content.includes("width=device-width"));
    test("S", document.querySelector('link[rel="manifest"]')?.getAttribute("href") === "manifest.webmanifest" && "serviceWorker" in navigator);
    test("T", authSource.includes("linkWithCredential") && authSource.includes("onAuthStateChanged") && safeGet("hoc-cung-be:parent-pin") === safeGet("hoc-cung-be:parent-pin"));
    return { passed: results.every((item) => item.passed), results };
  }

  ensureMarkup();
  window.HocCungBeChildren = { configure, disconnect, getChildren, getActiveChild, getActiveChildId: () => activeId, openSelector, createChild, updateChild, selectChild, childProgressKey, progressSummary };
  window.__hocCungBeChildProfilesTests = runSelfTests();
})();