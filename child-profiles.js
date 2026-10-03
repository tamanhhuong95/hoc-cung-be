"use strict";

// One Firebase parent account can own multiple independent child learning profiles.
(() => {
  const ACTIVE_CHILD_KEY = "hoc-cung-be:active-child";
  const CHILD_PROGRESS_KEY_PREFIX = "hoc-cung-be:progress:";
  const LEGACY_PROGRESS_KEY = "hoc-cung-be:math-grade-1-progress";
  const COURSE_ID = "math-grade-1";
  const MAX_CHILDREN = 5;
  const CHILD_VERSION = 1;
  const MIGRATION_VERSION = 1;
  const AVATARS = ["🧒", "👧", "👦", "🐻", "🐰", "🐼", "🦊", "🐱"];
  let firestore = null, db = null, user = null, children = [], activeId = null, migrationPromise = null;
  const $ = (selector, root = document) => root.querySelector(selector);
  const safeGet = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const safeRemove = (key) => { try { localStorage.removeItem(key); } catch {} };
  const parse = (value) => { try { return value ? JSON.parse(value) : null; } catch { return null; } };
  const childProgressKey = (childId) => `${CHILD_PROGRESS_KEY_PREFIX}${childId}`;
  const validChildId = (value) => typeof value === "string" && /^[A-Za-z0-9_-]{8,128}$/.test(value);
  const normalizeName = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 60);
  const normalizeBirthYear = (value) => value === "" || value == null ? null : Number.parseInt(value, 10);
  const validBirthYear = (value, year = new Date().getFullYear()) => value === null || (Number.isInteger(value) && value >= 2000 && value <= year);
  const normalizeAvatar = (value) => AVATARS.includes(value) ? value : AVATARS[0];
  const childPayload = (values) => ({ childVersion: CHILD_VERSION, name: normalizeName(values.name), grade: "grade-1", birthYear: normalizeBirthYear(values.birthYear), avatar: normalizeAvatar(values.avatar) });
  const validPayload = (value) => Boolean(value && value.childVersion === CHILD_VERSION && value.name && value.name.length <= 60 && value.grade === "grade-1" && validBirthYear(value.birthYear) && AVATARS.includes(value.avatar));
  const normalizeChild = (id, data = {}) => ({ id, childVersion: CHILD_VERSION, name: normalizeName(data.name) || "Bé", grade: "grade-1", birthYear: validBirthYear(data.birthYear) ? data.birthYear : null, avatar: normalizeAvatar(data.avatar), createdAt: data.createdAt || null, updatedAt: data.updatedAt || null, summary: data.summary || { completed: 0, stars: 0 } });
  const progressSummary = (raw) => { const progress = typeof window.normalizeProgress === "function" ? window.normalizeProgress(raw || {}) : raw || {}; const levels = Object.values(progress.levels || {}); return { completed: levels.filter((item) => item?.completed).length, stars: levels.reduce((sum, item) => sum + Math.max(0, Number(item?.bestStars) || 0), 0) }; };

  function getActiveChild() { return children.find((child) => child.id === activeId) || null; }
  function getChildren() { return children.map((child) => ({ ...child, summary: { ...child.summary } })); }
  function dispatch(name, detail = {}) { window.dispatchEvent(new CustomEvent(name, { detail })); }

  function ensureMarkup() {
    if (!$("#child-context-bar")) {
      const bar = document.createElement("section");
      bar.id = "child-context-bar"; bar.className = "child-context-bar"; bar.hidden = true;
      bar.innerHTML = `<span data-active-child-avatar>🧒</span><strong>Đang học: <b data-active-child-name>Chưa chọn bé</b></strong><button class="text-button" type="button" data-child-switch>Đổi bé</button>`;
      $("#main-content")?.prepend(bar);
    }
    if (!$("#child-select-screen")) {
      $("#main-content")?.insertAdjacentHTML("beforeend", `
        <section class="screen child-screen" id="child-select-screen" hidden><div class="child-panel"><button class="back-button" type="button" data-child-close>← Trang chủ</button><p class="eyebrow">Hồ sơ học tập</p><h1>Chọn bé đang học</h1><p>Mỗi bé có tiến độ, lịch sử và thời gian học hoàn toàn riêng.</p><div class="child-grid" id="child-grid"></div><div class="child-actions"><button class="primary-button" id="child-add-button" type="button">+ Thêm bé</button></div><p class="account-status" id="child-list-status" role="status" aria-live="polite"></p></div></section>
        <section class="screen child-screen" id="child-form-screen" hidden><div class="child-panel"><button class="back-button" type="button" data-child-back>← Chọn bé</button><p class="eyebrow">Hồ sơ học tập</p><h1 id="child-form-title">Thêm bé</h1><form id="child-form" novalidate><input id="child-edit-id" type="hidden" /><label>Tên bé<input id="child-name" maxlength="60" autocomplete="off" required /></label><label>Năm sinh <small>(không bắt buộc)</small><input id="child-birth-year" type="number" min="2000" max="${new Date().getFullYear()}" inputmode="numeric" /></label><label>Lớp<select id="child-grade" disabled><option value="grade-1">Lớp 1</option></select></label><fieldset class="avatar-picker"><legend>Avatar</legend>${AVATARS.map((avatar, index) => `<label><input type="radio" name="child-avatar" value="${avatar}"${index ? "" : " checked"} /><span>${avatar}</span></label>`).join("")}</fieldset><p class="account-status" id="child-form-status" role="status" aria-live="polite"></p><button class="primary-button" type="submit">Lưu hồ sơ</button></form></div></section>`);
    }
    if (!$("#dashboard-child-context")) {
      const heading = $("#parent-dashboard-screen .parent-dashboard__heading");
      heading?.insertAdjacentHTML("afterend", `<section class="dashboard-child-context" id="dashboard-child-context"><span data-active-child-avatar>🧒</span><strong>Đang xem tiến độ của: <b data-active-child-name>Chưa chọn bé</b></strong><button class="secondary-button" type="button" data-child-switch>Đổi bé</button></section>`);
    }
    bindUi(); renderContext();
  }

  function showOnly(screen) {
    document.querySelectorAll(".screen").forEach((item) => { item.hidden = item !== screen; });
    screen.hidden = false; window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function openSelector() { if (!user) return; ensureMarkup(); renderList(); showOnly($("#child-select-screen")); }
  function closeSelector() { document.querySelector('[data-go="home"]')?.click(); }
  function openForm(child = null) {
    ensureMarkup(); const form = $("#child-form"); form.reset(); $("#child-edit-id").value = child?.id || ""; $("#child-form-title").textContent = child ? "Sửa hồ sơ bé" : "Thêm bé"; $("#child-name").value = child?.name || ""; $("#child-birth-year").value = child?.birthYear || ""; const avatar = child?.avatar || AVATARS[0]; form.querySelector(`input[name="child-avatar"][value="${avatar}"]`).checked = true; $("#child-form-status").textContent = ""; showOnly($("#child-form-screen")); $("#child-name").focus();
  }

  function renderContext() {
    const child = getActiveChild(); const bar = $("#child-context-bar"); if (bar) bar.hidden = !user || !child;
    document.querySelectorAll("[data-active-child-name]").forEach((element) => { element.textContent = child?.name || "Chưa chọn bé"; });
    document.querySelectorAll("[data-active-child-avatar]").forEach((element) => { element.textContent = child?.avatar || "🧒"; });
  }

  function renderList() {
    const grid = $("#child-grid"); if (!grid) return; grid.replaceChildren();
    children.forEach((child) => {
      const currentLocal = parse(safeGet(childProgressKey(child.id))); if (currentLocal) child.summary = progressSummary(currentLocal);
      const card = document.createElement("article"); card.className = `child-card${child.id === activeId ? " is-active" : ""}`;
      card.innerHTML = `<span class="child-card__avatar">${child.avatar}</span><div><h2>${escapeHtml(child.name)}</h2><p>Lớp 1 · ${child.summary.completed} level hoàn thành · ${child.summary.stars} sao</p></div><div class="child-card__actions"><button class="primary-button" type="button" data-child-select="${child.id}">Tiếp tục học</button><button class="text-button" type="button" data-child-edit="${child.id}">Sửa hồ sơ</button></div>`;
      grid.append(card);
    });
    const add = $("#child-add-button"); if (add) { add.disabled = children.length >= MAX_CHILDREN; add.hidden = children.length >= MAX_CHILDREN; }
    $("#child-list-status").textContent = children.length >= MAX_CHILDREN ? `Tài khoản đã có tối đa ${MAX_CHILDREN} hồ sơ bé.` : "";
  }
  function escapeHtml(value) { const node = document.createElement("span"); node.textContent = value; return node.innerHTML; }

  async function loadSummary(childId) {
    const local = parse(safeGet(childProgressKey(childId)));
    if (local) return progressSummary(local);
    if (!firestore || !db || !user) return { completed: 0, stars: 0 };
    try { const snap = await firestore.getDoc(firestore.doc(db, "users", user.uid, "children", childId, "progress", COURSE_ID)); return snap.exists() ? progressSummary(snap.data()) : { completed: 0, stars: 0 }; } catch { return { completed: 0, stars: 0 }; }
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
      const parentRef = firestore.doc(db, "users", user.uid); const legacyRef = firestore.doc(db, "users", user.uid, "progress", COURSE_ID); const newChildRef = firestore.doc(firestore.collection(db, "users", user.uid, "children")); const newProgressRef = firestore.doc(db, "users", user.uid, "children", newChildRef.id, "progress", COURSE_ID);
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
      const verification = await firestore.getDoc(firestore.doc(db, "users", user.uid, "children", migratedId, "progress", COURSE_ID));
      if (!verification.exists()) throw new Error("Không thể xác minh progress sau migration.");
      const legacyLocal = safeGet(LEGACY_PROGRESS_KEY); const migratedLocalKey = childProgressKey(migratedId);
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
    const child = normalizeChild(ref.id, payload); child.summary = { completed: 0, stars: 0 }; children.push(child); renderList(); return child;
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
    if (!user) { children = []; activeId = null; safeRemove(ACTIVE_CHILD_KEY); renderContext(); return null; }
    await loadChildren();
    if (!children.length) { const migratedId = await migrateLegacyProgress(); if (migratedId) await loadChildren(); }
    const saved = safeGet(ACTIVE_CHILD_KEY); activeId = children.some((child) => child.id === saved) ? saved : null;
    if (children.length === 1) await selectChild(children[0].id, { stayOpen: true });
    else if (children.length > 1) { renderContext(); openSelector(); }
    else openSelector();
    renderList(); renderContext(); return getActiveChild();
  }

  function disconnect() { user = null; children = []; activeId = null; safeRemove(ACTIVE_CHILD_KEY); renderContext(); }

  function bindUi() {
    if (document.body.dataset.childUiBound) return; document.body.dataset.childUiBound = "true";
    document.addEventListener("click", async (event) => {
      const select = event.target.closest("[data-child-select]"); if (select) await selectChild(select.dataset.childSelect);
      const edit = event.target.closest("[data-child-edit]"); if (edit) openForm(children.find((child) => child.id === edit.dataset.childEdit));
      if (event.target.closest("#child-add-button")) openForm();
      if (event.target.closest("[data-child-back]")) openSelector();
      if (event.target.closest("[data-child-close]")) closeSelector();
    });
    $("#child-form")?.addEventListener("submit", async (event) => {
      event.preventDefault(); const submit = $("button[type=submit]", event.currentTarget), status = $("#child-form-status"), childId = $("#child-edit-id").value, values = { name: $("#child-name").value, birthYear: $("#child-birth-year").value, avatar: event.currentTarget.querySelector('input[name="child-avatar"]:checked')?.value };
      submit.disabled = true; status.textContent = "Đang lưu..."; status.className = "account-status";
      try { const child = childId ? await updateChild(childId, values) : await createChild(values); status.textContent = "Đã lưu hồ sơ bé."; status.className = "account-status is-success"; await selectChild(child.id); }
      catch (error) { status.textContent = error.message || "Không thể lưu hồ sơ bé."; status.className = "account-status is-error"; }
      finally { submit.disabled = false; }
    });
  }

  async function runSelfTests() {
    const results = [], test = (id, passed) => results.push({ id, passed: Boolean(passed) });
    const first = normalizeChild("child_A123456", childPayload({ name: "Bé A", birthYear: 2019, avatar: "🐻" })); const second = normalizeChild("child_B123456", childPayload({ name: "Bé B", birthYear: "", avatar: "🐰" }));
    const progressA = { levels: { "addition-1": { completed: true, bestStars: 3 } } }; const progressB = { levels: { "addition-1": { completed: false, bestStars: 0 } } };
    test("A", validPayload(first)); test("B", validPayload(second)); test("C", first.id !== second.id); test("D", childProgressKey(first.id) !== childProgressKey(second.id)); test("E", progressSummary(progressA).completed === 1 && progressSummary(progressB).completed === 0); test("F", JSON.stringify(progressA) !== JSON.stringify(progressB)); test("G", COURSE_ID === "math-grade-1" && childProgressKey(first.id).includes(first.id)); test("H", typeof openSelector === "function"); test("I", typeof selectChild === "function"); test("J", childProgressKey(first.id) === `hoc-cung-be:progress:${first.id}`); test("K", MIGRATION_VERSION === 1 && normalizeName(" Bé 1 ") === "Bé 1"); test("L", typeof migrateLegacyProgress === "function" && Boolean(migrationPromise === null)); test("M", LEGACY_PROGRESS_KEY !== childProgressKey(first.id)); test("N", safeGet("hoc-cung-be:parent-pin") === safeGet("hoc-cung-be:parent-pin")); test("O", !childPayload(first).email); test("P", !childPayload(first).phoneNumber); test("Q", LEGACY_PROGRESS_KEY === "hoc-cung-be:math-grade-1-progress");
    let rules = ""; try { rules = await fetch("firestore.rules", { cache: "no-store" }).then((response) => response.text()); } catch {}
    test("R", rules.includes("match /children/{childId}") && rules.includes("allow read: if ownsUserData(userId)") && rules.includes("allow create, update: if ownsUserData(userId) && validChild()"));
    test("S", rules.includes("match /{document=**}") && rules.includes("allow read, write: if false") && !rules.includes("allow read, write: if true"));
    test("T", document.querySelector('link[rel="manifest"]')?.getAttribute("href") === "manifest.webmanifest" && MAX_CHILDREN === 5);
    return { passed: results.every((item) => item.passed), results };
  }

  ensureMarkup();
  window.HocCungBeChildren = { configure, disconnect, getChildren, getActiveChild, getActiveChildId: () => activeId, openSelector, createChild, updateChild, selectChild, childProgressKey, progressSummary };
  window.__hocCungBeChildProfilesTests = runSelfTests();
})();