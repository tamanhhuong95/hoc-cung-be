import http.server
import json
import pathlib
import re
import shutil
import subprocess
import threading
import time

ROOT = pathlib.Path(__file__).resolve().parent
CHROME = pathlib.Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
RUNNER = ROOT / "__english-responsive-runner.html"
REPORT = ROOT / "__english_responsive_report.json"
PROFILE = ROOT / "__english-responsive-profile"
VIEWPORTS = [(375, 812), (768, 1024), (1280, 900)]

WRAPPER = r'''<!doctype html><html><meta charset="utf-8"><body><script>
const params = new URLSearchParams(location.search), requestedWidth = Number(params.get("width")), requestedHeight = Number(params.get("height"));
const frame = document.createElement("iframe"); frame.style.cssText = `width:${requestedWidth}px;height:${requestedHeight}px;border:0`; frame.src = "index.html?responsive-english=1"; document.body.append(frame);
frame.addEventListener("load", async () => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const win = frame.contentWindow, document = frame.contentDocument;
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const click = (selector) => { const node = document.querySelector(selector); if (!node) throw new Error(`Missing ${selector}`); node.click(); return node; };
  try {
    win.localStorage.removeItem("hoc-cung-be:guest-trial");
    win.dispatchEvent(new win.CustomEvent("hoc-cung-be:auth-state", { detail: { user: null } }));
    click('[data-go="grade1"]');
    const courseCards = [...document.querySelectorAll('#grade1-screen button[data-course]')];
    check(courseCards.length === 3, `Expected 3 course cards, got ${courseCards.length}`);
    check(courseCards.every((node) => { const rect = node.getBoundingClientRect(); return rect.width >= 44 && rect.height >= 44 && rect.left >= 0 && rect.right <= win.innerWidth; }), "Course card overflow/touch target invalid");
    click('button[data-course="english-grade-1"]'); click("#topic-grid button"); click("#level-grid button");
    check(!document.querySelector("#learn-screen").hidden, "English Learn not visible");
    const media = document.querySelector("#learn-featured-media"), begin = document.querySelector("#begin-practice-button"), en08 = win.HOC_CUNG_BE_ENGLISH_GRADE_1.levels.find((item) => item.id === "EN-08");
    win.renderEnglishMedia(media, en08.media.featured, en08.title);
    check(begin && begin.getBoundingClientRect().height >= 44, "Learn button touch target invalid");
    check(media && media.getBoundingClientRect().right <= win.innerWidth, "Learn media overflow");
    const learnVideo = media?.querySelector("video"), learnRect = learnVideo?.getBoundingClientRect();
    check(learnVideo && learnVideo.controls && learnVideo.playsInline && learnVideo.preload === "metadata", "Learn video attributes invalid");
    check(learnRect && learnRect.left >= 0 && learnRect.right <= win.innerWidth && Math.abs((learnRect.width / learnRect.height) - (16 / 9)) < .15, "Learn video aspect/overflow invalid");
    const quizHost = document.createElement("div"), en19 = win.HOC_CUNG_BE_ENGLISH_GRADE_1.levels.find((item) => item.id === "EN-19"), quizQuestion = en19.questions[0];
    quizHost.className = "english-quiz-video"; document.body.append(quizHost); win.renderEnglishMedia(quizHost, quizQuestion.video, en19.title);
    const quizVideo = quizHost.querySelector("video"), quizRect = quizVideo?.getBoundingClientRect();
    check(quizRect && quizRect.left >= 0 && quizRect.right <= win.innerWidth && quizRect.height < win.innerHeight, "Quiz video overflow/fullscreen sizing invalid");
    check(!quizHost.textContent.toLowerCase().includes(quizQuestion.answer), "Quiz video container leaks answer"); quizHost.remove();
    begin.click();
    const answers = [...document.querySelectorAll("#answer-grid button")];
    check(!document.querySelector("#quiz-screen").hidden && answers.length === 4, "Practice did not render");
    check(answers.every((node) => node.getBoundingClientRect().height >= 44), "Practice touch target invalid");
    check(document.documentElement.scrollWidth <= win.innerWidth && document.body.scrollWidth <= win.innerWidth, `Horizontal overflow ${document.documentElement.scrollWidth}/${document.body.scrollWidth}`);
  } catch (error) { failures.push(String(error?.stack || error)); }
  const actualWidth = win.innerWidth, actualHeight = win.innerHeight;
  frame.remove(); window.document.body.innerHTML = `<pre id="responsive-output">${JSON.stringify({ width: actualWidth, height: actualHeight, passed: failures.length === 0, failures })}</pre>`;
});
</script></body></html>'''

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

server = None
try:
    RUNNER.write_text(WRAPPER, encoding="utf-8")
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 8768), lambda *args, **kwargs: QuietHandler(*args, directory=str(ROOT), **kwargs))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    time.sleep(0.4)
    results = []
    for width, height in VIEWPORTS:
        shutil.rmtree(PROFILE, ignore_errors=True)
        run = subprocess.run([
            str(CHROME), "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
            f"--user-data-dir={PROFILE}", "--window-size=1400,1200", "--force-device-scale-factor=1",
            "--virtual-time-budget=6000", "--dump-dom", f"http://127.0.0.1:8768/__english-responsive-runner.html?width={width}&height={height}",
        ], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=25)
        match = re.search(r'<pre id="responsive-output">([\s\S]*?)</pre>', run.stdout)
        if not match:
            results.append({"requested": f"{width}x{height}", "passed": False, "failures": ["Chrome did not produce responsive output"]})
            continue
        results.append({"requested": f"{width}x{height}", **json.loads(match.group(1).replace("&quot;", '"').replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">"))})
    report = {"realExitCode": 0 if all(item["passed"] for item in results) else 1, "results": results}
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    raise SystemExit(report["realExitCode"])
finally:
    if server:
        server.shutdown(); server.server_close()
    RUNNER.unlink(missing_ok=True)
    shutil.rmtree(PROFILE, ignore_errors=True)