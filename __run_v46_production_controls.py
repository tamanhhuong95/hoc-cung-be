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
 c.call('Page.navigate',{'url':'https://tamanhhuong95.github.io/hoc-cung-be/'});wait('document.readyState==="complete"&&!!window.HocCungBeFarmAccess&&document.body.dataset.authResolved==="true"&&window.__hocCungBeParentPinFeedbackTests?.pending!==true')
 def fill(selector,value):c.evaluate('document.querySelector('+json.dumps(selector)+').value='+json.dumps(value))
 def signed(child='childAAA',uid='controls-parent'):
  c.evaluate('window.testChild={id:'+json.dumps(child)+',name:'+json.dumps('Bé '+child)+',avatar:"🧒"};HocCungBeChildren={...HocCungBeChildren,getActiveChild:()=>testChild,getActiveChildId:()=>testChild.id};window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:{uid:'+json.dumps(uid)+',email:"fixture@example.com"}}}));window.prompt=()=>window.fixturePrompt;window.alert=m=>window.fixtureAlert=m;window.fixturePrompt="4321";')
 def enter(password='VuonA_2026!'):
  click('[data-go="farm"]');wait('!!document.querySelector("#farm-access-password")');fill('#farm-access-password',password);click('#farm-access-form button');wait('!!document.querySelector(".living-world")')
 def parent():
  if not c.evaluate('HocCungBeParentPin.isUnlocked()'):
   c.evaluate('HocCungBeParentPin.openParentGate()');fill('#parent-pin-enter','4321');click('#parent-pin-submit');wait('!document.querySelector("#parent-dashboard-screen").hidden')
  else:c.evaluate('HocCungBeParentPin.showParentDashboard()')
  wait('!!document.querySelector("#farm-parent-form")')
 def policy():return js('JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("policy")))')
 def save(minutes=1,password='',confirm=None):
  fill('#farm-parent-minutes',str(minutes));fill('#farm-parent-password',password);fill('#farm-parent-confirm',password if confirm is None else confirm);click('#farm-parent-form button');time.sleep(.2)
 def reload():
  c.call('Page.reload',{'ignoreCache':True});wait('document.readyState==="complete"&&!!window.HocCungBeFarmAccess&&document.body.dataset.authResolved==="true"&&window.__hocCungBeParentPinFeedbackTests?.pending!==true');signed()
 click('[data-go="farm"]');check('Guest cannot bypass farm password setup',c.evaluate('!document.querySelector(".living-world")&&document.querySelector("#farm-access-form").hidden'))
 signed();click('.brand');click('[data-go="farm"]');check('Existing child without password starts locked',c.evaluate('!document.querySelector(".living-world")&&document.querySelector("#farm-lock-title").textContent.includes("mật khẩu")'))
 (root/'__v46_identity_diagnostic.json').write_text(json.dumps(c.evaluate('({identity:HocCungBeLearning.getFarmIdentity(),child:HocCungBeChildren.getActiveChild(),title:document.querySelector("#farm-lock-title").textContent})')),encoding='utf-8')
 check('Blocked farm never mutates inventory',js('localStorage.getItem(HocCungBeFarm.context())===null'))
 check('Direct farm action is blocked before unlock',js('HocCungBeFarm.transaction({type:"care",index:0}).then(()=>false,()=>true)'))
 c.evaluate('HocCungBeParentPin.openParentGate()');fill('#parent-pin-new','4321');fill('#parent-pin-confirm','4321');click('#parent-pin-submit');wait('!document.querySelector("#parent-dashboard-screen").hidden')
 (root/'__v46_parent_diagnostic.json').write_text(json.dumps(c.evaluate('({identity:HocCungBeLearning.getFarmIdentity(),child:HocCungBeChildren.getActiveChild(),context:document.querySelector("[data-farm-parent-child]").textContent,status:document.querySelector("#farm-parent-status").textContent,disabled:document.querySelector("#farm-parent-minutes").disabled})')),encoding='utf-8')
 check('Controls are inside the existing parent dashboard',c.evaluate('!!document.querySelector("#parent-dashboard-screen #farm-parent-controls")'))
 check('Controls identify active child',c.evaluate('document.querySelector("[data-farm-parent-child]").textContent.includes("childAAA")'))
 save(password='');check('Cannot enable farm without its own password',c.evaluate('document.querySelector("#farm-parent-status").textContent.includes("đặt mật khẩu")'))
 save(password='VuonA_2026!',confirm='different');check('Mismatching new passwords rejected',c.evaluate('document.querySelector("#farm-parent-status").textContent.includes("chưa giống")'))
 fill('#farm-parent-minutes','121');check('More than 120 minutes rejected by the form',c.evaluate('!document.querySelector("#farm-parent-minutes").checkValidity()'))
 save(password='VuonA_2026!');wait('document.querySelector("#farm-parent-status").textContent.includes("Đã lưu")')
 check('Policy stored per parent and child',policy()['dailyMinutes']==1 and policy()['password']['algorithm']=='PBKDF2-SHA256')
 check('Farm password never stored as plaintext',c.evaluate('!Object.values(localStorage).some(v=>v.includes("VuonA_2026!"))'))
 check('Farm secret differs from parent PIN record',js('HocCungBeFarmAccessCore.verify("4321",JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("policy"))).password).then(v=>!v)'))
 check('Password fields cleared after saving',c.evaluate('document.querySelector("#farm-parent-password").value===""&&document.querySelector("#farm-parent-confirm").value===""'))
 old=policy();c.evaluate('fixturePrompt=null');save(minutes=2);check('Canceled parent PIN cannot change policy',policy()==old)
 c.evaluate('fixturePrompt="9999"');save(minutes=2);check('Incorrect parent PIN cannot change policy',policy()==old)
 c.evaluate('fixturePrompt="4321"');save(minutes=1);check('Blank new password retains existing hash',policy()['password']==old['password'])
 click('.brand');click('[data-go="farm"]');fill('#farm-access-password','wrong1');click('#farm-access-form button');wait('document.querySelector("#farm-access-status").textContent.includes("chưa đúng")');check('Wrong farm password leaves scene locked',c.evaluate('!document.querySelector(".living-world")'))
 for _ in range(4):
  fill('#farm-access-password','wrong1');click('#farm-access-form button')
 check('Five wrong passwords trigger cooldown',js('JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("attempts"))).lockedUntil>Date.now()'))
 fill('#farm-access-password','VuonA_2026!');click('#farm-access-form button');check('Correct password cannot bypass cooldown',c.evaluate('!document.querySelector(".living-world")&&document.querySelector("#farm-access-status").textContent.includes("giây")'))
 reload();click('[data-go="farm"]');fill('#farm-access-password','VuonA_2026!');click('#farm-access-form button');check('Cooldown survives reload',c.evaluate('!document.querySelector(".living-world")'))
 # The clock/records below belong only to this disposable browser fixture.
 c.evaluate('localStorage.setItem(HocCungBeFarmAccess.key("attempts"),JSON.stringify({count:0,lockedUntil:0}))');fill('#farm-access-password','VuonA_2026!');click('#farm-access-form button');wait('!!document.querySelector(".living-world")')
 check('Correct password opens the real farm',c.evaluate('!!document.querySelector(".living-world")'))
 wait('!!document.querySelector(".farm-time-meter")');check('Separate play countdown is visible',c.evaluate('document.querySelector(".farm-time-meter").textContent.includes("Thời gian chơi")'))
 check('Usage reserved durably before play',js('JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("usage"))).usedMs>=1000'))
 check('Play session holds a browser lock',js('navigator.locks.request(HocCungBeFarmAccess.key("play-lock"),{ifAvailable:true},lock=>lock===null)'))
 c.evaluate('window.learningBefore=JSON.stringify(Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.includes("progress"))));window.farmSentinel="keep";localStorage.setItem("farm-controls-sentinel",farmSentinel)')
 click('[data-farm-plot="0"]');check('Authorized care still persists',js('HocCungBeFarm.read(HocCungBeFarm.context()).items[0].care===1'))
 check('Farm time does not become lesson study time',c.evaluate('learningBefore===JSON.stringify(Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.includes("progress"))))'))
 used=js('JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("usage"))).usedMs');click('.brand');click('[data-go="farm"]');check('Every reentry asks for password again',c.evaluate('!document.querySelector(".living-world")&&!document.querySelector("#farm-access-form").hidden'))
 check('Leaving does not reset daily use',js('JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("usage"))).usedMs')>=used)
 fill('#farm-access-password','VuonA_2026!');click('#farm-access-form button');wait('!!document.querySelector(".living-world")');reload();click('[data-go="farm"]');check('Reload requires password again',c.evaluate('!document.querySelector(".living-world")'))
 check('Daily usage survives reload',js('JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("usage"))).usedMs')>=used)
 fill('#farm-access-password','VuonA_2026!');click('#farm-access-form button');wait('!!document.querySelector(".living-world")')
 c.evaluate('window.farmBeforeExpiry=JSON.stringify(HocCungBeFarm.read(HocCungBeFarm.context()));window.realPerformanceNow=performance.now.bind(performance);window.fixtureClockOffset=61000;performance.now=()=>realPerformanceNow()+fixtureClockOffset')
 wait('!document.querySelector(".living-world")');check('Time limit closes an active farm',c.evaluate('document.querySelector("#farm-lock-title").textContent.includes("Hết giờ")'))
 check('Expiry preserves inventory and wallet',js('JSON.stringify(HocCungBeFarm.read(HocCungBeFarm.context()))===farmBeforeExpiry'))
 check('Stale action after expiry is denied',js('HocCungBeFarm.transaction({type:"buy",id:"daisy"}).then(()=>false,()=>true)'))
 click('.brand');click('[data-go="farm"]');check('Reentry cannot reset exhausted quota',c.evaluate('document.querySelector("#farm-access-form").hidden'))
 reload();click('[data-go="farm"]');check('Reload cannot reset exhausted quota',c.evaluate('document.querySelector("#farm-access-form").hidden'))
 parent();c.evaluate('document.querySelector("#farm-parent-enabled").checked=false');save();check('Parent can disable the farm',policy()['enabled']==False)
 click('.brand');click('[data-go="farm"]');check('Disabled farm has no password bypass',c.evaluate('document.querySelector("#farm-access-form").hidden&&!document.querySelector(".living-world")'))
 click('.brand');click('[data-garden-subject="math"]');check('Disabling farm leaves lessons available',c.evaluate('!document.querySelector("#math-screen").hidden'))
 parent();c.evaluate('document.querySelector("#farm-parent-enabled").checked=true');save(password='NewGarden2026');check('Parent can replace a forgotten farm password',js('HocCungBeFarmAccessCore.verify("NewGarden2026",JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("policy"))).password)'))
 check('Password reset does not reset used time',js('JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("usage"))).usedMs>=60000'))
 # Give the fixture a fresh remaining minute for isolation, visibility and concurrent-window checks.
 c.evaluate('localStorage.setItem(HocCungBeFarmAccess.key("usage"),JSON.stringify({version:1,day:HocCungBeFarmAccessCore.dayKey(),usedMs:0}))');click('.brand');enter('NewGarden2026')
 c.evaluate('window.dispatchEvent(new CustomEvent("hoc-cung-be:child-will-change"));testChild={id:"childBBB",name:"Bé B",avatar:"🧒"};window.dispatchEvent(new CustomEvent("hoc-cung-be:child-changed"))');click('[data-go="farm"]');wait('!!document.querySelector("#farm-lock-title")')
 check('Switching child revokes the current farm unlock',c.evaluate('!document.querySelector(".living-world")'))
 check('Second child does not inherit farm policy',js('localStorage.getItem(HocCungBeFarmAccess.key("policy"))===null'))
 signed();click('.brand');enter('NewGarden2026');signed(uid='other-parent');check('Switching account revokes farm unlock',c.evaluate('!document.querySelector(".living-world")'))
 check('Same child name in other UID cannot inherit password',js('localStorage.getItem(HocCungBeFarmAccess.key("policy"))===null'))
 signed();click('.brand');enter('NewGarden2026');c.evaluate('window.fixtureHidden=false;Object.defineProperty(document,"hidden",{configurable:true,get:()=>fixtureHidden});fixtureHidden=true;document.dispatchEvent(new Event("visibilitychange"))');check('Hidden tab revokes play session',c.evaluate('!document.querySelector(".living-world")'))
 hidden_used=js('JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("usage"))).usedMs');time.sleep(1.2);check('Hidden farm is not charged as play',js('JSON.parse(localStorage.getItem(HocCungBeFarmAccess.key("usage"))).usedMs')==hidden_used)
 c.evaluate('fixtureHidden=false;document.dispatchEvent(new Event("visibilitychange"))');check('Returning to tab asks for password',c.evaluate('!!document.querySelector("#farm-access-password")&&!document.querySelector(".living-world")'))
 fill('#farm-access-password','NewGarden2026');click('#farm-access-form button');wait('!!document.querySelector(".living-world")')
 # Emulate two visible windows: retain normal document.hidden=false in each test page.
 new_id=c.call('Target.createTarget',{'url':'about:blank','background':True})['targetId'];second=next(p for p in r.requests.get('http://127.0.0.1:9358/json').json() if p.get('id')==new_id);c2=r.Cdp(second['webSocketDebuggerUrl']);c2.call('Page.enable');c2.call('Runtime.enable');c2.call('Page.navigate',{'url':'https://tamanhhuong95.github.io/hoc-cung-be/'})
 for _ in range(80):
  if c2.evaluate('document.readyState==="complete"&&!!window.HocCungBeFarmAccess&&document.body.dataset.authResolved==="true"&&window.__hocCungBeParentPinFeedbackTests?.pending!==true'):break
  time.sleep(.25)
 c2.evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:()=>false});window.testChild={id:"childAAA",name:"Bé A",avatar:"🧒"};HocCungBeChildren={...HocCungBeChildren,getActiveChild:()=>testChild,getActiveChildId:()=>testChild.id};window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:{uid:"controls-parent",email:"fixture@example.com"}}}));document.querySelector("[data-go=farm]").click();document.querySelector("#farm-access-password").value="NewGarden2026";document.querySelector("#farm-access-form").requestSubmit()');time.sleep(.5)
 check('Second window cannot acquire the same play session',c2.evaluate('!document.querySelector(".living-world")&&document.querySelector("#farm-access-status").textContent.includes("thẻ khác")'))
 c2.evaluate('const k=HocCungBeFarmAccess.key("policy"),p=JSON.parse(localStorage.getItem(k));p.enabled=false;p.revision++;localStorage.setItem(k,JSON.stringify(p))');wait('!document.querySelector(".living-world")');check('Parent policy change in another window locks active play',c.evaluate('document.querySelector("#farm-access-form").hidden'))
 c2.close();c.call('Target.closeTarget',{'targetId':new_id});parent()
 c.evaluate('window.oldPolicy=localStorage.getItem(HocCungBeFarmAccess.key("policy"));window.realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException("test quota","QuotaExceededError")}');save();check('Failed settings save never claims success',c.evaluate('!document.querySelector("#farm-parent-status").textContent.includes("Đã lưu")'))
 check('Failed settings save preserves old policy',c.evaluate('localStorage.getItem(HocCungBeFarmAccess.key("policy"))===oldPolicy'));c.evaluate('Storage.prototype.setItem=realSet')
 c.evaluate('document.querySelector("#farm-parent-enabled").checked=true');save();click('.brand');enter('NewGarden2026')
 c.evaluate('window.farmBeforeStorageFailure=localStorage.getItem(HocCungBeFarm.context());Storage.prototype.setItem=function(){throw new DOMException("test quota","QuotaExceededError")}')
 wait('!document.querySelector(".living-world")');check('Cannot continue playing if time reservation cannot be saved',c.evaluate('!!document.querySelector("#farm-lock-title")'))
 check('Usage save failure preserves existing farm data',c.evaluate('localStorage.getItem(HocCungBeFarm.context())===farmBeforeStorageFailure'));c.evaluate('Storage.prototype.setItem=realSet')
 for width,height in [(375,812),(768,1024),(1280,900)]:
  c.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':width==375});parent();check(f'{width} parent controls no overflow',c.evaluate('document.documentElement.scrollWidth<=innerWidth'));screenshot(f'__v46_production_controls_parent_{width}.png');click('.brand');click('[data-go="farm"]');check(f'{width} password gate no overflow',c.evaluate('document.documentElement.scrollWidth<=innerWidth'));screenshot(f'__v46_production_controls_gate_{width}.png')
 check('V46 caches all three new control assets',js('(async()=>{await navigator.serviceWorker.ready;const cache=await caches.open("hoc-cung-be-v46");return (await Promise.all(["farm-access-core.js","farm-access.js","farm-access.css"].map(f=>cache.match("./"+f)))).every(Boolean)})()'))
 check('Old preview no longer hosts an unprotected playable farm',js('fetch("https://tamanhhuong95.github.io/hoc-cung-be/__living-farm-preview.html").then(async r=>r.status===404||(r.ok&&(await r.text()).includes("location.replace")))'))
 check('No online runtime errors',c.evaluate('__farmErrors.length===0'));errors+=c.evaluate('__farmErrors')
 c.call('Network.emulateNetworkConditions',{'offline':True,'latency':0,'downloadThroughput':0,'uploadThroughput':0});reload();click('[data-go="farm"]');check('Password still required after offline reload',c.evaluate('!document.querySelector(".living-world")'))
 fill('#farm-access-password','NewGarden2026');click('#farm-access-form button');wait('!!document.querySelector(".living-world")');check('Correct password opens farm offline',True);wait('!!document.querySelector(".farm-time-meter")');check('Daily play limit works offline',c.evaluate('!!document.querySelector(".farm-time-meter b")'))
 check('Unrelated local data preserved',c.evaluate('localStorage.getItem("farm-controls-sentinel")==="keep"'));check('No offline runtime errors',c.evaluate('__farmErrors.length===0'));errors+=c.evaluate('__farmErrors');c.close()

except Exception as e:errors.append(str(e));traceback.print_exc();check('Runner completed',False)
finally:
 chrome.terminate();server.shutdown()
 report={'suiteCount':1,'totalChecks':len(checks),'failedCount':sum(not x['passed'] for x in checks),'runtimeErrors':errors,'runtimeErrorCount':len(errors),'missingSuites':[],'checks':checks};report['realExitCode']=1 if report['failedCount'] or errors else 0
 (root/'__v46_production_controls_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in report.items() if k!='checks'}));raise SystemExit(report['realExitCode'])
