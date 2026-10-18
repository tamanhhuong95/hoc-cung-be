"use strict";
// Presentation only. No progress, account, scoring, curriculum or storage mutations.
(()=>{
 const learning=window.HocCungBeLearning;
 let grade="1";
 function renderGrade(next){
  if(!/^[1-5]$/.test(String(next)))return;
  grade=String(next);
  const heading=document.querySelector('#garden-home-subject-title');
  if(heading)heading.textContent=`Môn học lớp ${grade}`;
  document.querySelectorAll('[data-garden-subject]').forEach(button=>{
   const subject=button.dataset.gardenSubject;
   if(subject==='art')button.dataset.artGrade=`grade-${grade}`;
   else button.dataset.course=`${subject}-grade-${grade}`;
   const label=button.querySelector('strong');
   if(label)label.textContent=`${({math:'Toán',vietnamese:'Tiếng Việt',english:'Tiếng Anh',art:'Mỹ thuật'})[subject]} lớp ${grade}`;
  });
  document.querySelectorAll('#grade-choices [data-go]').forEach(button=>button.setAttribute('aria-current',String(button.dataset.go===`grade${grade}`)));
  const nav=document.querySelector('[data-garden-nav="learn"]');if(nav)nav.dataset.go=`grade${grade}`;
 }
 window.addEventListener('hoc-cung-be:course-changed',event=>renderGrade(learning.COURSES[event.detail?.courseId]?.grade?.split('-').at(-1)));
 window.addEventListener('hoc-cung-be:screen-changed',event=>{
  const name=event.detail?.name||'';if(/^grade[1-5]$/.test(name))renderGrade(name.slice(-1));
  const active=name==='home'?'home':(name==='thinking-games'||name==='farm')?'games':/parent|account|child/.test(name)?'parent':'learn';
  document.querySelectorAll('[data-garden-nav]').forEach(button=>{if(button.dataset.gardenNav===active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
 });
 document.querySelector('[data-garden-nav="parent"]')?.addEventListener('click',()=>document.querySelector(document.body.dataset.authenticated==='true'?'#parent-entry-button':'#home-login-button')?.click());
 renderGrade(learning?.COURSES[learning.getActiveCourseId()]?.grade?.split('-').at(-1)||'1');
 window.HocCungBeGardenUi={getGrade:()=>grade};
})();
