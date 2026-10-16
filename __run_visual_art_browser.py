"""Physical interaction, responsive, V39 upgrade and offline checks in a disposable profile."""
import base64
import importlib.util
import json
import pathlib
import shutil
import subprocess
import threading
import time
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent
BASELINE = "0c619526f247d34c712092a58c5a418c84102679"
spec = importlib.util.spec_from_file_location("browser_runner", ROOT / "__run_browser_tests.py")
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
import functools
runner.websockets.sync.client.connect = functools.partial(runner.websockets.sync.client.connect, max_size=16 * 1024 * 1024)
runner.DEBUG_PORT = 9351
old_files = {name: subprocess.check_output(["git", "show", f"{BASELINE}:{name}"], cwd=ROOT) for name in ("index.html", "script.js", "styles.css", "service-worker.js", "parent-tools.js", "child-settings.js", "art-studio.js", "art-studio.css")}
serving_baseline = True
checks, runtime_errors = [], []

class Handler(runner.QuietHandler):
    def translate_path(self, path):
        return super().translate_path(path.removeprefix("/hoc-cung-be"))

    def do_GET(self):
        path = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path).removeprefix("/hoc-cung-be/")
        name = "index.html" if not path else path
        if serving_baseline and name in old_files:
            body = old_files[name]
            self.send_response(200)
            self.send_header("Content-Type", self.guess_type(name))
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_GET()

