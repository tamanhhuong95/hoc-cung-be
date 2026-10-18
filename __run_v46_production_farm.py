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
  if c.evaluate('!!document.querySelector("#farm-access-form")&&!document.querySelector("#farm-access-form").hidden'):
   c.evaluate('document.querySelector("#farm-access-password").value="FarmFixture2026";document.querySelector("#farm-access-form").requestSubmit()');wait('!!document.querySelector(".living-world")')
 def screenshot(name):
  c.evaluate('scrollTo(0,0)');time.sleep(.2);(root/name).write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})['data']))
 c.call('Page.navigate',{'url':'https://tamanhhuong95.github.io/hoc-cung-be/'});wait('document.readyState==="complete"&&!!window.HocCungBeFarm&&document.body.dataset.authResolved==="true"&&window.__hocCungBeParentPinFeedbackTests?.pending!==true');c.evaluate('window.fixtureChild={id:"farmFixtureChild",name:"Bé Test",avatar:"🧒"};HocCungBeChildren={...HocCungBeChildren,getActiveChild:()=>fixtureChild,getActiveChildId:()=>fixtureChild.id};window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:{uid:"farm-fixture-parent",email:"fixture@example.com"}}}));window.farmTestProgressKey=HocCungBeLearning.courseProgressKey(fixtureChild.id,"math-grade-1");localStorage.setItem("farm-test-sentinel","keep")')
 js('(async()=>{const C=HocCungBeFarmAccessCore;const password=await C.passwordRecord("FarmFixture2026");localStorage.setItem(HocCungBeFarmAccess.key("policy"),JSON.stringify({...C.defaults(),password,dailyMinutes:120}))})()')
 click('[data-go="farm"]');wait('!!document.querySelector("[data-farm-stars]")&&!document.querySelector(".farm-error")')
 check('Home real link opens farm',c.evaluate('!document.querySelector("#farm-screen").hidden'));check('New profile has no invented currency',c.evaluate('document.querySelector("[data-farm-stars]").textContent==="0"'))
 click('[data-farm-plot="0"]');check('Physical watering persists',js('HocCungBeFarm.read(HocCungBeFarm.context()).items[0].care===1'))
 click('[data-farm-plot="0"]');check('Watering too early gives waiting guidance',c.evaluate('document.querySelector(".farm-live").textContent.includes("đang lớn")'))
 check('Rejected watering has no success effect',c.evaluate('!document.querySelector(".living-flowers.is-watered")'))
 wait('document.querySelector("[data-growth-stage]").dataset.growthStage==="1"');check('Seed becomes sprout automatically without reloading',True)
 click('[data-farm-tab="shop"]');click('[data-farm-buy="sunflower"]');check('Insufficient wallet disables confirmation',c.evaluate('document.querySelector("[data-farm-confirm]").disabled'));c.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Escape','code':'Escape','windowsVirtualKeyCode':27});c.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Escape','code':'Escape','windowsVirtualKeyCode':27});check('Escape dismisses native dialog',c.evaluate('!document.querySelector("dialog.farm-dialog").open'))
 # Fixture rewards use the same genuine result persistence path, never real user data.
 c.evaluate('window.farmOriginalProgress=localStorage.getItem(farmTestProgressKey);let p=loadProgress();for(const l of HocCungBeLearning.COURSES["math-grade-1"].levels.slice(0,10))p=saveResult(p,l,100,5);saveProgress(p);window.farmSavedProgress=localStorage.getItem(farmTestProgressKey)')
 js('HocCungBeFarm.transaction(null)');check('Ten distinct mastered lessons earn 200 stars and 2 gems',js('(()=>{const w=HocCungBeFarmCore.wallet(HocCungBeFarm.read(HocCungBeFarm.context()));return w.stars===200&&w.gems===2})()'))
 js('HocCungBeFarm.transaction(null)');check('Reopen cannot mint again',js('HocCungBeFarmCore.wallet(HocCungBeFarm.read(HocCungBeFarm.context())).stars===200'));check('Farm does not mutate learning storage',c.evaluate('farmSavedProgress===localStorage.getItem(farmTestProgressKey)'))
 click('.brand');click('[data-go="farm"]');time.sleep(.3);click('[data-farm-tab="shop"]');click('[data-farm-buy="tulip"]');click('[data-farm-confirm]');check('Confirmed purchase adds tulip',js('HocCungBeFarm.read(HocCungBeFarm.context()).items.at(-1).id==="tulip"'));check('Purchase deducts exact price',js('HocCungBeFarmCore.wallet(HocCungBeFarm.read(HocCungBeFarm.context())).stars===165'))
 click('[data-farm-filter="animals"]');check('Seven animal products',c.evaluate('document.querySelectorAll(".farm-product").length===7'));click('[data-farm-buy="pig"]');click('[data-farm-cancel]');check('Cancel has no debit',js('HocCungBeFarmCore.wallet(HocCungBeFarm.read(HocCungBeFarm.context())).stars===165'));click('[data-farm-buy="pig"]');click('[data-farm-confirm]');check('Animal bought',js('HocCungBeFarm.read(HocCungBeFarm.context()).items.at(-1).id==="pig"'))
 click('[data-farm-tab="garden"]');click('[data-farm-plot="2"]');check('Animal care persists',js('HocCungBeFarm.read(HocCungBeFarm.context()).items[2].care===1'));click('[data-farm-buy="expand"]');click('[data-farm-confirm]');check('Expansion adds three plots',c.evaluate('document.querySelector(".living-guidance").textContent.includes("3/9")'));check('Expansion deducts both currencies',js('(()=>{const w=HocCungBeFarmCore.wallet(HocCungBeFarm.read(HocCungBeFarm.context()));return w.stars===30&&w.gems===1})()'))
 # Two queued writes must re-read the balance under the browser's cross-tab lock.
 check('Concurrent purchase cannot overspend',js('(async()=>{const r=await Promise.allSettled([HocCungBeFarm.transaction({type:"buy",id:"daisy"}),HocCungBeFarm.transaction({type:"buy",id:"daisy"})]);return r.filter(x=>x.status==="fulfilled").length===1&&HocCungBeFarmCore.wallet(HocCungBeFarm.read(HocCungBeFarm.context())).stars===10})()'))
 check('Expired identity purchase is rejected',js('HocCungBeFarm.transaction({type:"buy",id:"daisy"},"old-child-key").then(()=>false,()=>true)'))
 c.evaluate('window.originalFarmIdentity=HocCungBeLearning.getFarmIdentity;window.fixtureIdentity={uid:"parent-A",childId:"childAAAA",name:"Bé A"};HocCungBeLearning.getFarmIdentity=()=>fixtureIdentity')
 js('HocCungBeFarm.transaction(null)');check('Child does not inherit another profile wallet',js('HocCungBeFarmCore.wallet(HocCungBeFarm.read(HocCungBeFarm.context())).stars===0'));check('UID is part of farm key',js('HocCungBeFarm.keyOf({uid:"A",childId:"same"})!==HocCungBeFarm.keyOf({uid:"B",childId:"same"})'));check('Child is part of farm key',js('HocCungBeFarm.keyOf({uid:"A",childId:"one"})!==HocCungBeFarm.keyOf({uid:"A",childId:"two"})'))
 c.evaluate('localStorage.setItem(HocCungBeFarm.context(),"broken-json")');check('Corrupt farm refuses overwrite',js('HocCungBeFarm.transaction(null).then(()=>false,()=>localStorage.getItem(HocCungBeFarm.context())==="broken-json")'));c.evaluate('fixtureIdentity={uid:"parent-A",childId:"childBBBB",name:"Bé B"}');js('HocCungBeFarm.transaction(null)');check('Second child independent',js('HocCungBeFarm.read(HocCungBeFarm.context()).items.length===1'));c.evaluate('fixtureIdentity=null');check('No selected child blocked',js('HocCungBeFarm.transaction(null).then(()=>false,()=>true)'));c.evaluate('HocCungBeLearning.getFarmIdentity=originalFarmIdentity')
 # Storage failure must never claim a successful purchase or lose the previous state.
 c.evaluate('window.realSetItem=Storage.prototype.setItem;window.beforeFailure=localStorage.getItem(HocCungBeFarm.context());Storage.prototype.setItem=function(){throw new DOMException("Quota","QuotaExceededError")}')
 check('Storage failure retains old farm',js('HocCungBeFarm.transaction({type:"care",index:0}).then(()=>false,()=>localStorage.getItem(HocCungBeFarm.context())===beforeFailure)'));c.evaluate('Storage.prototype.setItem=realSetItem')
 for width,height in [(375,812),(768,1024),(1280,900)]:
  c.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':width==375});click('.brand');click('[data-go="farm"]');time.sleep(.25)
  for tab in ['garden','shop','rewards']:
   click('[data-farm-tab="'+tab+'"]');check(f'{width} {tab} no horizontal overflow',c.evaluate('document.documentElement.scrollWidth<=innerWidth'));check(f'{width} {tab} touch targets',c.evaluate('[...document.querySelectorAll("#farm-screen button")].filter(b=>b.getBoundingClientRect().width>0).every(b=>b.getBoundingClientRect().height>=44)'));screenshot(f'__v46_farm_{tab}_{width}.png')
 # Existing unfinished quiz must still guard entry into the new branch.
 click('.brand');click('[data-garden-subject="math"]');click('#topic-grid button');click('#level-grid button');c.evaluate('document.querySelector(".farm-entry").click()');check('Farm navigation guarded during unfinished quiz',c.evaluate('!document.querySelector("#quiz-leave-dialog").hidden&&!document.querySelector("#quiz-screen").hidden'));click('#quiz-leave-stay');check('Stay preserves active quiz',c.evaluate('!document.querySelector("#quiz-screen").hidden'));c.evaluate('document.querySelector(".farm-entry").click()');click('#quiz-leave-confirm');check('Confirmed leave enters farm',c.evaluate('!document.querySelector("#farm-screen").hidden'))
 # Real result screen hook, with fixture scores through the existing completion handler.
 click('.brand');click('[data-garden-subject="math"]');click('#topic-grid button');click('#level-grid button');c.evaluate('quiz.score=100;quiz.correct=5;finishQuiz()');time.sleep(.5);check('Result shows reward explanation',c.evaluate('!!document.querySelector("#farm-result-reward")'));click('#farm-result-reward [data-go="farm"]');check('Result CTA opens farm',c.evaluate('!document.querySelector("#farm-screen").hidden'))
 check('PWA V46 cached farm assets',js('(async()=>{await navigator.serviceWorker.ready;const cache=await caches.open("hoc-cung-be-v46");return (await Promise.all(["farm.js","farm-ui.js","farm-art.js","farm-core.js","farm.css","living-farm.js","living-farm.css","assets/farm/living-farm-background.png","assets/farm/animal-walk-atlas.png","assets/farm/plant-atlas.png"].map(f=>cache.match("./"+f)))).every(Boolean)})()'))
 c.evaluate('window.farmBeforeReload=JSON.stringify(HocCungBeFarm.read(HocCungBeFarm.context()));localStorage.setItem("farm-before-reload",farmBeforeReload)');check('No online runtime errors',c.evaluate('__farmErrors.length===0'))
 c.call('Network.emulateNetworkConditions',{'offline':True,'latency':0,'downloadThroughput':0,'uploadThroughput':0});c.call('Page.reload',{'ignoreCache':True});wait('document.readyState==="complete"&&!!window.HocCungBeFarm&&document.body.dataset.authResolved==="true"&&window.__hocCungBeParentPinFeedbackTests?.pending!==true');c.evaluate('window.fixtureChild={id:"farmFixtureChild",name:"Bé Test",avatar:"🧒"};HocCungBeChildren={...HocCungBeChildren,getActiveChild:()=>fixtureChild,getActiveChildId:()=>fixtureChild.id};window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:{uid:"farm-fixture-parent",email:"fixture@example.com"}}}));window.farmTestProgressKey=HocCungBeLearning.courseProgressKey(fixtureChild.id,"math-grade-1");');click('[data-go="farm"]');time.sleep(.3)
 check('Offline farm restored',js('JSON.stringify(HocCungBeFarm.read(HocCungBeFarm.context()))===localStorage.getItem("farm-before-reload")'));click('[data-farm-plot="0"]');check('Offline watering works',c.evaluate('document.querySelector(".farm-live").textContent.includes("tưới")'));click('[data-farm-tab="shop"]');check('Offline shop has flower illustrations',c.evaluate('document.querySelectorAll(".farm-product-art .living-flower-sprite").length===8'));check('Unrelated data preserved',c.evaluate('localStorage.getItem("farm-test-sentinel")==="keep"'));check('No offline runtime errors',c.evaluate('__farmErrors.length===0'));errors=c.evaluate('__farmErrors')
 c.call('Network.emulateNetworkConditions',{'offline':False,'latency':0,'downloadThroughput':-1,'uploadThroughput':-1})
 c.call('Page.navigate',{'url':'https://tamanhhuong95.github.io/hoc-cung-be/'});wait('document.readyState==="complete"&&!!window.HocCungBeFarmAccess&&document.body.dataset.authResolved==="true"&&window.__hocCungBeParentPinFeedbackTests?.pending!==true')
 c.evaluate('window.fixtureChild={id:"farmFixtureChild",name:"Bé Test",avatar:"🧒"};HocCungBeChildren={...HocCungBeChildren,getActiveChild:()=>fixtureChild,getActiveChildId:()=>fixtureChild.id};window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:{uid:"farm-fixture-parent",email:"fixture@example.com"}}}));const C=HocCungBeFarmCore,s=C.fresh();s.expansions=4;s.items=C.catalog.filter(i=>i.category!=="decor").map(i=>({id:i.id,care:3}));for(const l of HocCungBeLearning.COURSES["math-grade-1"].levels.slice(0,100))s.lessons["math-grade-1/"+l.id]=100;localStorage.setItem(HocCungBeFarm.context(),JSON.stringify(s))');click('[data-go="farm"]');wait('!!document.querySelector(".living-animals")');time.sleep(1)
 check('Isolated fixture shows all seven animal species',c.evaluate('document.querySelectorAll(".living-animals").length===7'))
 check('Isolated fixture shows all eight flower species',c.evaluate('document.querySelectorAll(".living-flowers").length===8'))
 check('Background loaded',c.evaluate('document.querySelector(".living-backdrop").naturalWidth>1000'))
 c.call('Page.bringToFront');c.evaluate('document.querySelector(".living-pig").scrollIntoView({block:"center",behavior:"instant"})');c.call('Input.dispatchMouseEvent',{'type':'mouseMoved','x':1,'y':1});time.sleep(.3)
 (root/'__v45_animation_diagnostic.json').write_text(json.dumps(c.evaluate('({hidden:document.hidden,classes:document.querySelector(".living-world").className,animation:getComputedStyle(document.querySelector(".living-pig")).animation,animations:document.getAnimations().map(a=>({state:a.playState,time:a.currentTime}))})')),encoding='utf-8')
 c.evaluate('window.gaitBefore=getComputedStyle(document.querySelector(".living-pig .living-animal-sprite")).backgroundPositionX;window.walkBefore=document.querySelector(".living-pig").getBoundingClientRect().x')
 time.sleep(.4)
 check('Animal gait uses changing atlas frames',c.evaluate('gaitBefore!==getComputedStyle(document.querySelector(".living-pig .living-animal-sprite")).backgroundPositionX'))
 check('Animal walks through pasture',c.evaluate('Math.abs(walkBefore-document.querySelector(".living-pig").getBoundingClientRect().x)>.1'))
 click('[data-living-pause]');c.evaluate('window.pausedX=document.querySelector(".living-pig").getBoundingClientRect().x');time.sleep(.4)
 check('Pause stops animal movement',c.evaluate('Math.abs(pausedX-document.querySelector(".living-pig").getBoundingClientRect().x)<.01'))
 check('Pause stops gait',c.evaluate('getComputedStyle(document.querySelector(".living-pig .living-animal-sprite")).animationPlayState==="paused"'))
 click('[data-living-tool="water"]');click('[data-farm-plot="9"]')
 check('Wrong tool gives guidance without changing care',c.evaluate('document.querySelector(".farm-live").textContent.includes("thức ăn")'))
 click('[data-living-tool="feed"]');click('[data-farm-plot="9"]')
 check('Feeding has visual feedback',c.evaluate('!!document.querySelector(".living-pig.is-eating .feed-piece")'))
 click('[data-living-pause]');c.call('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-motion','value':'reduce'}]})
 wait('document.querySelector(".living-world").classList.contains("is-paused")')
 check('Reduced motion disables gait',c.evaluate('getComputedStyle(document.querySelector(".living-pig .living-animal-sprite")).animationName==="none"'))
 click('[data-living-pause]');check('Explicit play can enable motion with OS reduce preference',c.evaluate('getComputedStyle(document.querySelector(".living-pig .living-animal-sprite")).animationName==="living-steps"'));c.call('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-motion','value':'no-preference'}]});screenshot('__v46_production_living_1280.png')
 c.call('Emulation.setDeviceMetricsOverride',{'width':375,'height':812,'deviceScaleFactor':1,'mobile':True});click('[data-living-pan="pasture"]');time.sleep(.6)
 check('Mobile pasture button pans map',c.evaluate('document.querySelector(".living-viewport").scrollLeft>500'))
 check('Demo mobile has no page overflow',c.evaluate('document.documentElement.scrollWidth<=innerWidth'));screenshot('__v46_production_living_375.png')
 click('.brand');check('Leaving farm removes the scene and revokes access',c.evaluate('!document.querySelector(".living-world")'))
 check('Leaving farm blocks stale care actions',js('HocCungBeFarm.transaction({type:"care",index:0}).then(()=>false,()=>true)'))
 check('Fixture preserves unrelated local data',c.evaluate('localStorage.getItem("farm-test-sentinel")==="keep"'))
 errors+=c.evaluate('__farmErrors');c.close()
except Exception as e:errors.append(str(e));traceback.print_exc();check('Runner completed',False)
finally:
 chrome.terminate();server.shutdown()
 report={'suiteCount':1,'totalChecks':len(checks),'failedCount':sum(not x['passed'] for x in checks),'runtimeErrors':errors,'runtimeErrorCount':len(errors),'missingSuites':[],'checks':checks};report['realExitCode']=1 if report['failedCount'] or errors else 0
 (root/'__v46_production_farm_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in report.items() if k!='checks'}));raise SystemExit(report['realExitCode'])
