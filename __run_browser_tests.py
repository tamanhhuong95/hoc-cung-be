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
window.addEventListener("error", (event) => runtimeErrors.push({ type: "error", message: event.message || String(event.error || "Unknown error"), source: event.filename || "", line: event.lineno || 0 }));
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