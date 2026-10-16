import importlib.util,pathlib,threading,subprocess,time,json,base64
root=pathlib.Path(__file__).resolve().parent; out=root
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
 c=r.Cdp(page['webSocketDebuggerUrl']);c.call('Page.enable');c.call('Runtime.enable');c.call('Network.enable');c.call('Emulation.setDeviceMetricsOverride',{'width':375,'height':812,'deviceScaleFactor':1,'mobile':True});c.call('Page.navigate',{'url':'http://127.0.0.1:8772/hoc-cung-be/'})
 deadline=time.time()+30
 while time.time()<deadline:
  if c.evaluate('document.readyState==="complete" && !!window.HocCungBeV36'):break
  time.sleep(.5)
 c.evaluate('window.__smokeErrors=[];window.addEventListener("error",e=>window.__smokeErrors.push(e.message));window.addEventListener("unhandledrejection",e=>window.__smokeErrors.push(String(e.reason))); window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:null}}))')
 def click(selector):
  pos=c.evaluate('(() => {const n=document.querySelector('+json.dumps(selector)+');n.scrollIntoView({block:"center",behavior:"instant"});const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()')
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
 response=c.call('Runtime.evaluate',{'expression':'caches.keys().then(keys=>JSON.stringify(keys))','awaitPromise':True,'returnByValue':True});check('V38 cache exists', 'hoc-cung-be-v38' in json.loads(response['result']['value']))
 c.evaluate('localStorage.setItem("v37-smoke-sentinel","preserve-me")')
 check('No recorded online interaction runtime errors',c.evaluate('window.__smokeErrors.length===0'))
 c.call('Network.emulateNetworkConditions',{'offline':True,'latency':0,'downloadThroughput':0,'uploadThroughput':0});c.call('Page.reload',{'ignoreCache':True});time.sleep(4)
 check('Offline reload loads app at subpath',c.evaluate('!!window.HocCungBeV36 && document.readyState==="complete"'))
 check('Offline reload preserves local data',c.evaluate('localStorage.getItem("v37-smoke-sentinel")==="preserve-me"'))
 c.evaluate('window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:null}}))');click('#grade-choices [data-go="grade1"]');click('button[data-course="vietnamese-grade-1"]');click('#topic-grid button');click('#level-grid button')
 check('Offline Vietnamese lesson opens with physical clicks',c.evaluate('!document.querySelector("#quiz-screen").hidden && document.querySelectorAll("#answer-grid button").length===4'))
 (out/'__v38_mobile_offline.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png'})['data']))
finally:
 subprocess.run(['taskkill','/PID',str(chrome.pid),'/T','/F'],capture_output=True);server.shutdown()
 report={'checks':checks,'totalChecks':len(checks),'failedCount':sum(not x['passed'] for x in checks),'realExitCode':0 if checks and all(x['passed'] for x in checks) else 1}
 (out/'__v38_smoke_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report),flush=True)
raise SystemExit(report['realExitCode'])
