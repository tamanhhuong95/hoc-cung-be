import importlib.util,pathlib,threading,subprocess,time,json,base64
root=pathlib.Path(__file__).resolve().parent; out=root
spec=importlib.util.spec_from_file_location('r',root/'__run_browser_tests.py');r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
import functools
r.websockets.sync.client.connect=functools.partial(r.websockets.sync.client.connect,max_size=16*1024*1024)
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
 c=r.Cdp(page['webSocketDebuggerUrl']);c.call('Page.enable');c.call('Runtime.enable');c.call('Network.enable');c.call('Page.addScriptToEvaluateOnNewDocument',{'source':'window.__smokeErrors=[];window.addEventListener("error",e=>window.__smokeErrors.push(e.message||String(e.target?.src||e.target?.href||"resource error")),true);window.addEventListener("unhandledrejection",e=>window.__smokeErrors.push(String(e.reason)));'});c.call('Emulation.setDeviceMetricsOverride',{'width':375,'height':812,'deviceScaleFactor':1,'mobile':True});c.call('Page.navigate',{'url':'https://tamanhhuong95.github.io/hoc-cung-be/'})
 deadline=time.time()+30
 while time.time()<deadline:
  if c.evaluate('document.readyState==="complete" && !!window.HocCungBeV36'):break
  time.sleep(.5)
 c.evaluate('window.__smokeErrors=[];window.addEventListener("error",e=>window.__smokeErrors.push(e.message));window.addEventListener("unhandledrejection",e=>window.__smokeErrors.push(String(e.reason))); window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:null}}))')
 def click(selector):
  pos=c.evaluate('(() => {const n=[...document.querySelectorAll('+json.dumps(selector)+')].find(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0;});if(!n)throw Error("No visible control");n.scrollIntoView({block:"center",behavior:"instant"});const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()')
  c.call('Input.dispatchMouseEvent',{'type':'mousePressed','button':'left','clickCount':1,**pos});c.call('Input.dispatchMouseEvent',{'type':'mouseReleased','button':'left','clickCount':1,**pos});time.sleep(.15)
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
 response=c.call('Runtime.evaluate',{'expression':'caches.keys().then(keys=>JSON.stringify(keys))','awaitPromise':True,'returnByValue':True});check('V43 cache exists', 'hoc-cung-be-v43' in json.loads(response['result']['value']))
 c.evaluate('localStorage.setItem("v37-smoke-sentinel","preserve-me")')
 def garden_home(mode,width):
  c.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':812 if width==375 else 1024 if width==768 else 900,'deviceScaleFactor':1,'mobile':width==375})
  click('.brand')
  check(f'{mode} {width} garden Home fits',c.evaluate('document.documentElement.scrollWidth<=innerWidth && document.querySelector(".hero h1").textContent.includes("Học một chút")'))
  check(f'{mode} {width} original Van Mieu remains visible',c.evaluate('getComputedStyle(document.querySelector(".hero")).backgroundImage.includes("van-mieu-quoc-tu-giam.webp")'))
  check(f'{mode} {width} five grades have touch targets',c.evaluate('[...document.querySelectorAll("#grade-choices [data-go]")].length===5 && [...document.querySelectorAll("#grade-choices [data-go]")].every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth})'))
  check(f'{mode} {width} four illustrated subjects fit',c.evaluate('[...document.querySelectorAll("[data-garden-subject]")].length===4 && [...document.querySelectorAll("[data-garden-subject]")].every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth})'))
  if mode=='Online':(out/f'__v43_production_home_{width}.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png'})['data']))
  click('[data-garden-subject="math"]');click('#topic-grid button');click('#level-grid button')
  check(f'{mode} {width} real Home subject starts quiz',c.evaluate('!document.querySelector("#quiz-screen").hidden && document.querySelectorAll("#answer-grid button").length===4'))
  if mode=='Online':(out/f'__v43_production_quiz_{width}.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png'})['data']))
  if width<=800:
   click('[data-garden-nav="home"]');check(f'{mode} {width} mobile Home asks before leaving quiz',c.evaluate('!document.querySelector("#quiz-leave-dialog").hidden && !document.querySelector("#quiz-screen").hidden'));click('#quiz-leave-stay')
   click('[data-garden-nav="parent"]');check(f'{mode} {width} mobile parent asks before leaving quiz',c.evaluate('!document.querySelector("#quiz-leave-dialog").hidden'));click('#quiz-leave-confirm')
   check(f'{mode} {width} guest parent uses existing login',c.evaluate('!document.querySelector("#account-login-screen").hidden'))
   if mode=='Online':(out/f'__v43_production_login_{width}.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png'})['data']))
  else:click('#quiz-back-button');click('#quiz-leave-confirm')
  click('.brand');click('[data-garden-subject="art"]')
  check(f'{mode} {width} real Home art opens selected catalog',c.evaluate('!document.querySelector("#art-screen").hidden && HocCungBeArtStudio.getGrade()==="grade-"+HocCungBeGardenUi.getGrade()'))
  click('[data-art-lesson]');click('#art-step-next')
  if mode=='Online':(out/f'__v43_production_art_{width}.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png'})['data']))
  click('.brand')
 for width in (375,768,1280):garden_home('Online',width)
 def upper_grades(mode,width):
  c.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':812 if width==375 else 1024 if width==768 else 900,'deviceScaleFactor':1,'mobile':width==375})
  for grade in (3,4,5):
   click('.brand');click(f'#grade-choices [data-go="grade{grade}"]')
   check(f'{mode} {width} Grade {grade} catalog fits',c.evaluate('document.documentElement.scrollWidth<=innerWidth && [...document.querySelectorAll(".screen:not([hidden]) .subject-card")].every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth})'))
   if mode=='Online':(out/f'__v43_production_grade{grade}_catalog_{width}.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png'})['data']))
   for subject in ('math','vietnamese','english'):
    course=f'{subject}-grade-{grade}';click(f'#grade{grade}-screen [data-course="{course}"]');click('#topic-grid button');click('#level-grid button')
    if subject=='english':
     check(f'{mode} {width} {course} Learn',c.evaluate('!document.querySelector("#learn-screen").hidden && document.querySelectorAll("#learn-word-grid button").length>0'))
     click('#begin-practice-button')
    check(f'{mode} {width} {course} quiz fits',c.evaluate('!document.querySelector("#quiz-screen").hidden && document.documentElement.scrollWidth<=innerWidth && document.querySelectorAll("#answer-grid button").length===4 && [...document.querySelectorAll("#answer-grid button")].every(b=>b.getBoundingClientRect().height>=44)'))
    if subject=='vietnamese' and mode=='Online':(out/f'__v43_production_grade{grade}_reading_{width}.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png'})['data']))
    click('#quiz-back-button');click('#quiz-leave-confirm');click('.brand');click(f'#grade-choices [data-go="grade{grade}"]')
   click(f'#grade{grade}-screen [data-go="art"]')
   check(f'{mode} {width} Grade {grade} six art projects',c.evaluate('document.querySelectorAll("[data-art-lesson]").length===6'))
   numbers=range(1,7) if width==375 else (6,)
   for number in numbers:
    lesson=f'ART{grade}-{number:02d}';click(f'[data-art-lesson="{lesson}"]');click('#art-step-next')
    check(f'{mode} {width} {lesson} diagram fits',c.evaluate('document.documentElement.scrollWidth<=innerWidth && !!document.querySelector("#art-step-picture svg")'))
    if mode=='Online' and number==6:(out/f'__v43_production_grade{grade}_art_{width}.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png'})['data']))
    count=c.evaluate('HOC_CUNG_BE_UPPER_ART['+str(grade)+'].lessons.find(l=>l.id===HocCungBeArtStudio.getSummary().lessonId).steps.length')
    for _ in range(count):click('#art-step-next')
    check(f'{mode} {width} {lesson} completed',c.evaluate('HocCungBeArtStudio.getSummary().finished'))
    click('#art-lesson [data-art-home]')
  check(f'{mode} {width} local storage sentinel retained',c.evaluate('localStorage.getItem("v37-smoke-sentinel")==="preserve-me"'))
 for width in (375,768,1280):upper_grades('Online',width)
 check('No recorded online interaction runtime errors',c.evaluate('window.__smokeErrors.length===0'))
 c.call('Network.emulateNetworkConditions',{'offline':True,'latency':0,'downloadThroughput':0,'uploadThroughput':0});c.call('Page.reload',{'ignoreCache':True});time.sleep(4)
 check('Offline reload loads app at subpath',c.evaluate('!!window.HocCungBeV36 && document.readyState==="complete"'))
 check('Offline reload preserves local data',c.evaluate('localStorage.getItem("v37-smoke-sentinel")==="preserve-me"'))
 c.evaluate('window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:null}}))');click('#grade-choices [data-go="grade2"]');click('button[data-course="vietnamese-grade-2"]');click('#topic-grid button');click('#level-grid button')
 check('Offline Vietnamese lesson opens with physical clicks',c.evaluate('!document.querySelector("#quiz-screen").hidden && document.querySelectorAll("#answer-grid button").length===4'))
 click('#quiz-back-button');click('#quiz-leave-confirm')
 garden_home('Offline',375)
 upper_grades('Offline',375)
 check('Offline runtime capture active and empty',c.evaluate('Array.isArray(window.__smokeErrors) && window.__smokeErrors.length===0'))
 (out/'__v43_production_mobile_offline.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png'})['data']))
finally:
 try:
  runtime_errors=c.evaluate('window.__smokeErrors')
  if not isinstance(runtime_errors,list):runtime_errors=['Runtime capture unavailable']
 except Exception as error:runtime_errors=[str(error)]
 subprocess.run(['taskkill','/PID',str(chrome.pid),'/T','/F'],capture_output=True);server.shutdown()
 report={'checks':checks,'totalChecks':len(checks),'failedCount':sum(not x['passed'] for x in checks),'runtimeErrors':runtime_errors,'realExitCode':0 if checks and all(x['passed'] for x in checks) and not runtime_errors else 1}
 (out/'__v43_production_smoke_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report),flush=True)
raise SystemExit(report['realExitCode'])
