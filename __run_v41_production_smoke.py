import importlib.util,pathlib,threading,subprocess,time,json,base64
root=pathlib.Path(r'D:\anh hương\o 1\saoluu3012\Desktop\Học Cùng Bé'); out=pathlib.Path(__file__).parent
spec=importlib.util.spec_from_file_location('r',root/'__run_browser_tests.py');r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
class Handler(r.QuietHandler):
 def translate_path(self,path):
  return super().translate_path(path.removeprefix('/hoc-cung-be'))
server=r.http.server.ThreadingHTTPServer(('127.0.0.1',8772),lambda *a,**k:Handler(*a,directory=str(root),**k));threading.Thread(target=server.serve_forever,daemon=True).start()
chrome=subprocess.Popen([str(r.CHROME),'--headless=new','--disable-gpu','--no-first-run','--disable-background-timer-throttling',f'--user-data-dir={r.PROFILE}','--remote-debugging-port=9346','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
checks=[]
def check(name,condition):
 checks.append({'name':name,'passed':bool(condition)});print(json.dumps(checks[-1]),flush=True)
try:
 deadline=time.time()+15
 while time.time()<deadline:
  try:
   page=next(p for p in r.requests.get('http://127.0.0.1:9346/json',timeout=1).json() if p.get('type')=='page' and p.get('url')=='about:blank');break
  except Exception:time.sleep(.2)
 c=r.Cdp(page['webSocketDebuggerUrl']);c.call('Page.enable');c.call('Runtime.enable');c.call('Network.enable');c.call('Page.addScriptToEvaluateOnNewDocument',{'source':'window.__smokeErrors=window.__smokeErrors||[];window.addEventListener("error",e=>window.__smokeErrors.push(e.message||("resource: "+(e.target?.src||e.target?.href||""))),true);window.addEventListener("unhandledrejection",e=>window.__smokeErrors.push(String(e.reason)));'});c.call('Emulation.setDeviceMetricsOverride',{'width':375,'height':812,'deviceScaleFactor':1,'mobile':True});c.call('Page.navigate',{'url':'https://tamanhhuong95.github.io/hoc-cung-be/'})
 deadline=time.time()+30
 while time.time()<deadline:
  if c.evaluate('document.readyState==="complete" && !!window.HocCungBeV36'):break
  time.sleep(.5)
 c.evaluate('window.__smokeErrors=window.__smokeErrors||[];window.addEventListener("error",e=>window.__smokeErrors.push(e.message));window.addEventListener("unhandledrejection",e=>window.__smokeErrors.push(String(e.reason))); window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:null}}))')
 def click(selector):
  pos=c.evaluate('(() => {const n=document.querySelector('+json.dumps(selector)+');n.scrollIntoView({block:"center",behavior:"instant"});const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()')
  c.call('Input.dispatchMouseEvent',{'type':'mousePressed','button':'left','clickCount':1,**pos});c.call('Input.dispatchMouseEvent',{'type':'mouseReleased','button':'left','clickCount':1,**pos});time.sleep(.15)
 def solve_visible(kind):
     if kind=='odd':
         faces=c.evaluate('[...document.querySelectorAll("#playground-board button")].map(b=>b.textContent)')
         index=next(i for i,x in enumerate(faces) if faces.count(x)==1)
         click(f'#playground-board button:nth-child({index+1})')
     elif kind=='order':
         values=c.evaluate('[...document.querySelectorAll("#playground-board button")].map(b=>Number(b.textContent))')
         for value in sorted(values):
             index=values.index(value)
             click(f'#playground-board button:nth-child({index+1})')
     else:
         if kind=='count':
             value=str(c.evaluate('document.querySelectorAll("#playground-board .garden-object").length'))
         else:
             seq=c.evaluate('[...document.querySelectorAll("#playground-board .garden-object")].map(n=>n.textContent)')
             period=next(p for p in range(1,len(seq)) if all(seq[i]==seq[i%p] for i in range(len(seq))))
             value=seq[len(seq)%period]
         options=c.evaluate('[...document.querySelectorAll("#playground-options button")].map(b=>b.textContent)')
         click(f'#playground-options button:nth-child({options.index(value)+1})')

 click('#grade-choices [data-go="grade1"]');click('button[data-course="math-grade-1"]');click('#topic-grid button');click('#level-grid button')
 check('Physical click enters quiz',c.evaluate('!document.querySelector("#quiz-screen").hidden'))
 click('#quiz-back-button');check('Physical Back opens leave dialog',c.evaluate('!document.querySelector("#quiz-leave-dialog").hidden && !document.querySelector("#quiz-screen").hidden'))
 def key(name,code,virtual,modifiers=0):
  c.call('Input.dispatchKeyEvent',{'type':'keyDown','key':name,'code':code,'windowsVirtualKeyCode':virtual,'modifiers':modifiers});c.call('Input.dispatchKeyEvent',{'type':'keyUp','key':name,'code':code,'windowsVirtualKeyCode':virtual,'modifiers':modifiers})
 key('Tab','Tab',9);key('Tab','Tab',9)
 check('Physical Tab cycles inside leave dialog',c.evaluate('document.activeElement.id==="quiz-leave-stay"'))
 key('Tab','Tab',9,8)
 check('Physical Shift Tab cycles backwards inside leave dialog',c.evaluate('document.activeElement.id==="quiz-leave-confirm"'))
 key('Escape','Escape',27)
 check('Physical Escape retains quiz and restores opener focus',c.evaluate('document.querySelector("#quiz-leave-dialog").hidden && !document.querySelector("#quiz-screen").hidden && document.activeElement.id==="quiz-back-button"'))
 click('#quiz-back-button')
 click('#quiz-leave-stay');check('Physical Stay retains quiz and closes dialog',c.evaluate('document.querySelector("#quiz-leave-dialog").hidden && !document.querySelector("#quiz-screen").hidden'))
 click('#quiz-back-button');click('#quiz-leave-confirm');check('Physical Leave reaches level list',c.evaluate('document.querySelector("#quiz-leave-dialog").hidden && !document.querySelector("#levels-screen").hidden'))
 deadline=time.time()+30
 while time.time()<deadline:
  if c.evaluate('!!navigator.serviceWorker.controller'):break
  time.sleep(.5)
 check('Service worker controls GitHub Pages-style subpath',c.evaluate('!!navigator.serviceWorker.controller && navigator.serviceWorker.controller.scriptURL.endsWith("/hoc-cung-be/service-worker.js")'))
 response=c.call('Runtime.evaluate',{'expression':'caches.keys().then(keys=>JSON.stringify(keys))','awaitPromise':True,'returnByValue':True});check('V41 cache exists', 'hoc-cung-be-v41' in json.loads(response['result']['value']))
 c.evaluate('localStorage.setItem("v36-smoke-sentinel","preserve-me")')
 check('No recorded online interaction runtime errors',c.evaluate('window.__smokeErrors.length===0'))
 click('.brand');click('#grade-choices [data-go="grade1"]');click('#grade1-screen [data-go="thinking-games"]')
 check('Production thinking game entry is visible',c.evaluate('!document.querySelector("#memory-intro").hidden && !document.querySelector("#thinking-games-screen").hidden'))
 click('#memory-start');click('[data-memory-card="0"]')
 check('Production physical click opens one of eight cards',c.evaluate('document.querySelectorAll("#memory-grid button").length===8 && document.querySelectorAll("#memory-grid .is-open").length===1'))
 click('#memory-play [data-game-home]')
 for kind in ('pattern','odd','count','order'):
  click(f'[data-thinking-game="{kind}"]');solve_visible(kind)
  check(f'Online production {kind} accepts physical answer',c.evaluate('HocCungBePlayground.getSummary().solved'))
  click('#playground-stage [data-game-home]')
 click('#thinking-games-screen [data-go="grade1"]');click('#grade1-screen [data-go="art"]')
 check('Online production art lists fourteen lessons',c.evaluate('document.querySelectorAll("[data-art-lesson]").length===14 && !document.querySelector("#art-screen").hidden'))
 for lesson in ('ART-03','ART-05','ART-09'):
  click(f'[data-art-lesson="{lesson}"]')
  check(f'Online {lesson} shows materials and SVG',c.evaluate('!document.querySelector("#art-preparation").hidden && !!document.querySelector("#art-step-picture svg")'))
  step_count=c.evaluate('HocCungBeArtData.lessons.find(l=>l.id===HocCungBeArtStudio.getSummary().lessonId).steps.length')
  for _ in range(step_count+1):click('#art-step-next')
  check(f'Online {lesson} reaches reflection',c.evaluate('HocCungBeArtStudio.getSummary().finished && document.querySelectorAll("#art-checks input").length===3'))
  click('#art-checks input');click('#art-lesson [data-art-home]')
 check('Online art does not create a fourth progress course',c.evaluate('Object.keys(HocCungBeLearning.COURSES).length===6 && !Object.keys(localStorage).some(k=>k.includes("art-grade-1"))'))
 for lesson,total in (('ART-13',28),('ART-14',10)):
  click(f'[data-art-lesson="{lesson}"]');click('#art-step-next')
  check(f'Online {lesson} shows before and after frames',c.evaluate('document.querySelectorAll("#art-step-picture figure").length===2 && document.querySelectorAll("#art-step-picture svg").length===2'))
  click('#art-zoom-open')
  check(f'Online {lesson} physical zoom opens',c.evaluate('document.querySelector("#art-zoom-dialog").open && document.activeElement.id==="art-zoom-close"'))
  key('Escape','Escape',27)
  check(f'Online {lesson} Escape restores focus',c.evaluate('!document.querySelector("#art-zoom-dialog").open && document.activeElement.id==="art-zoom-open"'))
  for _ in range(total):click('#art-step-next')
  check(f'Online {lesson} completes all {total} steps',c.evaluate('HocCungBeArtStudio.getSummary().finished'))
  click('#art-guide-toggle')
  check(f'Online {lesson} guide toggle preserves reflection',c.evaluate('HocCungBeArtStudio.getSummary().finished && !document.querySelector("#art-result").hidden'))
  click('#art-lesson [data-art-home]')
 def grade2_smoke(mode):
  click('.brand');click('#grade-choices [data-go="grade2"]')
  check(mode+' Grade 2 has three assessed courses plus art',c.evaluate('document.querySelectorAll("#grade2-screen [data-course]").length===3 && !!document.querySelector("#grade2-screen [data-go=art]")'))
  for course in ('math-grade-2','vietnamese-grade-2','english-grade-2'):
   click(f'#grade2-screen [data-course="{course}"]');click('#topic-grid button');click('#level-grid button')
   if course=='english-grade-2':
    check(mode+' English Grade 2 Learn vocabulary',c.evaluate('!document.querySelector("#learn-screen").hidden && document.querySelectorAll("#learn-word-grid button").length>0'))
    click('#begin-practice-button')
   check(mode+' '+course+' enters five-question quiz',c.evaluate('!document.querySelector("#quiz-screen").hidden && document.querySelectorAll("#answer-grid button").length===4 && document.querySelector("#question-count").textContent.includes("1 / 5")'))
   check(mode+' '+course+' is correct active curriculum',c.evaluate('HocCungBeLearning.getActiveCourseId()')==course)
   click('#quiz-back-button');click('#quiz-leave-confirm');click('.brand');click('#grade-choices [data-go="grade2"]')
  click('#grade2-screen [data-go="art"]')
  check(mode+' eight Grade 2 art projects',c.evaluate('HocCungBeArtStudio.getGrade()==="grade-2" && document.querySelectorAll("[data-art-lesson]").length===8'))
  for number in range(1,9):
   lesson=f'ART2-{number:02d}';click(f'[data-art-lesson="{lesson}"]')
   for _ in range(5):click('#art-step-next')
   check(mode+' '+lesson+' reaches reflection',c.evaluate('HocCungBeArtStudio.getSummary().finished && !!document.querySelector("#art-step-picture svg")'))
   click('#art-lesson [data-art-home]')
  check(mode+' Grade 2 preserves sentinel and cloud stays disabled',c.evaluate('localStorage.getItem("v36-smoke-sentinel")==="preserve-me" && HOC_CUNG_BE_GRADE2.cloudSyncEnabled===false'))
 grade2_smoke('Online')
 check('No runtime errors in online art and new games',c.evaluate('window.__smokeErrors.length===0'))
 c.call('Network.emulateNetworkConditions',{'offline':True,'latency':0,'downloadThroughput':0,'uploadThroughput':0});c.call('Page.reload',{'ignoreCache':True});time.sleep(4)
 check('Offline reload loads app at subpath',c.evaluate('!!window.HocCungBeV36 && document.readyState==="complete"'))
 check('Offline reload preserves local data',c.evaluate('localStorage.getItem("v36-smoke-sentinel")==="preserve-me"'))
 c.evaluate('window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:null}}))');click('#grade-choices [data-go="grade1"]');click('button[data-course="vietnamese-grade-1"]');click('#topic-grid button');click('#level-grid button')
 check('Offline Vietnamese lesson opens with physical clicks',c.evaluate('!document.querySelector("#quiz-screen").hidden && document.querySelectorAll("#answer-grid button").length===4'))
 click('#quiz-back-button');click('#quiz-leave-confirm');click('.brand');click('#grade-choices [data-go="grade1"]');click('#grade1-screen [data-go="thinking-games"]');click('#memory-start');click('[data-memory-card="0"]')
 check('Production game works after offline cold reload',c.evaluate('document.querySelectorAll("#memory-grid button").length===8 && document.querySelectorAll("#memory-grid .is-open").length===1'))
 check('Production offline game preserves local data',c.evaluate('localStorage.getItem("v36-smoke-sentinel")==="preserve-me"'))
 click('#memory-play [data-game-home]')
 for kind in ('pattern','odd','count','order'):
  click(f'[data-thinking-game="{kind}"]');solve_visible(kind)
  check(f'Offline production {kind} accepts physical answer',c.evaluate('HocCungBePlayground.getSummary().solved'))
  click('#playground-stage [data-game-home]')
 click('#thinking-games-screen [data-go="grade1"]');click('#grade1-screen [data-go="art"]')
 check('Offline production art lists fourteen lessons',c.evaluate('document.querySelectorAll("[data-art-lesson]").length===14 && !document.querySelector("#art-screen").hidden'))
 for lesson in ('ART-03','ART-05','ART-09'):
  click(f'[data-art-lesson="{lesson}"]')
  check(f'Offline {lesson} shows materials and SVG',c.evaluate('!document.querySelector("#art-preparation").hidden && !!document.querySelector("#art-step-picture svg")'))
  step_count=c.evaluate('HocCungBeArtData.lessons.find(l=>l.id===HocCungBeArtStudio.getSummary().lessonId).steps.length')
  for _ in range(step_count+1):click('#art-step-next')
  check(f'Offline {lesson} reaches reflection',c.evaluate('HocCungBeArtStudio.getSummary().finished && document.querySelectorAll("#art-checks input").length===3'))
  click('#art-checks input');click('#art-lesson [data-art-home]')
 check('Offline art does not create a persisted art course',c.evaluate('Object.keys(HocCungBeLearning.COURSES).length===6 && !Object.keys(localStorage).some(k=>k.includes("art-grade-1"))'))
 for lesson,total in (('ART-13',28),('ART-14',10)):
  click(f'[data-art-lesson="{lesson}"]');click('#art-step-next')
  check(f'Offline {lesson} shows before and after frames',c.evaluate('document.querySelectorAll("#art-step-picture figure").length===2 && document.querySelectorAll("#art-step-picture svg").length===2'))
  click('#art-zoom-open')
  check(f'Offline {lesson} physical zoom opens',c.evaluate('document.querySelector("#art-zoom-dialog").open && document.activeElement.id==="art-zoom-close"'))
  key('Escape','Escape',27)
  check(f'Offline {lesson} Escape restores focus',c.evaluate('!document.querySelector("#art-zoom-dialog").open && document.activeElement.id==="art-zoom-open"'))
  for _ in range(total):click('#art-step-next')
  check(f'Offline {lesson} completes all {total} steps',c.evaluate('HocCungBeArtStudio.getSummary().finished'))
  click('#art-guide-toggle')
  check(f'Offline {lesson} guide toggle preserves reflection',c.evaluate('HocCungBeArtStudio.getSummary().finished && !document.querySelector("#art-result").hidden'))
  click('#art-lesson [data-art-home]')
 grade2_smoke('Offline')
 check('No recorded production offline runtime errors',c.evaluate('window.__smokeErrors.length===0'))
 (out/'v41-production-mobile-offline.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png'})['data']))
finally:
 diag_runtime=c.evaluate('window.__smokeErrors');diag_game=c.evaluate('({kind:window.HocCungBePlayground?.getSummary(),art:window.HocCungBeArtStudio?.getSummary()})')
 subprocess.run(['taskkill','/PID',str(chrome.pid),'/T','/F'],capture_output=True);server.shutdown()
 report={'runtimeErrors':diag_runtime,'gameDiagnostic':diag_game,'checks':checks,'totalChecks':len(checks),'failedCount':sum(not x['passed'] for x in checks),'realExitCode':0 if checks and all(x['passed'] for x in checks) and not diag_runtime else 1}
 (out/'v41_production_smoke_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report),flush=True)
raise SystemExit(report['realExitCode'])