server = runner.http.server.ThreadingHTTPServer(("127.0.0.1", 8791), lambda *args, **kwargs: Handler(*args, directory=str(ROOT), **kwargs))
threading.Thread(target=server.serve_forever, daemon=True).start()
chrome = subprocess.Popen([str(runner.CHROME), "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-background-timer-throttling", f"--user-data-dir={runner.PROFILE}", "--remote-debugging-port=9351", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
cdp = None

def check(name, condition):
    item = {"name": name, "passed": bool(condition)}
    checks.append(item)
    print(json.dumps(item, ensure_ascii=False), flush=True)
    if not condition:
        raise AssertionError(name)

def wait_for(expression, timeout=30):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if cdp.evaluate(expression):
            return
        time.sleep(.15)
    raise TimeoutError(expression)

def promise(expression):
    remote = cdp.call("Runtime.evaluate", {"expression": expression, "awaitPromise": True, "returnByValue": True})["result"]
    if remote.get("subtype") == "error":
        raise RuntimeError(remote.get("description"))
    return remote.get("value")

def click(selector):
    point = cdp.evaluate("""(() => {const node=document.querySelector(%s);if(!node || node.disabled)throw new Error('Not clickable: '+%s);node.scrollIntoView({block:'center',behavior:'instant'});const r=node.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()""" % (json.dumps(selector), json.dumps(selector)))
    cdp.call("Input.dispatchMouseEvent", {"type": "mousePressed", "button": "left", "clickCount": 1, **point})
    cdp.call("Input.dispatchMouseEvent", {"type": "mouseReleased", "button": "left", "clickCount": 1, **point})
    time.sleep(.08)

def key(name, code, virtual):
    for kind in ("keyDown", "keyUp"):
        cdp.call("Input.dispatchKeyEvent", {"type": kind, "key": name, "code": code, "windowsVirtualKeyCode": virtual, **({"text":"\r","unmodifiedText":"\r"} if kind == "keyDown" and name == "Enter" else {})})

def screenshot(name):
    (ROOT / name).write_bytes(base64.b64decode(cdp.call("Page.captureScreenshot", {"format": "png"})["data"]))

def enter_game():
    click('[data-go="grade1"]')
    click('#grade1-screen [data-go="thinking-games"]')
    check("Physical game entry opens intro", cdp.evaluate('!document.querySelector("#thinking-games-screen").hidden && !document.querySelector("#memory-intro").hidden'))

def data_snapshot():
    return cdp.evaluate("""(() => {const p=loadProgress(),s=p.levels['counting-1'];return JSON.stringify({version:p.progressVersion,best:[s.bestScore,s.bestCorrect,s.bestQuestionCount,s.bestStars,s.attempts,s.completed,s.unlocked],history:p.history,time:p.studyTime.totalSeconds,trial:loadGuestTrial(),sentinel:localStorage.getItem('hoc-cung-be:upgrade-sentinel')});})()""")

try:
    page = runner.wait_for_page(chrome)
    cdp = runner.Cdp(page["webSocketDebuggerUrl"])
    cdp.call("Page.enable")
    cdp.call("Runtime.enable")
    cdp.call("Network.enable")
    cdp.call("Page.addScriptToEvaluateOnNewDocument", {"source": "window.__gameRuntimeErrors=[];window.addEventListener('error',e=>window.__gameRuntimeErrors.push(e.message||('resource: '+(e.target?.src||e.target?.href||''))),true);window.addEventListener('unhandledrejection',e=>window.__gameRuntimeErrors.push(String(e.reason)));"})
    cdp.call("Emulation.setDeviceMetricsOverride", {"width":375,"height":812,"deviceScaleFactor":1,"mobile":True})
    cdp.call("Page.navigate", {"url":"http://127.0.0.1:8791/hoc-cung-be/"})
    wait_for('document.readyState==="complete" && document.body.dataset.authResolved==="true" && !!window.HocCungBeV36')
    wait_for('!!navigator.serviceWorker.controller')
    check("Upgrade fixture starts with actual V39 worker", "hoc-cung-be-v39" in json.loads(promise("caches.keys().then(JSON.stringify)")))
    cdp.evaluate("""(() => {const p=loadProgress(),s=p.levels['counting-1'];Object.assign(s,{bestScore:80,bestCorrect:8,bestQuestionCount:10,bestStars:2,attempts:1,completed:true,unlocked:true,lastPlayedAt:'2026-10-15T10:00:00'});p.history=[{historyId:'upgrade-fixture',levelId:'counting-1',topic:LEVEL_BY_ID['counting-1'].topic,score:80,correct:8,questionCount:10,stars:2,completedAt:'2026-10-15T10:00:00'}];p.studyTime={totalSeconds:600,todaySeconds:600,todayDate:dateKey(),lastStudyDate:dateKey(),legacySeconds:0,studyTimeByDate:{[dateKey()]:600}};saveProgress(p);saveGuestTrial({completedLevelIds:['counting-1']});localStorage.setItem('hoc-cung-be:upgrade-sentinel','keep-old-progress');})()""")
    before_upgrade = data_snapshot()
    runtime_errors += cdp.evaluate("window.__gameRuntimeErrors") or []
    serving_baseline = False
    promise("navigator.serviceWorker.getRegistration().then(reg=>reg.update()).then(()=>true)")
    deadline = time.monotonic()+30
    while time.monotonic()<deadline:
        keys=json.loads(promise("caches.keys().then(JSON.stringify)"))
        if "hoc-cung-be-v40" in keys and "hoc-cung-be-v39" not in keys:
            break
        time.sleep(.2)
    check("Worker upgrade replaces V39 cache with V40", "hoc-cung-be-v40" in keys and "hoc-cung-be-v39" not in keys)
    cdp.call("Page.reload", {"ignoreCache":True})
    wait_for('document.readyState==="complete" && document.body.dataset.authResolved==="true" && !!window.HocCungBeThinkingGames')
    check("V39 legacy /10 progress and quota survive upgrade", data_snapshot()==before_upgrade)
    check("Both game files are present in precache", promise("caches.open('hoc-cung-be-v40').then(async c=>Boolean(await c.match('./thinking-games.js')) && Boolean(await c.match('./thinking-games.css')) && Boolean(await c.match('./thinking-playground.js')) && Boolean(await c.match('./playground.css')) && Boolean(await c.match('./art-grade1-data.js')) && Boolean(await c.match('./art-studio.js')) && Boolean(await c.match('./art-studio.css')) && Boolean(await c.match('./art-folds.js')))") is True)

    def solve_visible(kind):
        if kind=='odd':
            faces=cdp.evaluate('[...document.querySelectorAll("#playground-board button")].map(b=>b.textContent)')
            index=next(i for i,x in enumerate(faces) if faces.count(x)==1)
            click(f'#playground-board button:nth-child({index+1})')
        elif kind=='order':
            values=cdp.evaluate('[...document.querySelectorAll("#playground-board button")].map(b=>Number(b.textContent))')
            for value in sorted(values):
                index=values.index(value)
                click(f'#playground-board button:nth-child({index+1})')
        else:
            if kind=='count':
                value=str(cdp.evaluate('document.querySelectorAll("#playground-board .garden-object").length'))
            else:
                seq=cdp.evaluate('[...document.querySelectorAll("#playground-board .garden-object")].map(n=>n.textContent)')
                period=next(p for p in range(1,len(seq)) if all(seq[i]==seq[i%p] for i in range(len(seq))))
                value=seq[len(seq)%period]
            options=cdp.evaluate('[...document.querySelectorAll("#playground-options button")].map(b=>b.textContent)')
            click(f'#playground-options button:nth-child({options.index(value)+1})')

    for width,height in ((375,812),(768,1024),(1280,900)):
        cdp.call("Emulation.setDeviceMetricsOverride", {"width":width,"height":height,"deviceScaleFactor":1,"mobile":width<600})
        click('[data-go="grade1"]');click('#grade1-screen [data-go="art"]')
        check(f"{width} art catalog contains fourteen lessons and fits",cdp.evaluate('document.querySelectorAll("[data-art-lesson]").length===14 && document.documentElement.scrollWidth<=innerWidth'))
        screenshot(f"__v40_art_library_{width}.png")
        for lesson_id in cdp.evaluate('HocCungBeArtData.lessons.map(l=>l.id)'):
            before_art=data_snapshot()
            click(f'[data-art-lesson="{lesson_id}"]')
            check(f"{width} {lesson_id} materials and diagram",cdp.evaluate('!document.querySelector("#art-preparation").hidden && !!document.querySelector("#art-step-picture svg") && document.querySelectorAll("#art-materials li").length>=2'))
            if lesson_id=='ART-05':screenshot(f"__v40_art_dog_prep_{width}.png")
            step_count=cdp.evaluate('HocCungBeArtData.lessons.find(l=>l.id===HocCungBeArtStudio.getSummary().lessonId).steps.length')
            for stage in range(step_count):
                click('#art-step-next')
                if lesson_id=='ART-05':screenshot(f"__v40_art_dog_step_{stage+1}_{width}.png")
                if lesson_id in ('ART-13','ART-14') and stage in (0,2,7,12,13,14,20,24,25,26,27):
                    screenshot(f"__v40_{lesson_id}_step_{stage+1}_{width}.png")
                if lesson_id in ('ART-13','ART-14') and stage==2:
                    check(f"{width} {lesson_id} before after frames",cdp.evaluate('document.querySelectorAll("#art-step-picture figure").length===2 && document.querySelectorAll("#art-step-picture svg").length===2'))
                    click('#art-zoom-open')
                    check(f"{width} {lesson_id} physical zoom opens",cdp.evaluate('document.querySelector("#art-zoom-dialog").open && document.activeElement.id==="art-zoom-close"'))
                    screenshot(f"__v40_{lesson_id}_zoom_{width}.png")
                    key('Escape','Escape',27)
                    check(f"{width} {lesson_id} Escape closes zoom",cdp.evaluate('!document.querySelector("#art-zoom-dialog").open && document.activeElement.id==="art-zoom-open"'))

            check(f"{width} {lesson_id} steps visible, fit and touch sized",cdp.evaluate('HocCungBeArtStudio.getSummary().step===HocCungBeArtData.lessons.find(l=>l.id===HocCungBeArtStudio.getSummary().lessonId).steps.length-1 && document.documentElement.scrollWidth<=innerWidth && [...document.querySelectorAll("#art-lesson button:not([hidden])")].filter(b=>b.getBoundingClientRect().height>0).every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44})'))
            click('#art-step-next');click('#art-checks input')
            check(f"{width} {lesson_id} reflection without changing learning data",cdp.evaluate('HocCungBeArtStudio.getSummary().finished && document.querySelectorAll("#art-checks input").length===3') and data_snapshot()==before_art)
            if lesson_id=='ART-12':screenshot(f"__v40_art_result_{width}.png")
            click('#art-lesson [data-art-home]')
        click('#art-screen [data-go="grade1"]')
        enter_game()
        screenshot(f"__v40_game_intro_{width}.png")
        for kind in ('pattern','odd','count','order'):
            before_game=data_snapshot()
            click(f'[data-thinking-game="{kind}"]')
            screenshot(f"__v40_{kind}_{width}.png")
            check(f"{width} {kind} controls fit and are touch sized",cdp.evaluate('getComputedStyle(document.querySelector("#games-gallery")).display==="none" && document.documentElement.scrollWidth<=innerWidth && [...document.querySelectorAll("#playground-stage button:not([hidden])")].filter(b=>b.getBoundingClientRect().height>0).every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44})'))
            screenshot(f"__v40_{kind}_{width}.png")
            for stage in range(5):
                solve_visible(kind)
                check(f"{width} {kind} stage {stage+1} solved with physical clicks",cdp.evaluate('HocCungBePlayground.getSummary().solved'))
                if stage<4:click('#playground-next')
            check(f"{width} {kind} complete and learning data preserved",cdp.evaluate('HocCungBePlayground.getSummary().complete') and data_snapshot()==before_game)
            click('#playground-replay')
            check(f"{width} {kind} replay resets",cdp.evaluate('HocCungBePlayground.getSummary().step===0 && !HocCungBePlayground.getSummary().complete'))
            click('#playground-stage [data-game-home]')
        click("#memory-start")
        check(f"{width}x{height} eight cards and touch targets", cdp.evaluate('document.querySelectorAll("#memory-grid button").length===8 && [...document.querySelectorAll("#memory-grid button")].every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth;})'))
        check(f"{width}x{height} no horizontal overflow", cdp.evaluate('document.documentElement.scrollWidth<=innerWidth && document.body.scrollWidth<=innerWidth'))
        screenshot(f"__v40_game_board_{width}.png")
        if width==375:
            key("Enter","Enter",13)
            check("Native Enter flips focused card", cdp.evaluate('document.querySelectorAll("#memory-grid .is-open").length===1'))
            key("Enter","Enter",13)
            check("Native repeat Enter does not count a self-pair", cdp.evaluate('HocCungBeThinkingGames.getSummary().turns===0'))
            click("#memory-restart")
            before_play=data_snapshot()
            known={}
            for _ in range(24):
                cards=cdp.evaluate('[...document.querySelectorAll("#memory-grid button")].map((b,i)=>({i,matched:b.classList.contains("is-matched")}))')
                remaining=[card['i'] for card in cards if not card['matched']]
                if not remaining:
                    break
                first=next((i for i in remaining if i not in known),remaining[0])
                click(f'[data-memory-card="{first}"]')
                face=cdp.evaluate(f'document.querySelector(\'[data-memory-card="{first}"]\').textContent')
                known[first]=face
                second=next((i for i in remaining if i!=first and known.get(i)==face),None)
                if second is None:
                    second=next((i for i in remaining if i!=first and i not in known),next(i for i in remaining if i!=first))
                click(f'[data-memory-card="{second}"]')
                known[second]=cdp.evaluate(f'document.querySelector(\'[data-memory-card="{second}"]\').textContent')
                if cdp.evaluate('HocCungBeThinkingGames.getSummary().waiting'):
                    time.sleep(1.2)
            check("Physical full game reaches four pairs and result", cdp.evaluate('HocCungBeThinkingGames.getSummary().complete && !document.querySelector("#memory-result").hidden'))
            check("Game leaves existing lesson progress and quota intact", data_snapshot()==before_play)
            screenshot("__v40_game_completed_mobile.png")
        click('#thinking-games-screen [data-go="grade1"]')
        check(f"{width} navigation clears game state", cdp.evaluate('HocCungBeThinkingGames.getSummary()===null'))
    runtime_errors += cdp.evaluate("window.__gameRuntimeErrors") or []
    cdp.call("Network.emulateNetworkConditions", {"offline":True,"latency":0,"downloadThroughput":0,"uploadThroughput":0})
    cdp.call("Page.reload", {"ignoreCache":True})
    wait_for('document.readyState==="complete" && !!window.HocCungBeThinkingGames')
    cdp.evaluate('window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:null}}))')
    enter_game();click("#memory-start");click('[data-memory-card="0"]')
    check("Offline cold reload opens game and flips a card", cdp.evaluate('document.querySelectorAll("#memory-grid button").length===8 && document.querySelectorAll("#memory-grid .is-open").length===1'))
    click('#memory-play [data-game-home]')
    for kind in ('pattern','odd','count','order'):
        click(f'[data-thinking-game="{kind}"]');solve_visible(kind)
        check(f"Offline {kind} renders and accepts physical answer",cdp.evaluate('HocCungBePlayground.getSummary().solved'))
        click('#playground-stage [data-game-home]')
    click('#thinking-games-screen [data-go="grade1"]');click('#grade1-screen [data-go="art"]');click('[data-art-lesson="ART-06"]')
    for _ in range(9):click('#art-step-next')
    check('Offline art loads all eight fan steps and reflection',cdp.evaluate('HocCungBeArtStudio.getSummary().finished && !!document.querySelector("#art-step-picture svg")'))
    check('Offline art keeps V39 data',data_snapshot()==before_upgrade)
    click('#art-lesson [data-art-home]')
    for lesson_id,last in (('ART-13',27),('ART-14',9)):
        click(f'[data-art-lesson="{lesson_id}"]');click('#art-step-next');click('#art-zoom-open')
        check(f"Offline {lesson_id} visual guides and zoom",cdp.evaluate('document.querySelector("#art-zoom-dialog").open && document.querySelectorAll("#art-zoom-content svg").length===2'))
        key('Escape','Escape',27)
        cdp.evaluate(f'var artStepPicker=document.querySelector("#art-step-select");artStepPicker.value="{last}";artStepPicker.dispatchEvent(new Event("change"));')
        check(f"Offline {lesson_id} last step selected",cdp.evaluate(f'HocCungBeArtStudio.getSummary().step==={last}'))
        click('#art-lesson [data-art-home]')
    check("Offline play retains V39 data", data_snapshot()==before_upgrade)
    runtime_errors += cdp.evaluate("window.__gameRuntimeErrors") or []
    check("No page or resource runtime errors", not runtime_errors)
except Exception as error:
    checks.append({"name":"Browser test completion","passed":False,"error":f"{type(error).__name__}: {error}"})
    print(json.dumps(checks[-1],ensure_ascii=False),flush=True)
finally:
    if cdp:
        try:cdp.close()
        except Exception:pass
    subprocess.run(["taskkill","/PID",str(chrome.pid),"/T","/F"],capture_output=True)
    server.shutdown();server.server_close()
    shutil.rmtree(runner.PROFILE,ignore_errors=True)
    report={"baselineSha":BASELINE,"totalChecks":len(checks),"failedCount":sum(not c['passed'] for c in checks),"runtimeErrorCount":len(runtime_errors),"runtimeErrors":runtime_errors,"checks":checks,"realExitCode":0 if checks and all(c['passed'] for c in checks) else 1}
    (ROOT/"__v40_game_browser_report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False),flush=True)
raise SystemExit(report["realExitCode"])
