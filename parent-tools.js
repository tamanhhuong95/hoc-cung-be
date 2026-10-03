"use strict";

// Parent PIN is a device-local child-safety lock, deliberately separate from Firebase Authentication.
(() => {
  const PIN_KEY = "hoc-cung-be:parent-pin";
  const PIN_ATTEMPTS_KEY = "hoc-cung-be:parent-pin-attempts";
  const PIN_COOLDOWN_MS = 30 * 1000;
  const PBKDF2_ITERATIONS = 250000;
  const PBKDF2_HASH_BITS = 256;
  const PBKDF2_ALGORITHM = "PBKDF2-SHA256";
  const WEB_CRYPTO_MESSAGE = "Trình duyệt này chưa hỗ trợ cơ chế bảo mật cần thiết. Vui lòng dùng Chrome, Edge hoặc trình duyệt hiện đại.";
  const FEEDBACK_EMAIL = String(window.HOC_CUNG_BE_FEEDBACK_EMAIL || "").trim();
  let parentUnlockedForSession = false;
  const $ = (selector, root = document) => root.querySelector(selector);
  const safeGet = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const parse = (value) => { try { return value ? JSON.parse(value) : null; } catch { return null; } };
  const validPin = (value) => /^\d{4,6}$/.test(String(value || ""));
  const hasPin = () => { const record = parse(safeGet(PIN_KEY)); return Boolean(record && typeof record.salt === "string" && typeof record.hash === "string"); };
  const bytesToHex = (bytes) => [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const hexToBytes = (value) => /^[0-9a-f]{32,}$/i.test(value) && value.length % 2 === 0 ? Uint8Array.from(value.match(/.{2}/g), (byte) => Number.parseInt(byte, 16)) : null;
  const webCryptoAvailable = (cryptoApi = window.crypto) => Boolean(cryptoApi?.subtle && cryptoApi?.getRandomValues && window.TextEncoder);
  const isPbkdf2Record = (record) => Boolean(record && record.version === 2 && record.algorithm === PBKDF2_ALGORITHM && record.iterations === PBKDF2_ITERATIONS && typeof record.salt === "string" && typeof record.hash === "string");
  const isLegacyShaRecord = (record) => Boolean(record && record.algorithm === "SHA-256" && typeof record.salt === "string" && typeof record.hash === "string");
  const isLegacyFnvRecord = (record) => Boolean(record && record.algorithm === "fallback-fnv1a" && typeof record.salt === "string" && typeof record.hash === "string");
  const fallbackHash = (value) => { let hash = 2166136261; for (let index = 0; index < value.length; index += 1) { hash ^= value.charCodeAt(index); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(16).padStart(8, "0"); };
  function randomSalt(cryptoApi = window.crypto) { if (!webCryptoAvailable(cryptoApi)) return null; const bytes = new Uint8Array(16); cryptoApi.getRandomValues(bytes); return bytesToHex(bytes); }
  async function pbkdf2Hash(pin, salt, cryptoApi = window.crypto) {
    const saltBytes = hexToBytes(salt);
    if (!webCryptoAvailable(cryptoApi) || !saltBytes) return null;
    const key = await cryptoApi.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
    const bits = await cryptoApi.subtle.deriveBits({ name: "PBKDF2", salt: saltBytes, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" }, key, PBKDF2_HASH_BITS);
    return bytesToHex(new Uint8Array(bits));
  }
  async function legacySha256Hash(pin, salt, cryptoApi = window.crypto) {
    if (!webCryptoAvailable(cryptoApi)) return null;
    const digest = await cryptoApi.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${pin}`));
    return bytesToHex(new Uint8Array(digest));
  }
  async function pinRecord(pin, salt = randomSalt(), cryptoApi = window.crypto) {
    if (!validPin(pin) || !webCryptoAvailable(cryptoApi) || !salt) return null;
    const hash = await pbkdf2Hash(pin, salt, cryptoApi);
    return hash ? { version: 2, algorithm: PBKDF2_ALGORITHM, iterations: PBKDF2_ITERATIONS, salt, hash } : null;
  }
  async function verifyPin(pin, record = parse(safeGet(PIN_KEY)), cryptoApi = window.crypto) {
    if (!validPin(pin) || !record?.salt || !record?.hash) return false;
    if (isPbkdf2Record(record)) { const hash = await pbkdf2Hash(pin, record.salt, cryptoApi); return Boolean(hash && hash === record.hash); }
    if (isLegacyShaRecord(record)) { const hash = await legacySha256Hash(pin, record.salt, cryptoApi); return Boolean(hash && hash === record.hash); }
    return isLegacyFnvRecord(record) && fallbackHash(`${record.salt}:${pin}`) === record.hash;
  }
  async function verifyStoredPin(pin) {
    const record = parse(safeGet(PIN_KEY));
    if (!record) return { verified: false };
    if (!webCryptoAvailable() && !isLegacyFnvRecord(record)) return { verified: false, unsupported: true };
    const verified = await verifyPin(pin, record);
    if (!verified) return { verified: false };
    if (!isPbkdf2Record(record) && webCryptoAvailable()) {
      const migrated = await pinRecord(pin);
      if (!migrated || !safeSet(PIN_KEY, JSON.stringify(migrated))) return { verified: false, migrationFailed: true };
    }
    return { verified: true };
  }
  const attempts = () => { const saved = parse(safeGet(PIN_ATTEMPTS_KEY)); return saved && Number.isFinite(saved.count) && Number.isFinite(saved.lockedUntil) ? saved : { count: 0, lockedUntil: 0 }; };
  const cooldownSeconds = () => Math.max(0, Math.ceil((attempts().lockedUntil - Date.now()) / 1000));
  const resetAttempts = () => safeSet(PIN_ATTEMPTS_KEY, JSON.stringify({ count: 0, lockedUntil: 0 }));
  function noteWrongPin() { const state = attempts(); const count = state.count + 1; const lockedUntil = count >= 5 ? Date.now() + PIN_COOLDOWN_MS : 0; safeSet(PIN_ATTEMPTS_KEY, JSON.stringify({ count: lockedUntil ? 0 : count, lockedUntil })); return lockedUntil; }
  function setGateStatus(text = "", type = "") { const status = $("#parent-pin-status"); status.textContent = text; status.className = `parent-gate__feedback ${type}`; }
  function setFeedbackStatus(text = "", type = "") { const status = $("#feedback-status"); status.textContent = text; status.className = `parent-gate__feedback ${type}`; }
  function showOnly(screenId) { document.querySelectorAll(".screen").forEach((screen) => { screen.hidden = screen.id !== screenId; }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function renderGate() {
    const gate = $("#parent-gate-screen");
    gate.innerHTML = `<div class="parent-gate"><button class="back-button" data-parent-home type="button">← Trang chủ</button><p class="eyebrow">Khu vực riêng</p><h1 id="parent-pin-title"></h1><p id="parent-pin-intro"></p><form id="parent-pin-form" novalidate><div id="parent-pin-new-fields" hidden><label for="parent-pin-new">Mã bảo mật<span class="password-field"><input id="parent-pin-new" inputmode="numeric" autocomplete="new-password" pattern="[0-9]*" maxlength="6" type="password" /><button class="password-toggle" data-parent-pin-toggle type="button">Hiện</button></span></label><label for="parent-pin-confirm">Nhập lại mã bảo mật<span class="password-field"><input id="parent-pin-confirm" inputmode="numeric" autocomplete="new-password" pattern="[0-9]*" maxlength="6" type="password" /><button class="password-toggle" data-parent-pin-toggle type="button">Hiện</button></span></label></div><div id="parent-pin-enter-field" hidden><label for="parent-pin-enter">Mã bảo mật<span class="password-field"><input id="parent-pin-enter" inputmode="numeric" autocomplete="current-password" pattern="[0-9]*" maxlength="6" type="password" /><button class="password-toggle" data-parent-pin-toggle type="button">Hiện</button></span></label></div><p class="parent-pin-note">Mã này dùng để bảo vệ khu vực phụ huynh trên thiết bị này.</p><p class="parent-gate__feedback" id="parent-pin-status" role="status" aria-live="polite"></p><button class="primary-button" id="parent-pin-submit" type="submit"></button></form><button class="inline-link parent-pin-forgot" id="parent-pin-forgot" type="button" hidden>Quên mã bảo mật?</button><p class="parent-forgot-message" id="parent-forgot-message" hidden>Hiện mã bảo mật được lưu trên thiết bị này. Nếu đặt lại mã, bạn cần xác nhận qua tài khoản phụ huynh khi tính năng xác thực Firebase đã được cấu hình hoàn chỉnh. Phiên bản hiện tại không đặt lại tự động bằng email và không có nút bỏ qua mã bảo mật.</p></div>`;
  }
  function openParentGate() {
    renderGate(); showOnly("parent-gate-screen");
    const setup = !hasPin();
    $("#parent-pin-title").textContent = setup ? "Thiết lập mã bảo mật phụ huynh" : "Dành cho phụ huynh";
    $("#parent-pin-intro").textContent = setup ? "Tạo mã gồm 4 đến 6 chữ số để bảo vệ khu vực phụ huynh." : "Nhập mã bảo mật để mở khu phụ huynh.";
    $("#parent-pin-new-fields").hidden = !setup; $("#parent-pin-enter-field").hidden = setup; $("#parent-pin-forgot").hidden = setup;
    $("#parent-pin-submit").textContent = setup ? "Tạo mã" : "Mở khu phụ huynh";
    if (setup && !webCryptoAvailable()) setGateStatus(WEB_CRYPTO_MESSAGE, "is-error");
    setTimeout(() => $(setup ? "#parent-pin-new" : "#parent-pin-enter")?.focus(), 0);
  }
  async function submitGate(event) {
    event.preventDefault();
    const setup = !hasPin();
    if (setup) {
      if (!webCryptoAvailable()) return setGateStatus(WEB_CRYPTO_MESSAGE, "is-error");
      const pin = $("#parent-pin-new").value, confirm = $("#parent-pin-confirm").value;
      if (!validPin(pin)) return setGateStatus("Mã bảo mật cần gồm 4 đến 6 chữ số.", "is-error");
      if (pin !== confirm) return setGateStatus("Hai lần nhập mã bảo mật chưa giống nhau.", "is-error");
      const record = await pinRecord(pin);
      if (!record || !safeSet(PIN_KEY, JSON.stringify(record))) return setGateStatus("Không thể lưu mã trên thiết bị này. Vui lòng kiểm tra cài đặt trình duyệt.", "is-error");
      resetAttempts(); parentUnlockedForSession = true; showParentDashboard(); return;
    }
    const seconds = cooldownSeconds();
    if (seconds) return setGateStatus(`Vui lòng thử lại sau ${seconds} giây.`, "is-error");
    const pin = $("#parent-pin-enter").value, verification = await verifyStoredPin(pin);
    if (verification.unsupported) return setGateStatus(WEB_CRYPTO_MESSAGE, "is-error");
    if (verification.migrationFailed) return setGateStatus("Không thể nâng cấp mã bảo mật trên thiết bị này. Vui lòng kiểm tra cài đặt trình duyệt.", "is-error");
    if (verification.verified) { resetAttempts(); parentUnlockedForSession = true; showParentDashboard(); return; }
    const lockedUntil = noteWrongPin();
    setGateStatus(lockedUntil ? "Vui lòng thử lại sau ít giây." : "Mã bảo mật chưa đúng. Vui lòng thử lại.", "is-error");
    $("#parent-pin-enter").select();
  }
  function showParentDashboard() { $("#parent-refresh-button")?.click(); showOnly("parent-dashboard-screen"); }
  function feedbackPayload(values) {
    const lines = ["Góp ý cho Học Cùng Bé", "", `Loại góp ý: ${values.type}`, `Tiêu đề: ${values.title}`, "", "Nội dung:", values.message, "", `Email liên hệ: ${values.email || "(không cung cấp)"}`];
    if (values.technical) lines.push("", "Thông tin kỹ thuật (được phụ huynh chủ động chọn):", `URL: ${location.href}`, `Trình duyệt: ${navigator.userAgent}`, "Phiên bản ứng dụng: hoc-cung-be-v17");
    return lines.join("\r\n");
  }
  function buildFeedbackMailto(values, destination = FEEDBACK_EMAIL) { return `mailto:${encodeURIComponent(destination)}?subject=${encodeURIComponent(`[Học Cùng Bé] ${values.type}: ${values.title}`)}&body=${encodeURIComponent(feedbackPayload(values))}`; }
  function validFeedback(values) {
    if (!values.type || !values.title.trim()) return "Vui lòng chọn loại góp ý và nhập tiêu đề.";
    if (values.message.trim().length < 10) return "Nội dung góp ý cần có ít nhất 10 ký tự.";
    if (values.message.length > 2000) return "Nội dung góp ý tối đa 2000 ký tự.";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return "Email liên hệ chưa đúng định dạng.";
    if (!values.consent) return "Vui lòng đồng ý để Học Cùng Bé dùng thông tin này để phản hồi.";
    return "";
  }
  function installDashboardTools() {
    const danger = $(".parent-danger"); if (!danger || $("#parent-pin-tools")) return;
    danger.insertAdjacentHTML("beforebegin", `<section class="parent-section" id="parent-pin-tools"><p class="eyebrow">Bảo mật thiết bị</p><h2>🔐 Đổi mã bảo mật</h2><p>Parent PIN chỉ khóa cục bộ khu phụ huynh trên thiết bị này, không phải mật khẩu Firebase.</p><form class="parent-tools-form" id="parent-pin-change-form" novalidate><label>Mã hiện tại<input id="parent-pin-current" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="current-password" /></label><label>Mã mới<input id="parent-pin-next" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password" /></label><label>Xác nhận mã mới<input id="parent-pin-next-confirm" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password" /></label><p class="parent-gate__feedback" id="parent-pin-change-status" role="status"></p><button class="secondary-button" type="submit">Đổi mã bảo mật</button></form></section><section class="parent-section" id="parent-feedback"><p class="eyebrow">Liên hệ</p><h2>💬 Góp ý cho Học Cùng Bé</h2><p>Góp ý chỉ được mở trong khu phụ huynh. Ứng dụng sẽ mở email của bạn để gửi, không lưu nội dung góp ý trên thiết bị.</p><form class="parent-tools-form" id="feedback-form" novalidate><label>Loại góp ý<select id="feedback-type" required><option value="">Chọn loại góp ý</option><option>Báo lỗi</option><option>Đề xuất bài học</option><option>Góp ý giao diện</option><option>Góp ý nội dung</option><option>Ý kiến khác</option></select></label><label>Tiêu đề<input id="feedback-title" maxlength="140" required /></label><label>Nội dung<textarea id="feedback-message" minlength="10" maxlength="2000" required></textarea><small id="feedback-count">0 / 2000 ký tự</small></label><label>Email liên hệ <small>(không bắt buộc)</small><input id="feedback-email" type="email" inputmode="email" autocomplete="email" maxlength="254" /></label><label class="parent-check"><input id="feedback-consent" type="checkbox" /> Tôi đồng ý để Học Cùng Bé dùng thông tin này để phản hồi.</label><label class="parent-check"><input id="feedback-technical" type="checkbox" /> Đính kèm thông tin kỹ thuật cơ bản (URL, trình duyệt và phiên bản app).</label><p class="parent-gate__feedback" id="feedback-status" role="status" aria-live="polite"></p><button class="secondary-button" type="submit">Mở email để gửi góp ý</button></form></section>`);
  }
  document.addEventListener("click", (event) => {
    if (event.target.closest("#parent-entry-button")) { event.preventDefault(); openParentGate(); }
    if (event.target.closest("[data-parent-home]")) showOnly("home-screen");
    const toggle = event.target.closest("[data-parent-pin-toggle]");
    if (toggle) { const input = $("input", toggle.parentElement); input.type = input.type === "password" ? "text" : "password"; toggle.textContent = input.type === "password" ? "Hiện" : "Ẩn"; }
    if (event.target.closest("#parent-pin-forgot")) $("#parent-forgot-message").hidden = false;
  });
  document.addEventListener("submit", async (event) => {
    if (event.target.id === "parent-pin-form") return submitGate(event);
    if (event.target.id === "parent-pin-change-form") {
      event.preventDefault(); const current = $("#parent-pin-current").value, next = $("#parent-pin-next").value, confirm = $("#parent-pin-next-confirm").value, status = $("#parent-pin-change-status");
      if (!webCryptoAvailable()) { status.textContent = WEB_CRYPTO_MESSAGE; status.className = "parent-gate__feedback is-error"; return; }
      const verification = await verifyStoredPin(current);
      if (verification.migrationFailed) { status.textContent = "Không thể nâng cấp mã bảo mật trên thiết bị này. Vui lòng kiểm tra cài đặt trình duyệt."; status.className = "parent-gate__feedback is-error"; return; }
      if (!verification.verified) { status.textContent = "Mã bảo mật hiện tại chưa đúng. Vui lòng thử lại."; status.className = "parent-gate__feedback is-error"; return; }
      if (!validPin(next)) { status.textContent = "Mã mới cần gồm 4 đến 6 chữ số."; status.className = "parent-gate__feedback is-error"; return; }
      if (next !== confirm) { status.textContent = "Hai lần nhập mã mới chưa giống nhau."; status.className = "parent-gate__feedback is-error"; return; }
      const record = await pinRecord(next);
      if (!record || !safeSet(PIN_KEY, JSON.stringify(record))) { status.textContent = "Không thể lưu mã trên thiết bị này. Vui lòng kiểm tra cài đặt trình duyệt."; status.className = "parent-gate__feedback is-error"; return; }
      resetAttempts(); event.target.reset(); status.textContent = "Đã đổi mã bảo mật."; status.className = "parent-gate__feedback is-success";
    }
    if (event.target.id === "feedback-form") {
      event.preventDefault(); const values = { type: $("#feedback-type").value, title: $("#feedback-title").value.trim(), message: $("#feedback-message").value.trim(), email: $("#feedback-email").value.trim(), consent: $("#feedback-consent").checked, technical: $("#feedback-technical").checked }; const error = validFeedback(values);
      if (error) return setFeedbackStatus(error, "is-error");
      if (!FEEDBACK_EMAIL) return setFeedbackStatus("Chưa cấu hình địa chỉ nhận góp ý.", "is-error");
      window.location.href = buildFeedbackMailto(values); setFeedbackStatus("Ứng dụng email đã được mở để bạn gửi góp ý.", "is-success"); event.target.reset(); $("#feedback-count").textContent = "0 / 2000 ký tự";
    }
  });
  document.addEventListener("input", (event) => { if (event.target.id === "feedback-message") $("#feedback-count").textContent = `${event.target.value.length} / 2000 ký tự`; });
  installDashboardTools();
  async function runSelfTests() {
    const results = [], test = (id, passed) => results.push({ id, passed: Boolean(passed) }), progressBefore = safeGet("hoc-cung-be:math-grade-1-progress"), salt = "00112233445566778899aabbccddeeff";
    const record = await pinRecord("1234", salt);
    test("A", Boolean(record && isPbkdf2Record(record)));
    test("B", await verifyPin("1234", record));
    test("C", !await verifyPin("9999", record));
    test("D", !JSON.stringify(record).includes("1234"));
    test("E", record?.iterations === PBKDF2_ITERATIONS && record?.algorithm === PBKDF2_ALGORITHM);
    const legacySha = { version: 1, algorithm: "SHA-256", salt: "legacy-sha-salt", hash: await legacySha256Hash("2345", "legacy-sha-salt") };
    test("F", await verifyPin("2345", legacySha));
    const originalStoredPin = safeGet(PIN_KEY), originalAttempts = safeGet(PIN_ATTEMPTS_KEY);
    safeSet(PIN_KEY, JSON.stringify(legacySha)); const shaMigration = await verifyStoredPin("2345"); test("G", shaMigration.verified && isPbkdf2Record(parse(safeGet(PIN_KEY))));
    const legacyFnv = { version: 1, algorithm: "fallback-fnv1a", salt: "legacy-fnv-salt", hash: fallbackHash("legacy-fnv-salt:3456") };
    safeSet(PIN_KEY, JSON.stringify(legacyFnv)); const fnvMigration = await verifyStoredPin("3456"); test("H", fnvMigration.verified && isPbkdf2Record(parse(safeGet(PIN_KEY))));
    if (originalStoredPin === null) { try { localStorage.removeItem(PIN_KEY); } catch {} } else safeSet(PIN_KEY, originalStoredPin);
    if (originalAttempts === null) { try { localStorage.removeItem(PIN_ATTEMPTS_KEY); } catch {} } else safeSet(PIN_ATTEMPTS_KEY, originalAttempts);
    test("I", !await pinRecord("4567", salt, null));
    const simulated = [1, 2, 3, 4, 5].reduce((state) => ({ count: state.count + 1, lockedUntil: state.count + 1 >= 5 ? 1 : 0 }), { count: 0, lockedUntil: 0 }); test("J", simulated.lockedUntil === 1);
    test("K", safeGet("hoc-cung-be:math-grade-1-progress") === progressBefore);
    test("L", typeof window.HOC_CUNG_BE_FIREBASE_CONFIG !== "undefined" && !Object.keys(record || {}).includes("firebasePassword"));
    return { passed: results.every((item) => item.passed), results };
  }
  window.__hocCungBeParentPinFeedbackTests = { pending: true };
  runSelfTests().then((result) => { window.__hocCungBeParentPinFeedbackTests = result; }).catch(() => { window.__hocCungBeParentPinFeedbackTests = { passed: false, results: [] }; });
})();