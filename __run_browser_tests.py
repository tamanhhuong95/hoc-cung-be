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
  const click = (selector, root = document) => { const node = root.querySelector(selector); if (!node) throw new Error(`Missing clickable element: ${selector}`); if (node.disabled) throw new Error(`Clickable element is disabled: ${selector}`); if (typeof node.onclick === "function") node.onclick(new MouseEvent("click", { bubbles: true, cancelable: true, view: window })); else node.click(); return node; };
  const resetGuest = () => {
    ["hoc-cung-be:guest-trial", "hoc-cung-be:math-grade-1-progress", "hoc-cung-be:progress:guest:vietnamese-grade-1", "hoc-cung-be:progress:testchild01:math-grade-1", "hoc-cung-be:progress:testchild01:vietnamese-grade-1", "hoc-cung-be:child-settings:testchild01"].forEach((key) => localStorage.removeItem(key));
    window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state", { detail: { user: null } }));
  };
  const enterQuiz = (courseId) => {
    click('[data-go="grade1"]');
    click(`[data-course="${courseId}"]`);
    click("#topic-grid button");
    click("#level-grid button");
    if (!isQuiz()) throw new Error(`${courseId} did not transition to quiz: ${JSON.stringify(state())}`);
  };
  const runCanEnterQuizTests = async () => {
    const results = [], test = async (id, fn) => { try { await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    await test("A. Guest can open first Math lesson", () => { resetGuest(); click('[data-go="grade1"]'); click('[data-course="math-grade-1"]'); click("#topic-grid button"); if (document.querySelector("#levels-screen").hidden || !document.querySelector("#level-grid button")) throw new Error(`Math first lesson did not open: ${JSON.stringify(state())}`); });
    await test("B. Guest can start Math quiz", () => { resetGuest(); enterQuiz("math-grade-1"); });
    await test("C. Guest can open first Vietnamese lesson", () => { resetGuest(); click('[data-go="grade1"]'); click('[data-course="vietnamese-grade-1"]'); click("#topic-grid button"); if (document.querySelector("#levels-screen").hidden || !document.querySelector("#level-grid button")) throw new Error(`Vietnamese first lesson did not open: ${JSON.stringify(state())}`); });
    await test("D. Guest can start Vietnamese quiz", () => { resetGuest(); enterQuiz("vietnamese-grade-1"); });
    const signedIn = () => {
      window.HocCungBeChildren = { ...window.HocCungBeChildren, getActiveChild: () => ({ id: "testchild01", name: "Bé Test", avatar: "🧒" }), getActiveChildId: () => "testchild01", openSelector: () => { throw new Error("Active child unexpectedly unavailable"); } };
      window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state", { detail: { user: { uid: "test-parent", email: "test@example.com" } } }));
      if (!document.body.dataset.authenticated.includes("true")) throw new Error("Mock authenticated state was not applied");
    };
    await test("E. Logged-in child can start Math quiz", () => { resetGuest(); signedIn(); enterQuiz("math-grade-1"); });
    await test("F. Logged-in child can start Vietnamese quiz", () => { resetGuest(); signedIn(); enterQuiz("vietnamese-grade-1"); });
    await test("G. Missing child settings uses defaults", () => { resetGuest(); signedIn(); localStorage.removeItem("hoc-cung-be:child-settings:testchild01"); if (!window.HocCungBeChildSettings.canStartLesson()) throw new Error("Missing settings blocked lesson"); enterQuiz("math-grade-1"); });
    await test("H. Missing cloud progress does not block start", () => { resetGuest(); signedIn(); localStorage.removeItem("hoc-cung-be:progress:testchild01:math-grade-1"); localStorage.removeItem("hoc-cung-be:progress:testchild01:vietnamese-grade-1"); enterQuiz("vietnamese-grade-1"); });
    await test("I. Course switch Math → Vietnamese → Math still starts quiz", () => { resetGuest(); signedIn(); enterQuiz("math-grade-1"); click("#quiz-back-button"); click('[data-go="grade1"]'); click('[data-course="vietnamese-grade-1"]'); click("#topic-grid button"); click("#level-grid button"); if (!isQuiz()) throw new Error("Vietnamese did not start after switch"); click("#quiz-back-button"); click('[data-go="grade1"]'); click('[data-course="math-grade-1"]'); click("#topic-grid button"); click("#level-grid button"); if (!isQuiz()) throw new Error("Math did not restart after switch"); });
    await test("J. Refresh then start quiz works", () => { if (!isQuiz()) throw new Error("Refresh flow is executed by a dedicated fresh runner navigation"); });
    await test("K. v21 app shell includes required modules", async () => { const required = ["./script.js", "./child-settings.js", "./parent-auth.js", "./child-profiles.js", "./data/vietnamese-grade-1.js"]; const text = await fetch("service-worker.js", { cache: "no-store" }).then((r) => r.text()); if (!text.includes('const CACHE_NAME = "hoc-cung-be-v21"') || !required.every((path) => text.includes(`"${path}"`))) throw new Error("v21 app shell is incomplete"); });
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
  const all = Object.entries(suites).flatMap(([suite, value]) => asChecks(value).map((check) => ({ suite, ...check })));
  const failed = all.filter((item) => item && item.passed === false);
  missingSuites.forEach((item) => runtimeErrors.push({ type: "missing-suite", message: `${item.suite}: ${item.hook}` }));
  document.body.innerHTML = `<pre id="test-output">${JSON.stringify({ suiteCount: Object.keys(suites).length, suiteNames: Object.keys(suites), total: all.length, failedCount: failed.length, failed, runtimeErrorCount: runtimeErrors.length, runtimeErrors, missingSuites })}</pre>`;
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
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if report["failedCount"] or report["runtimeErrorCount"]:
        raise SystemExit(1)
finally:
    if "server" in globals():
        server.shutdown()
        server.server_close()
    RUNNER.unlink(missing_ok=True)
    shutil.rmtree(PROFILE, ignore_errors=True)