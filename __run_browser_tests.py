import http.server
import json
import pathlib
import re
import shutil
import subprocess
import threading
import time

ROOT = pathlib.Path(__file__).resolve().parent
RUNNER = ROOT / "__browser-test-runner.html"
PROFILE = ROOT / "__browser-test-profile"
CHROME = pathlib.Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")

probe = r'''
<script>
const runtimeErrors = [];
window.addEventListener("error", (event) => runtimeErrors.push({ type: "error", message: event.message || String(event.error || "Unknown error") }));
window.addEventListener("unhandledrejection", (event) => runtimeErrors.push({ type: "unhandledrejection", message: String(event.reason || "Unknown rejection") }));
setTimeout(async () => {
  const names = Object.keys(window).filter((name) => name.startsWith("__hocCungBe") && name.endsWith("Tests"));
  const suites = {};
  for (const name of names) {
    try { suites[name] = await Promise.resolve(window[name]); }
    catch (error) { suites[name] = { passed: false, error: String(error) }; }
  }
  const all = Object.values(suites).flatMap((suite) => Array.isArray(suite) ? suite : (suite?.results || []));
  const failed = all.filter((item) => item && item.passed === false);
  document.body.innerHTML = `<pre id="test-output">${JSON.stringify({ suiteCount: names.length, total: all.length, failedCount: failed.length, failed, runtimeErrorCount: runtimeErrors.length, runtimeErrors, cloud: suites.__hocCungBeCloudSyncTests })}</pre>`;
}, 4000);
</script>
'''

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

try:
    RUNNER.write_text((ROOT / "index.html").read_text(encoding="utf-8").replace("</body>", probe + "</body>"), encoding="utf-8")
    shutil.rmtree(PROFILE, ignore_errors=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 8767), lambda *args, **kwargs: QuietHandler(*args, directory=str(ROOT), **kwargs))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    time.sleep(0.5)
    result = subprocess.run([
        str(CHROME), "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
        f"--user-data-dir={PROFILE}", "--virtual-time-budget=10000", "--dump-dom",
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