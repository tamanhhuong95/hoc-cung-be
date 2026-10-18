"""V45 farm physical actions, identity/transaction fixtures, responsive and offline. Isolated profile only."""
import importlib.util,pathlib,threading,subprocess,time,json,base64,functools,traceback
root=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('r',root/'__run_browser_tests.py');r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
r.websockets.sync.client.connect=functools.partial(r.websockets.sync.client.connect,max_size=16*1024*1024)
class Handler(r.QuietHandler):
 def translate_path(self,path):return super().translate_path(path.removeprefix('/hoc-cung-be'))
server=r.http.server.ThreadingHTTPServer(('127.0.0.1',8788),lambda *a,**k:Handler(*a,directory=str(root),**k));threading.Thread(target=server.serve_forever,daemon=True).start()
chrome=subprocess.Popen([str(r.CHROME),'--headless=new','--disable-gpu','--no-first-run',f'--user-data-dir={r.PROFILE}','--remote-debugging-port=9358','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
checks=[];errors=[]
def check(name,ok):checks.append({'name':name,'passed':bool(ok)});print(json.dumps(checks[-1]),flush=True)
try:
 for _ in range(60):
  try:page=next(p for p in r.requests.get('http://127.0.0.1:9358/json',timeout=1).json() if p.get('type')=='page');break
  except Exception:time.sleep(.25)
 c=r.Cdp(page['webSocketDebuggerUrl']);c.call('Page.enable');c.call('Runtime.enable');c.call('Network.enable');c.call('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-motion','value':'no-preference'}]})
 c.call('Page.addScriptToEvaluateOnNewDocument',{'source':'window.__farmErrors=[];window.addEventListener("error",e=>__farmErrors.push(e.message||"resource failed"),true);window.addEventListener("unhandledrejection",e=>__farmErrors.push(String(e.reason)));'})
 def wait(expr):
  for _ in range(80):
   if c.evaluate(expr):return
   time.sleep(.25)
  raise RuntimeError('Timed out: '+expr)
 def js(expr):
  result=c.call('Runtime.evaluate',{'expression':expr,'awaitPromise':True,'returnByValue':True})
  if result.get('exceptionDetails'):raise RuntimeError(str(result['exceptionDetails']))
  return result.get('result',{}).get('value')
 def click(selector):
  pos=c.evaluate('(()=>{const n=[...document.querySelectorAll('+json.dumps(selector)+')].find(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0});if(!n)throw Error("No visible control");n.scrollIntoView({block:"center",behavior:"instant"});const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()')
  c.call('Input.dispatchMouseEvent',{'type':'mousePressed','button':'left','clickCount':1,**pos});c.call('Input.dispatchMouseEvent',{'type':'mouseReleased','button':'left','clickCount':1,**pos});time.sleep(.18)
 def screenshot(name):
  c.evaluate('scrollTo(0,0)');time.sleep(.2);(root/name).write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})['data']))
 c.call('Page.navigate',{'url':'http://127.0.0.1:8788/hoc-cung-be/'});wait('document.readyState==="complete"&&!!window.HocCungBeFarmAccess&&document.body.dataset.authResolved==="true"&&window.__hocCungBeParentPinFeedbackTests?.pending!==true')
 c.evaluate('window.fixtureChild={id:"visualChild",name:"Bé An",avatar:"🧒"};HocCungBeChildren={...HocCungBeChildren,getActiveChild:()=>fixtureChild,getActiveChildId:()=>fixtureChild.id};window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:{uid:"visual-parent",email:"fixture@example.com"}}}));HocCungBeParentPin.openParentGate();document.querySelector("#parent-pin-new").value="4321";document.querySelector("#parent-pin-confirm").value="4321";document.querySelector("#parent-pin-form").requestSubmit()');wait('!document.querySelector("#parent-dashboard-screen").hidden')
 c.evaluate('window.prompt=()=>"4321";document.querySelector("#farm-parent-password").value="VisualGarden2026";document.querySelector("#farm-parent-confirm").value="VisualGarden2026";document.querySelector("#farm-parent-form").requestSubmit()');wait('document.querySelector("#farm-parent-status").textContent.includes("Đã lưu")')
 def capture_node(selector,name):
  clip=c.evaluate('(()=>{const n=document.querySelector('+json.dumps(selector)+');n.scrollIntoView({block:"start",behavior:"instant"});const r=n.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()')
  (root/name).write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png','captureBeyondViewport':True,'clip':clip})['data']))
 for width,height in [(375,812),(768,1024),(1280,900)]:
  c.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':width==375});c.evaluate('HocCungBeParentPin.showParentDashboard()');capture_node('#farm-parent-controls',f'__v46_controls_panel_{width}.png');check(f'{width} controls panel rendered',c.evaluate('document.querySelector("#farm-parent-controls").getBoundingClientRect().width<=innerWidth'))
  click('.brand');click('[data-go="farm"]');capture_node('.farm-lock-panel',f'__v46_password_panel_{width}.png');check(f'{width} password panel rendered',c.evaluate('document.querySelector(".farm-lock-panel").getBoundingClientRect().width<=innerWidth'))
 c.evaluate('document.querySelector("#farm-access-password").value="VisualGarden2026";document.querySelector("#farm-access-form").requestSubmit()');wait('!!document.querySelector(".farm-time-meter")');capture_node('.farm-time-meter','__v46_time_meter.png');check('Countdown rendered after actual password unlock',True);errors=c.evaluate('__farmErrors');c.close()
except Exception as e:errors.append(str(e));traceback.print_exc();check('Runner completed',False)
finally:
 chrome.terminate();server.shutdown()
 report={'suiteCount':1,'totalChecks':len(checks),'failedCount':sum(not x['passed'] for x in checks),'runtimeErrors':errors,'runtimeErrorCount':len(errors),'missingSuites':[],'checks':checks};report['realExitCode']=1 if report['failedCount'] or errors else 0
 (root/'__v46_controls_visual_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in report.items() if k!='checks'}));raise SystemExit(report['realExitCode'])
