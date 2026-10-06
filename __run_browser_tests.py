import http.server
import json
import pathlib
import re
import shutil
import subprocess
import sys
import threading
import time

ROOT = pathlib.Path(__file__).resolve().parent
RUNNER = ROOT / "__browser-test-runner.html"
PROFILE = ROOT / "__browser-test-profile"
REPORT = ROOT / "__full_regression_report.json"
CHROME = pathlib.Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

probe = r'''
<script>
const runtimeErrors = [];
const originalConsoleError = console.error.bind(console);
console.error = (...args) => { runtimeErrors.push({ type: "console.error", message: args.map((value) => value instanceof Error ? value.stack || value.message : String(value)).join(" ") }); originalConsoleError(...args); };
window.addEventListener("error", (event) => {
  const target = event.target;
  if (target && target !== window && (target.tagName === "SCRIPT" || target.tagName === "LINK" || target.tagName === "IMG")) {
    runtimeErrors.push({ type: `failed-${target.tagName.toLowerCase()}-load`, source: target.src || target.href || "" });
    return;
  }
  runtimeErrors.push({ type: "pageerror", message: event.message || String(event.error || "Unknown error"), source: event.filename || "", line: event.lineno || 0 });
}, true);
window.addEventListener("unhandledrejection", (event) => runtimeErrors.push({ type: "unhandledrejection", message: String(event.reason || "Unknown rejection") }));
window.addEventListener("load", async () => {
  const registry = [
    ["Math clock", "__hocCungBeClockTests"],
    ["Math five-question lessons", "__hocCungBeFiveQuestionTests"],
    ["Math progress compatibility", "__hocCungBeProgressTests"],
    ["Math counting", "__hocCungBeCountingQuestionTests"],
    ["Math geometry and sequences", "__hocCungBeGeometryAndSequenceTests"],
    ["Audio and speech", "__hocCungBeAudioAndSpeechTests"],
    ["Mascot and results", "__hocCungBeMascotAndResultTests"],
    ["Parent dashboard", "__hocCungBeParentDashboardTests"],
    ["Dynamic curriculum", "__hocCungBeDynamicLevelTests"],
    ["Guest Trial", "__hocCungBeGuestTrialTests"],
    ["Multi-course and Vietnamese", "__hocCungBeMultiCourseTests"],
    ["PWA and offline", "__hocCungBePwaTests"],
    ["Branding and icons", "__hocCungBeBrandingTests"],
    ["Parent Auth, verification, recovery, password and phone", "__hocCungBeParentAuthTests"],
    ["Child Profiles", "__hocCungBeChildProfilesTests"],
    ["Cloud Sync", "__hocCungBeCloudSyncTests"],
    ["Parent PIN and feedback", "__hocCungBeParentPinFeedbackTests"],
    ["Child Settings and cross-course limits", "__hocCungBeChildSettingsTests"],
  ];
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const suites = {}, missingSuites = [];
  const state = () => ({ activeScreen: [...document.querySelectorAll(".screen")].find((screen) => !screen.hidden)?.id || null, course: document.body.dataset.course || null, authenticated: document.body.dataset.authenticated || null, topics: document.querySelectorAll("#topic-grid button").length, levels: document.querySelectorAll("#level-grid button").length, answers: document.querySelectorAll("#answer-grid button").length, quizHidden: document.querySelector("#quiz-screen")?.hidden });
  const isQuiz = () => { const screen = document.querySelector("#quiz-screen"); return Boolean(screen && !screen.hidden && document.querySelectorAll("#answer-grid button").length === 4 && document.querySelector("#question-count")?.textContent.includes("1 / 5")); };
  const click = (selector, root = document) => { const node = root.querySelector(selector); if (!node) throw new Error(`Missing clickable element: ${selector}`); if (node.disabled) throw new Error(`Clickable element is disabled: ${selector}`); node.click(); return node; };
  const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
  const expectScreen = (screenId, label) => { const actual = state(); if (actual.activeScreen !== screenId) throw new Error(`${label}: expected ${screenId}, got ${JSON.stringify(actual)}`); };
  const resetScreen = () => { click('[data-go="home"]'); expectScreen("home-screen", "reset screen"); };
  const resetGuest = () => {
    ["hoc-cung-be:guest-trial", "hoc-cung-be:math-grade-1-progress", "hoc-cung-be:progress:guest:vietnamese-grade-1", "hoc-cung-be:progress:testchild01:math-grade-1", "hoc-cung-be:progress:testchild01:vietnamese-grade-1", "hoc-cung-be:child-settings:testchild01"].forEach((key) => localStorage.removeItem(key));
    resetScreen();
    window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state", { detail: { user: null } }));
    expectScreen("home-screen", "reset guest auth");
  };
  const signedIn = () => {
    window.HocCungBeChildren = { ...window.HocCungBeChildren, getActiveChild: () => ({ id: "testchild01", name: "Bé Test", avatar: "🧒" }), getActiveChildId: () => "testchild01", openSelector: window.HocCungBeChildren?.openSelector || (() => {}) };
    window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state", { detail: { user: { uid: "test-parent", email: "test@example.com" } } }));
    if (document.body.dataset.authenticated !== "true") throw new Error("Mock authenticated state was not applied");
  };
  const enterQuiz = (courseId) => {
    click('[data-go="grade1"]');
    click(`button[data-course="${courseId}"]`);
    click("#topic-grid button");
    click("#level-grid button");
    if (!isQuiz()) throw new Error(`${courseId} did not transition to quiz: ${JSON.stringify(state())}`);
  };
  const runCanEnterQuizTests = async () => {
    const results = [], test = async (id, fn) => { try { await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    await test("A. Guest can open first Math lesson", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click("#topic-grid button"); if (document.querySelector("#levels-screen").hidden || !document.querySelector("#level-grid button")) throw new Error(`Math first lesson did not open: ${JSON.stringify(state())}`); });
    await test("B. Guest can start Math quiz", () => { resetGuest(); enterQuiz("math-grade-1"); });
    await test("C. Guest can open first Vietnamese lesson", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); click("#topic-grid button"); if (document.querySelector("#levels-screen").hidden || !document.querySelector("#level-grid button")) throw new Error(`Vietnamese first lesson did not open: ${JSON.stringify(state())}`); });
    await test("D. Guest can start Vietnamese quiz", () => { resetGuest(); enterQuiz("vietnamese-grade-1"); });
    await test("E. Logged-in child can start Math quiz", () => { resetGuest(); signedIn(); enterQuiz("math-grade-1"); });
    await test("F. Logged-in child can start Vietnamese quiz", () => { resetGuest(); signedIn(); enterQuiz("vietnamese-grade-1"); });
    await test("G. Missing child settings uses defaults", () => { resetGuest(); signedIn(); localStorage.removeItem("hoc-cung-be:child-settings:testchild01"); if (!window.HocCungBeChildSettings.canStartLesson()) throw new Error("Missing settings blocked lesson"); enterQuiz("math-grade-1"); });
    await test("H. Missing cloud progress does not block start", () => { resetGuest(); signedIn(); localStorage.removeItem("hoc-cung-be:progress:testchild01:math-grade-1"); localStorage.removeItem("hoc-cung-be:progress:testchild01:vietnamese-grade-1"); enterQuiz("vietnamese-grade-1"); });
    await test("I. Course switch Math → Vietnamese → Math still starts quiz", () => { resetGuest(); signedIn(); enterQuiz("math-grade-1"); click("#quiz-back-button"); click('[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); click("#topic-grid button"); click("#level-grid button"); if (!isQuiz()) throw new Error("Vietnamese did not start after switch"); click("#quiz-back-button"); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click("#topic-grid button"); click("#level-grid button"); if (!isQuiz()) throw new Error("Math did not restart after switch"); });
    await test("J. Refresh then start quiz works", () => { if (!isQuiz()) throw new Error("Refresh flow is executed by a dedicated fresh runner navigation"); });
    await test("K. v27 app shell includes required modules and shared artwork", async () => { const required = ["./script.js", "./child-settings.js", "./parent-auth.js", "./child-profiles.js", "./data/vietnamese-grade-1.js", "./assets/backgrounds/van-mieu-quoc-tu-giam.webp"]; const text = await fetch("service-worker.js", { cache: "no-store" }).then((r) => r.text()); if (!text.includes('const CACHE_NAME = "hoc-cung-be-v27"') || !required.every((path) => text.includes(`"${path}"`))) throw new Error("v27 app shell is incomplete"); });
    await test("L. Math Back stays on Grade 1", async () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); expectScreen("math-screen", "Math course"); click('#math-screen .back-button[data-go="grade1"]'); expectScreen("grade1-screen", "Math Back immediate"); await wait(1100); expectScreen("grade1-screen", "Math Back stable"); });
    await test("M. Vietnamese Back stays on Grade 1", async () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); expectScreen("math-screen", "Vietnamese course"); click('#math-screen .back-button[data-go="grade1"]'); expectScreen("grade1-screen", "Vietnamese Back immediate"); await wait(1100); expectScreen("grade1-screen", "Vietnamese Back stable"); });
    await test("N. Math quiz stays visible and Quiz Back returns to levels", async () => { resetGuest(); enterQuiz("math-grade-1"); await wait(1100); expectScreen("quiz-screen", "Math quiz stable"); click("#quiz-back-button"); expectScreen("levels-screen", "Quiz Back immediate"); await wait(1100); expectScreen("levels-screen", "Quiz Back stable"); });
    await test("O. Rapid Math Back then Vietnamese ends on Vietnamese", async () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click('#math-screen .back-button[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); expectScreen("math-screen", "Rapid course immediate"); await wait(1100); const actual = state(); if (actual.activeScreen !== "math-screen" || actual.course !== "vietnamese-grade-1") throw new Error(`Rapid navigation ended incorrectly: ${JSON.stringify(actual)}`); });
    await test("P. Clicking a child element inside a level card starts quiz", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click("#topic-grid button"); click("#level-grid button strong"); if (!isQuiz()) throw new Error(`Level child click did not transition to quiz: ${JSON.stringify(state())}`); });
    return { passed: results.every((item) => item.passed), results };
  };
  const runAuthFunctionBackgroundTests = async () => {
    const results = [], test = async (id, fn) => { try { await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    const visibleNode = (node) => { if (!node) return false; for (let current = node; current; current = current.parentElement) { const style = getComputedStyle(current); if (current.hidden || style.display === "none" || style.visibility === "hidden") return false; } return true; };
    const visible = (selector) => visibleNode(document.querySelector(selector));
    const homeText = (selector) => document.querySelector(selector)?.textContent.trim() || "";
    const assertLoggedInHome = () => { if (visible("#home-login-button") || visible("#home-register-button")) throw new Error("Home guest account controls are visible"); if (homeText("#grade-choice-eyebrow") !== "CHỌN LỚP" || homeText("#grade-choice-title") !== "Bé muốn học lớp nào?") throw new Error(`Logged-in grade heading is invalid: ${homeText("#grade-choice-eyebrow")} / ${homeText("#grade-choice-title")}`); };
    const guestLogin = '.site-nav [data-auth-open="login"]', guestRegister = '.site-nav [data-auth-open="register"]', guestTrial = '.site-nav [data-go="grade1"][data-guest-only]';
    await test("A. Guest sees Đăng nhập on header and Home", () => { resetGuest(); if (!visible(guestLogin) || !visible("#home-login-button")) throw new Error("Guest login is hidden"); });
    await test("B. Guest sees Đăng ký on header and Home", () => { resetGuest(); if (!visible(guestRegister) || !visible("#home-register-button")) throw new Error("Guest register is hidden"); });
    await test("C. Guest sees HỌC THỬ", () => { resetGuest(); if (!visible(guestTrial) || homeText("#grade-choice-eyebrow") !== "HỌC THỬ") throw new Error("Guest trial heading is hidden or invalid"); });
    await test("D. Guest sees Học thử cùng bé", () => { resetGuest(); if (homeText("#grade-choice-title") !== "Học thử cùng bé") throw new Error("Guest trial title is invalid"); });
    await test("E. Logged-in hides every Đăng nhập control", () => { resetGuest(); signedIn(); if (visible(guestLogin) || visible("#home-login-button")) throw new Error("Login remains visible"); });
    await test("F. Logged-in hides every Đăng ký control", () => { resetGuest(); signedIn(); if (visible(guestRegister) || visible("#home-register-button")) throw new Error("Register remains visible"); });
    await test("G. Logged-in has no HỌC THỬ Home heading", () => { resetGuest(); signedIn(); if (homeText("#grade-choice-eyebrow") === "HỌC THỬ" || visible(guestTrial)) throw new Error("Trial label remains visible"); });
    await test("H. Logged-in has no Học thử cùng bé title", () => { resetGuest(); signedIn(); if (homeText("#grade-choice-title") === "Học thử cùng bé") throw new Error("Trial title remains visible"); });
    await test("I. Logged-in sees CHỌN LỚP", () => { resetGuest(); signedIn(); if (homeText("#grade-choice-eyebrow") !== "CHỌN LỚP") throw new Error("CHỌN LỚP is missing"); });
    await test("J. Logged-in sees Bé muốn học lớp nào?", () => { resetGuest(); signedIn(); if (homeText("#grade-choice-title") !== "Bé muốn học lớp nào?") throw new Error("Logged-in grade title is missing"); });
    await test("K. Logged-in still sees and enters Lớp 1", () => { resetGuest(); signedIn(); const card = document.querySelector('#grade-choices [data-go="grade1"]'); if (!visibleNode(card) || !card.textContent.includes("Lớp 1")) throw new Error("Lớp 1 card is missing"); card.click(); expectScreen("grade1-screen", "logged-in Lớp 1"); });
    await test("L. Logged-in Home survives Lớp 1 Back", () => { resetGuest(); signedIn(); click('#grade-choices [data-go="grade1"]'); click('#grade1-screen [data-go="home"]'); expectScreen("home-screen", "Lớp 1 Back Home"); assertLoggedInHome(); });
    await test("M. Logged-in Home survives child change", () => { resetGuest(); signedIn(); window.dispatchEvent(new CustomEvent("hoc-cung-be:child-changed", { detail: { child: { id: "testchild02", name: "Bé Hai", avatar: "👧" } } })); expectScreen("home-screen", "child change Home"); assertLoggedInHome(); });
    await test("N. Logged-in Home survives Parent Dashboard Back", () => { resetGuest(); signedIn(); window.eval('showScreen("parent-dashboard")'); expectScreen("parent-dashboard-screen", "Parent Dashboard"); click('#parent-dashboard-screen [data-go="home"]'); expectScreen("home-screen", "Parent Dashboard Back Home"); assertLoggedInHome(); });
    await test("O. Auth-ready refresh render does not recreate guest controls", async () => { resetGuest(); signedIn(); window.eval('installExperienceUi(); showScreen("home"); renderHeader();'); await wait(50); if (document.body.dataset.authResolved !== "true") throw new Error("Auth was not resolved"); assertLoggedInHome(); });
    await test("P. Logout restores guest Home labels and controls", () => { resetGuest(); signedIn(); window.addEventListener("hoc-cung-be:sign-out", () => window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state", { detail: { user: null } })), { once: true }); click("#function-menu-button"); click('[data-function-action="logout"]'); if (!visible(guestLogin) || !visible(guestRegister) || !visible("#home-login-button") || !visible("#home-register-button") || homeText("#grade-choice-eyebrow") !== "HỌC THỬ" || homeText("#grade-choice-title") !== "Học thử cùng bé" || visible("#function-menu-button")) throw new Error("Guest UI was not restored"); });
    await test("Q. Logged-in sees Chức năng", () => { resetGuest(); signedIn(); const button = document.querySelector("#function-menu-button"); if (!visible("#function-menu-button") || button.getAttribute("aria-label") !== "Chức năng" || button.getAttribute("aria-controls") !== "function-menu") throw new Error("Function button is invalid"); });
    await test("R. Guest hides Chức năng", () => { resetGuest(); if (visible("#function-menu-button")) throw new Error("Guest sees function button"); });
    await test("S. Menu opens", () => { resetGuest(); signedIn(); click("#function-menu-button"); if (document.querySelector("#function-menu-backdrop").hidden || document.querySelector("#function-menu-button").getAttribute("aria-expanded") !== "true") throw new Error("Menu did not open"); });
    await test("T. Menu closes with X", () => { click("#function-menu-close"); if (!document.querySelector("#function-menu-backdrop").hidden) throw new Error("Menu did not close with X"); });
    await test("U. Menu closes with outside click", () => { click("#function-menu-button"); document.querySelector("#function-menu-backdrop").click(); if (!document.querySelector("#function-menu-backdrop").hidden) throw new Error("Menu did not close outside"); });
    await test("V. Menu closes with Escape", () => { click("#function-menu-button"); window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); if (!document.querySelector("#function-menu-backdrop").hidden || document.querySelector("#function-menu-button").getAttribute("aria-expanded") !== "false") throw new Error("Menu did not close with Escape"); });
    await test("W. Menu contains all 6 functions", () => { const labels = [...document.querySelectorAll("[data-function-action] span")].map((node) => node.textContent.trim()); const expected = ["Thông tin cá nhân", "Phân tích kết quả học tập", "Hồ sơ của bé", "Cài đặt", "Tài khoản của tôi", "Đăng xuất"]; if (labels.length !== 6 || !expected.every((label) => labels.includes(label))) throw new Error(`Menu labels invalid: ${labels.join(", ")}`); });
    await test("X. Hidden backdrop does not intercept clicks", () => { const backdrop = document.querySelector("#function-menu-backdrop"), style = getComputedStyle(backdrop); if (!backdrop.hidden || (style.display !== "none" && style.pointerEvents !== "none")) throw new Error(`Hidden backdrop intercepts: ${style.display}/${style.pointerEvents}`); });
    await test("Y. prefers-reduced-motion exists", async () => { const css = await fetch("styles.css", { cache: "no-store" }).then((r) => r.text()); if (!css.includes("@media (prefers-reduced-motion: reduce)")) throw new Error("Reduced motion CSS missing"); });
    await test("Z. Background clarity and overlays are tuned", async () => { const [response, css] = await Promise.all([fetch("assets/backgrounds/van-mieu-quoc-tu-giam.webp", { cache: "no-store" }), fetch("styles.css", { cache: "no-store" }).then((r) => r.text())]), bytes = new Uint8Array(await response.arrayBuffer()), signature = String.fromCharCode(...bytes.slice(0, 4)) + String.fromCharCode(...bytes.slice(8, 12)); const expected = ["filter: none", "opacity: .72", "rgba(251, 252, 255, .18)", "rgba(251, 252, 255, .72)", "rgba(255,255,255,.90)", "rgba(255,255,255,.93)", "pointer-events: none"]; if (!response.ok || signature !== "RIFFWEBP" || bytes.length < 250000 || bytes.length > 500000 || !expected.every((value) => css.includes(value))) throw new Error(`WebP/background CSS invalid: ${signature}, ${bytes.length}`); });
    await test("AA. Background WebP is in v27 APP_SHELL", async () => { const sw = await fetch("service-worker.js", { cache: "no-store" }).then((r) => r.text()); if (!sw.includes('const CACHE_NAME = "hoc-cung-be-v27"') || !sw.includes('"./assets/backgrounds/van-mieu-quoc-tu-giam.webp"')) throw new Error("v27 APP_SHELL is invalid"); });
    await test("AB. No old double-extension references", async () => { const files = ["index.html", "styles.css", "script.js", "child-settings.js", "service-worker.js", "README.md", "__run_browser_tests.py"], forbidden = ".webp" + ".png"; const texts = await Promise.all(files.map((path) => fetch(path, { cache: "no-store" }).then((r) => r.text()))); if (texts.some((text) => text.includes(forbidden))) throw new Error("Old double extension remains"); });
    await test("AC. Math navigation passes", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); expectScreen("math-screen", "Math navigation"); });
    await test("AD. Vietnamese navigation passes", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); expectScreen("math-screen", "Vietnamese navigation"); if (document.body.dataset.course !== "vietnamese-grade-1") throw new Error("Vietnamese course not active"); });
    await test("AE. Math level to Quiz passes", () => { resetGuest(); enterQuiz("math-grade-1"); });
    await test("AF. Vietnamese level to Quiz passes", () => { resetGuest(); enterQuiz("vietnamese-grade-1"); });
    await test("AG. Back navigation passes", () => { resetGuest(); enterQuiz("math-grade-1"); click("#quiz-back-button"); expectScreen("levels-screen", "Quiz back"); click('#levels-screen .back-button'); expectScreen("math-screen", "Levels back"); });
    return { passed: results.every((item) => item.passed), results };
  };
  const asChecks = (suite) => {
    if (Array.isArray(suite)) return suite;
    if (Array.isArray(suite?.results)) return suite.results;
    if (suite && typeof suite === "object") return Object.entries(suite.results || suite).filter(([key]) => key !== "passed" && key !== "samples" && key !== "error").map(([id, passed]) => ({ id, passed: Boolean(passed) }));
    return [];
  };
  for (const [suiteName, hook] of registry) {
    if (!(hook in window)) { missingSuites.push({ suite: suiteName, hook }); continue; }
    try { suites[suiteName] = await Promise.resolve(window[hook]); }
    catch (error) { suites[suiteName] = { passed: false, error: String(error), results: [{ id: "suite", passed: false }] }; }
  }
  suites["Can Enter Quiz"] = await runCanEnterQuizTests();
  // A clean navigation validates that no state from the flow tests is required for entry.
  if (!location.search.includes("fresh-quiz")) {
    location.replace(`${location.pathname}?fresh-quiz=1`);
    return;
  }
  const freshQuiz = [];
  try { resetGuest(); enterQuiz("math-grade-1"); freshQuiz.push({ id: "J. Refresh then start quiz works", passed: true }); }
  catch (error) { freshQuiz.push({ id: "J. Refresh then start quiz works", passed: false, error: String(error?.stack || error) }); }
  suites["Can Enter Quiz"].results = suites["Can Enter Quiz"].results.filter((item) => !item.id.startsWith("J." )).concat(freshQuiz);
  suites["Can Enter Quiz"].passed = suites["Can Enter Quiz"].results.every((item) => item.passed);
  suites["Auth, function menu, shared background and required navigation"] = await runAuthFunctionBackgroundTests();
  const all = Object.entries(suites).flatMap(([suite, value]) => asChecks(value).map((check) => ({ suite, ...check })));
  const failed = all.filter((item) => item && item.passed === false);
  missingSuites.forEach((item) => runtimeErrors.push({ type: "missing-suite", message: `${item.suite}: ${item.hook}` }));
  const realExitCode = failed.length || runtimeErrors.length || missingSuites.length ? 1 : 0;
  document.body.innerHTML = `<pre id="test-output">${JSON.stringify({ realExitCode, suiteCount: Object.keys(suites).length, suiteNames: Object.keys(suites), total: all.length, failedCount: failed.length, failed, runtimeErrorCount: runtimeErrors.length, runtimeErrors, missingSuites })}</pre>`;
});
</script>
'''

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

try:
    app_html = (ROOT / "index.html").read_text(encoding="utf-8")
    RUNNER.write_text(re.sub(r"(<body\b[^>]*>)", r"\1" + probe, app_html, count=1, flags=re.I), encoding="utf-8")
    shutil.rmtree(PROFILE, ignore_errors=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 8767), lambda *args, **kwargs: QuietHandler(*args, directory=str(ROOT), **kwargs))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    time.sleep(0.5)
    result = subprocess.run([
        str(CHROME), "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
        f"--user-data-dir={PROFILE}", "--virtual-time-budget=15000", "--dump-dom",
        "http://127.0.0.1:8767/__browser-test-runner.html",
    ], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=40)
    match = re.search(r'<pre id="test-output">([\s\S]*?)</pre>', result.stdout)
    if not match:
        raise RuntimeError("Chrome did not produce test output")
    report = json.loads(match.group(1).replace("&quot;", '"').replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">"))
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if report.get("realExitCode", 1):
        raise SystemExit(1)
finally:
    if "server" in globals():
        server.shutdown()
        server.server_close()
    RUNNER.unlink(missing_ok=True)
    shutil.rmtree(PROFILE, ignore_errors=True)