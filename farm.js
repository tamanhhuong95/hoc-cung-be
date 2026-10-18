"use strict";
// Farm transactions are local-only and scoped by parent UID + child ID.
// Learning records are read only; no farm data is sent to Firestore.
(()=>{
 const L=window.HocCungBeLearning,C=window.HocCungBeFarmCore,root=document.getElementById('farm-screen');
 const keyOf=identity=>identity?`hoc-cung-be:farm:v1:${encodeURIComponent(identity.uid)}:${encodeURIComponent(identity.childId)}`:null;
 const identity=()=>L.getFarmIdentity();
 const context=()=>keyOf(identity());
 let ui=null,lastDelta={stars:0,gems:0};
 function read(key){const raw=localStorage.getItem(key);if(raw===null)return C.fresh();let s;try{s=JSON.parse(raw);}catch{throw Error('Chưa đọc được dữ liệu nông trại. Nhờ phụ huynh kiểm tra; dữ liệu vẫn được giữ nguyên.');}if(!C.validate(s))throw Error('Dữ liệu nông trại chưa tương thích. Nhờ phụ huynh kiểm tra; dữ liệu vẫn được giữ nguyên.');return s;}
 function snapshots(id){const result={};for(const [courseId,course] of Object.entries(L.COURSES)){const key=id.uid==='guest'?(courseId==='math-grade-1'?'hoc-cung-be:math-grade-1-progress':`hoc-cung-be:progress:guest:${courseId}`):L.courseProgressKey(id.childId,courseId);let raw;try{raw=JSON.parse(localStorage.getItem(key)||'null');}catch{continue;}if(!raw&&id.uid!=='guest'&&courseId==='math-grade-1'){try{raw=JSON.parse(localStorage.getItem(`hoc-cung-be:progress:${id.childId}`)||'null');}catch{continue;}}if(!raw)continue;const p=L.normalizeProgressForCourse(raw,courseId);result[courseId]=Object.fromEntries(course.levels.map(l=>[l.id,p.levels[l.id]]));}return result;}
 async function transaction(action,expected=context()){
  if(!expected)throw Error('Phụ huynh hãy chọn hồ sơ bé trước khi mở nông trại.');
  if(!navigator.locks)throw Error('Trình duyệt này chưa hỗ trợ lưu nông trại an toàn. Hãy mở bằng Chrome hoặc Edge mới.');
  return navigator.locks.request(expected,()=>{
   if(context()!==expected)throw Error('Hồ sơ đã thay đổi. Con mở lại nông trại nhé.');
   if(action)window.HocCungBeFarmAccess.assertAllowed();
   if(action&&L.canStartThinkingGame()===false)throw Error('Đến giờ nghỉ rồi. Nông trại sẽ chờ con nhé.');
   const id=identity(),before=read(expected),next=C.reconcile(before,snapshots(id));
   const result=action?C.transact(next,action):next;
   const a=C.rewards(before.lessons),b=C.rewards(next.lessons);lastDelta={stars:b.stars-a.stars,gems:b.gems-a.gems};
   if(JSON.stringify(result)!==JSON.stringify(before)){if(!action)result.revision++;try{localStorage.setItem(expected,JSON.stringify(result));}catch{throw Error('Chưa lưu được nông trại. Vật phẩm chưa được mua; phần thưởng vẫn được giữ nguyên.');}}
   return result;
  });
 }
 const adapter={context,name:()=>identity()?.name||'bé',demo:false,load:()=>transaction(null),mutate:transaction,learn:()=>document.querySelector('#grade-choices [data-go="grade'+(window.HocCungBeGardenUi?.getGrade()||'1')+'"]')?.click()};
 function hideResult(){document.querySelector('#farm-result-reward')?.remove();}
 function close(){ui?.close();hideResult();ui?.destroy();ui=null;root.replaceChildren();}
 function open(){window.HocCungBeFarmAccess.enter(root,()=>{ui=window.HocCungBeFarmUI.mount(root,adapter);},()=>{ui?.destroy();ui=null;});}
 window.addEventListener('hoc-cung-be:screen-changed',e=>{if(e.detail.name==='farm')open();else window.HocCungBeFarmAccess.leave();});
 for(const name of ['hoc-cung-be:child-will-change','hoc-cung-be:child-changed','hoc-cung-be:auth-state'])window.addEventListener(name,()=>{close();if(!root.hidden)open();});
 window.addEventListener('storage',e=>{if(e.key===context()&&!root.hidden)ui?.refresh();});
 document.addEventListener('click',event=>{if(event.target.closest('#farm-result-reward [data-go="farm"]'))document.querySelector('.farm-entry')?.click();});
 window.addEventListener('hoc-cung-be:quiz-completed',async()=>{
  const expected=context();hideResult();try{await transaction(null,expected);if(expected!==context()||document.querySelector('#result-screen').hidden)return;const box=document.createElement('div');box.id='farm-result-reward';box.className='farm-result-reward';box.setAttribute('role','status');box.textContent=lastDelta.stars||lastDelta.gems?`Nông trại: +${lastDelta.stars} Sao${lastDelta.gems?` · +${lastDelta.gems} Kim cương`:''}.`:'Con đã nhận phần thưởng cho mốc này. Luyện tập giúp con vững vàng hơn!';const b=document.createElement('button');b.className='text-button';b.dataset.go='farm';b.textContent='Thăm nông trại →';box.append(b);document.querySelector('.result-actions').before(box);}catch(e){const box=document.createElement('p');box.id='farm-result-reward';box.className='farm-result-reward';box.textContent='Phần thưởng sẽ được kiểm tra lại khi mở nông trại. '+e.message;if(expected===context())document.querySelector('.result-actions').before(box);}
 });
 document.querySelectorAll('[data-farm-entry-art]').forEach(el=>el.innerHTML=window.HocCungBeFarmArt.icon('sunflower'));
 window.HocCungBeFarm={keyOf,context,read,transaction,snapshots,open};
})();
