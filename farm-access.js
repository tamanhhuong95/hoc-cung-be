"use strict";
// Device-local farm controls. Never included in child settings sync or learning progress.
(() => {
  const C = window.HocCungBeFarmAccessCore;
  const L = window.HocCungBeLearning;
  const PREFIX = "hoc-cung-be:farm-access:v1:";
  let entry = null, session = null, timer = null, generation = 0;
  const identity = () => L.getFarmIdentity();
  const context = () => C.identityKey(identity());
  const key = (part, who = context()) => who ? PREFIX + who + ":" + part : null;
  const get = name => { if (!name) throw Error("Phụ huynh hãy chọn hồ sơ bé trước nhé.");try{return localStorage.getItem(name);}catch{throw Error('Chưa đọc được cài đặt trên thiết bị. Nông trại vẫn khóa để giữ giới hạn chơi.');} };
  const put = (name, value) => { if (!name) throw Error("Chưa có hồ sơ bé.");try{localStorage.setItem(name, JSON.stringify(value));}catch{throw Error('Chưa lưu được trên thiết bị. Nông trại vẫn khóa; dữ liệu cũ được giữ nguyên.');} };
  const settings = who => C.policy(get(key("policy", who)));
  const usage = who => C.ledger(get(key("usage", who)));
  const visible = () => !!entry && !entry.root.hidden && !document.hidden;
  const timeText = ms => { const seconds = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,"0")}`; };
  function attempts(who) {
    const raw = get(key("attempts", who)); if (raw === null) return { count: 0, lockedUntil: 0 };
    let value; try { value = JSON.parse(raw); } catch { throw Error("Chưa đọc được khóa mật khẩu. Nhờ phụ huynh kiểm tra."); }
    if (!value || !Number.isInteger(value.count) || value.count < 0 || value.count > 4 || !Number.isSafeInteger(value.lockedUntil) || value.lockedUntil < 0) throw Error("Chưa đọc được khóa mật khẩu. Nhờ phụ huynh kiểm tra.");
    return value;
  }
  function stopSession() {
    clearInterval(timer); timer = null;
    if (session) {
      const old=session;
      try {const saved=usage(old.who);if(saved.day===old.day){const target=Math.min(old.budget,Math.ceil(Math.max(0,performance.now()-old.started)/1000)*1000),delta=Math.max(0,target-old.charged);if(delta)put(key('usage',old.who),C.reserve(saved,delta));}}catch{/* Never overwrite unreadable usage while closing. Next entry must persist a new reservation. */}
      session = null; old.release();
    }
  }
  function leave() {
    generation++;
    const old = entry; entry = null;
    stopSession(); old?.stop();
  }
  function lock(message) {
    stopSession(); generation++;
    if (!entry) return;
    entry.stop(); entry.pending = false;
    if (!entry.root.hidden && entry.who === context()) renderLock(message);
    else entry = null;
  }
  function charge() {
    if (!session || !entry || !visible() || context() !== session.who) throw Error("Nông trại đã khóa. Nhập lại mật khẩu để vào vườn nhé.");
    const raw = get(key("policy", session.who));
    if (raw !== session.policyRaw) throw Error("Phụ huynh đã đổi cài đặt. Con mở lại nông trại nhé.");
    const policy = C.policy(raw);
    if (!policy.enabled || !policy.password) throw Error("Phụ huynh chưa cho phép vào nông trại.");
    let saved = usage(session.who);
    if (session.day !== saved.day) { session.day = saved.day; session.started = performance.now(); session.charged = 0; session.budget = C.remaining(policy,saved); }
    const elapsed = Math.max(0, performance.now() - session.started);
    const credit = Math.max(0,session.charged - elapsed);
    if (elapsed >= session.budget || C.remaining(policy,saved) + credit <= 0) throw Error("Hôm nay con đã chơi đủ thời gian phụ huynh cho phép. Hẹn con ngày mai nhé!");
    const target = Math.min(session.budget,Math.ceil(elapsed / 1000) * 1000 + 1000);
    const delta = Math.min(C.remaining(policy,saved),Math.max(0,target-session.charged));
    if (delta) { saved = C.reserve(saved,delta); put(key("usage",session.who),saved); session.charged += delta; }
    return Math.max(0,Math.min(session.budget-elapsed,C.remaining(policy,saved)+Math.max(0,session.charged-elapsed)));
  }
  function assertAllowed() {
    try { return charge(); } catch (error) { lock(error.message); throw error; }
  }
  function paintClock(left) {
    const shell = entry?.root.querySelector(".farm-shell"); if (!shell) return;
    let meter = shell.querySelector(".farm-time-meter");
    if (!meter) { meter=document.createElement("div");meter.className="farm-time-meter";meter.innerHTML='<span>Thời gian chơi hôm nay còn <b></b></span><span>Do phụ huynh cài đặt</span>';shell.querySelector(".farm-header").after(meter); }
    meter.querySelector("b").textContent=timeText(left);meter.classList.toggle("is-low",left<=60000);
  }
  function tick() { try { paintClock(charge()); } catch (error) { lock(error.message); } }
  function renderLock(message = "") {
    if (!entry) return;
    const root=entry.root;
    let policy,remaining=0,problem='';
    try { policy=settings(entry.who);remaining=C.remaining(policy,usage(entry.who)); } catch (error) { problem=error.message; }
    const guest=identity()?.uid==='guest';
    const canEnter=!problem&&!guest&&policy.enabled&&!!policy.password&&remaining>0;
    root.innerHTML='<section class="farm-lock-panel" aria-labelledby="farm-lock-title"><span aria-hidden="true">🔒</span><h1 id="farm-lock-title"></h1><p class="farm-lock-intro"></p><form id="farm-access-form"><label for="farm-access-password">Mật khẩu nông trại<input id="farm-access-password" type="password" minlength="4" maxlength="64" autocomplete="off" required></label><button class="primary-button" type="submit">Vào nông trại</button></form><p id="farm-access-status" role="status" aria-live="polite"></p><button class="farm-lock-back" type="button">← Về trang chủ</button></section>';
    root.querySelector('h1').textContent=problem?'Nông trại đang khóa':guest?'Nhờ phụ huynh mở nông trại':!policy.enabled?'Nông trại đang nghỉ':!policy.password?'Cần đặt mật khẩu nông trại':remaining<=0?'Hết giờ chơi hôm nay':'Mở nông trại của con';
    root.querySelector('.farm-lock-intro').textContent=problem|| (guest?'Phụ huynh đăng nhập, chọn hồ sơ bé và đặt mật khẩu trong “Kiểm soát nông trại” để mở vườn.':!policy.enabled?'Phụ huynh đã tạm tắt nông trại. Con có thể quay lại góc học tập.':!policy.password?'Phụ huynh hãy đặt mật khẩu riêng trong khu vực phụ huynh → Kiểm soát nông trại.':remaining<=0?'Hẹn con ngày mai nhé! Góc học tập vẫn sẵn sàng.':`Con nhập mật khẩu do phụ huynh đặt. Hôm nay còn ${timeText(remaining)} để chơi.`);
    root.querySelector('form').hidden=!canEnter;
    root.querySelector('#farm-access-status').textContent=message;
    root.querySelector('.farm-lock-back').onclick=()=>document.querySelector('.brand')?.click();
    root.querySelector('form').onsubmit=submit;
    if (canEnter) root.querySelector('input').focus({preventScroll:true});
  }
  async function submit(event) {
    event.preventDefault(); if (!entry || entry.pending) return;
    const gate=entry, token=generation, field=gate.root.querySelector('input'), password=field.value;
    field.value='';gate.pending=true;
    const feedback=message=>{ if(entry===gate&&generation===token){gate.pending=false;gate.root.querySelector('#farm-access-status').textContent=message;gate.root.querySelector('button[type=submit]').disabled=false;} };
    gate.root.querySelector('button[type=submit]').disabled=true;
    try {
      if (!navigator.locks) throw Error('Trình duyệt chưa hỗ trợ mở nông trại an toàn. Hãy dùng Chrome hoặc Edge mới.');
      const policyRaw=get(key('policy',gate.who)), policy=C.policy(policyRaw);
      if(identity()?.uid==='guest'||!visible()||context()!==gate.who||!policy.enabled||!policy.password) throw Error('Phụ huynh chưa cho phép vào nông trại.');
      let verified=false;
      await navigator.locks.request(key('password-lock',gate.who),async()=>{
        const state=attempts(gate.who), wait=Math.ceil((state.lockedUntil-Date.now())/1000);
        if(wait>0)throw Error(`Con thử lại sau ${wait} giây nhé.`);
        verified=await C.verify(password,policy.password);
        if(entry!==gate||generation!==token||context()!==gate.who||get(key('policy',gate.who))!==policyRaw)throw Error('Hồ sơ hoặc cài đặt đã thay đổi. Con mở lại nông trại nhé.');
        if(!verified){const count=state.count+1;put(key('attempts',gate.who),{count:count>=5?0:count,lockedUntil:count>=5?Date.now()+30000:0});throw Error(count>=5?'Nhập sai nhiều lần. Con đợi 30 giây rồi thử lại nhé.':'Mật khẩu nông trại chưa đúng.');}
        put(key('attempts',gate.who),{count:0,lockedUntil:0});
      });
      if(!verified)return;
      navigator.locks.request(key('play-lock',gate.who),{ifAvailable:true},async lease=>{
        if(!lease)throw Error('Nông trại đang mở ở thẻ khác. Con đóng thẻ đó trước nhé.');
        if(entry!==gate||generation!==token||!visible()||context()!==gate.who||get(key('policy',gate.who))!==policyRaw)throw Error('Con mở lại nông trại nhé.');
        const saved=usage(gate.who), budget=C.remaining(policy,saved);if(budget<=0)throw Error('Hôm nay đã hết thời gian chơi. Hẹn con ngày mai nhé!');
        let release;const held=new Promise(resolve=>{release=resolve;});
        session={who:gate.who,policyRaw,day:saved.day,started:performance.now(),charged:0,budget,release};
        try { charge();gate.pending=false;gate.unlocked();tick();timer=setInterval(tick,1000);await held; } catch(error){lock(error.message);}
      }).catch(error=>feedback(error.message));
    } catch(error) { feedback(error.message); }
  }
  function enter(root, unlocked, stop) { leave();entry={root,unlocked,stop,who:context(),pending:false};renderLock(); }
  function ensureParent() {
    const dashboard=document.getElementById('parent-dashboard-screen');if(!dashboard)return;
    let section=dashboard.querySelector('#farm-parent-controls');
    if(!section){section=document.createElement('section');section.id='farm-parent-controls';section.className='farm-parent-settings';section.innerHTML='<h2>🌿 Kiểm soát nông trại</h2><p>Đang cài đặt cho: <strong data-farm-parent-child></strong></p><form id="farm-parent-form"><label class="farm-parent-toggle"><span><strong>Cho phép bé chơi nông trại</strong><small> Tắt để khóa nông trại ngay.</small></span><input id="farm-parent-enabled" type="checkbox" role="switch"></label><label>Thời gian chơi tối đa mỗi ngày (phút)<input id="farm-parent-minutes" type="number" min="1" max="120" required><small>Từ 1 đến 120 phút; tính riêng với thời gian học.</small></label><div class="farm-password-row"><label>Mật khẩu nông trại mới<input id="farm-parent-password" type="password" minlength="4" maxlength="64" autocomplete="new-password"><small>4–64 ký tự. Để trống để giữ mật khẩu đang dùng.</small></label><label>Nhập lại mật khẩu mới<input id="farm-parent-confirm" type="password" maxlength="64" autocomplete="new-password"></label></div><p data-farm-parent-usage></p><p class="farm-controls-note">Mỗi lần vào vườn cần nhập mật khẩu nông trại, riêng với PIN phụ huynh. Cài đặt và thời gian chơi áp dụng cho bé này trên trình duyệt hiện tại; chưa đồng bộ sang thiết bị khác. Thời gian chơi được làm tròn lên theo giây. Quên mật khẩu: phụ huynh xác nhận PIN để đặt mật khẩu mới, không xóa tiến độ hoặc cây trong vườn.</p><p id="farm-parent-status" role="status" aria-live="polite"></p><button class="primary-button" type="submit">Lưu kiểm soát nông trại</button></form>';(dashboard.querySelector('#child-settings-section')||dashboard.querySelector('#dashboard-child-context')||dashboard).after(section);if(!dashboard.contains(section))dashboard.append(section);section.querySelector('form').onsubmit=saveParent;}
    const id=identity(),allowed=!!id&&id.uid!=='guest';let policy=C.defaults(),saved=null,error='';
    try { if(allowed){policy=settings(context());saved=usage(context());} } catch(e){error=e.message;}
    section.querySelector('[data-farm-parent-child]').textContent=allowed?id.name:'Chưa chọn hồ sơ bé';
    section.querySelector('#farm-parent-enabled').checked=policy.enabled;section.querySelector('#farm-parent-minutes').value=policy.dailyMinutes;
    section.querySelector('#farm-parent-password').value='';section.querySelector('#farm-parent-confirm').value='';
    section.querySelector('[data-farm-parent-usage]').textContent=saved?`Hôm nay đã dùng ${timeText(saved.usedMs)} / ${policy.dailyMinutes} phút. ${policy.password?'Đã có mật khẩu riêng.':'Chưa đặt mật khẩu; nông trại đang khóa.'}`:'';
    section.querySelector('#farm-parent-status').textContent=error||(!allowed?'Phụ huynh đăng nhập và chọn hồ sơ bé để cài đặt.':'');
    section.querySelectorAll('input,button').forEach(control=>control.disabled=!allowed||!!error);
  }
  async function saveParent(event) {
    event.preventDefault();const who=context(),section=event.currentTarget.closest('section'),status=section.querySelector('[role=status]');
    const enabled=section.querySelector('#farm-parent-enabled').checked,minutes=Number(section.querySelector('#farm-parent-minutes').value),password=section.querySelector('#farm-parent-password').value,confirm=section.querySelector('#farm-parent-confirm').value;
    const button=section.querySelector('button[type=submit]');button.disabled=true;
    try {
      if(identity()?.uid==='guest'||!who||document.getElementById('parent-dashboard-screen').hidden)throw Error('Phụ huynh hãy mở khu vực phụ huynh và chọn bé.');
      if(!window.HocCungBeParentPin?.hasPin()||!window.HocCungBeParentPin?.isUnlocked())throw Error('Cần mở khu phụ huynh bằng PIN trước khi đổi cài đặt nông trại.');
      if(!Number.isInteger(minutes)||minutes<1||minutes>120)throw Error('Thời gian chơi cần từ 1 đến 120 phút.');
      if(password!==confirm)throw Error('Hai lần nhập mật khẩu mới chưa giống nhau.');
      const previous=get(key('policy',who)),before=C.policy(previous);
      if(password&&!C.validPassword(password))throw Error('Mật khẩu cần từ 4 đến 64 ký tự, không chỉ có khoảng trắng.');
      if(enabled&&!password&&!before.password)throw Error('Hãy đặt mật khẩu nông trại trước khi cho phép bé chơi.');
      if(!navigator.locks)throw Error('Trình duyệt chưa hỗ trợ lưu cài đặt an toàn.');
      const authorized=await window.HocCungBeParentPin.authorizeChange('cài đặt nông trại');if(!authorized)throw Error('Chưa xác nhận PIN phụ huynh.');
      const hash=password?await C.passwordRecord(password):before.password;
      await navigator.locks.request(key('config-lock',who),()=>{
        if(context()!==who||document.getElementById('parent-dashboard-screen').hidden||get(key('policy',who))!==previous)throw Error('Hồ sơ hoặc cài đặt đã thay đổi. Hãy kiểm tra và lưu lại.');
        put(key('policy',who),{version:1,revision:before.revision+1,enabled,dailyMinutes:minutes,password:hash});
      });
      section.querySelector('#farm-parent-password').value='';section.querySelector('#farm-parent-confirm').value='';
      lock('Phụ huynh đã đổi cài đặt nông trại.');ensureParent();status.textContent='Đã lưu kiểm soát nông trại cho bé trên thiết bị này.';
    } catch(error){status.textContent=error.message;} finally {if(context()===who)button.disabled=false;}
  }
  const farmRoot=document.getElementById('farm-screen');
  new MutationObserver(()=>{if(farmRoot.hidden)leave();}).observe(farmRoot,{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)leave();else if(!farmRoot.hidden&&!entry)window.HocCungBeFarm?.open();});
  window.addEventListener('pagehide',leave);
  for(const event of ['hoc-cung-be:child-will-change','hoc-cung-be:child-changed','hoc-cung-be:auth-state'])window.addEventListener(event,()=>{leave();ensureParent();});
  window.addEventListener('storage',event=>{if(event.key===key('policy')){lock('Phụ huynh đã đổi cài đặt. Con nhập lại mật khẩu nhé.');ensureParent();}else if(event.key===key('usage')&&session)tick();});
  window.addEventListener('hoc-cung-be:parent-dashboard-open',()=>{leave();ensureParent();});
  window.HocCungBeFarmAccess=Object.freeze({enter,leave,assertAllowed,context,key,ensureParent});
})();
