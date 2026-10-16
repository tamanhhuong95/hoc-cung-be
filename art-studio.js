"use strict";
(() => {
  const screen=document.querySelector('#art-screen'), data=window.HocCungBeArtData;
  if(!screen||!data)return;
  const $=s=>screen.querySelector(s);
  let current=null,step=-1,uid=null,group='all';
  function text(tag,value,className=''){const node=document.createElement(tag);node.textContent=value;node.className=className;return node;}
  function picture(lesson,index){
    const node=document.createElement('div');node.className='art-diagram';
    // Only first-party static diagram markup from the bundled curriculum is inserted.
    node.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 230" role="img" aria-label="${lesson.title} — ${index<0?'sản phẩm gợi ý':'bước '+(index+1)}"><rect x="0" y="0" width="300" height="230" rx="20" fill="#fffaf3"/>${lesson.steps[index<0?lesson.steps.length-1:index].diagram}</svg>`;
    return node;
  }
  function renderCards(){
    $('#art-cards').replaceChildren();
    data.lessons.filter(l=>group==='all'||l.group===group).forEach(l=>{
      const b=document.createElement('button');b.type='button';b.className=`art-card art-card--${l.group}`;b.dataset.artLesson=l.id;
      b.append(picture(l,-1),text('small',data.groups.find(g=>g.id===l.group).label),text('strong',l.title),text('span',l.goal),text('b','Cùng làm nhé →'));
      b.addEventListener('click',()=>open(l.id));$('#art-cards').append(b);
    });
    screen.querySelectorAll('[data-art-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.artFilter===group)));
    $('#art-count').textContent=`${$('#art-cards').children.length} bài thực hành`;
  }
  function reset(){current=null;step=-1;$('#art-library').hidden=false;$('#art-lesson').hidden=true;$('#art-step-picture').replaceChildren();$('#art-checks').replaceChildren();$('#art-result').hidden=true;}
  function open(id){
    const found=data.lessons.find(l=>l.id===id);
    if(screen.hidden||!found)return false;
    current=found;step=-1;$('#art-library').hidden=true;$('#art-lesson').hidden=false;
    $('#art-lesson-title').textContent=`${found.icon} ${found.title}`;$('#art-goal').textContent=found.goal;
    $('#art-materials').replaceChildren(...found.materials.map(m=>text('li',m)));
    $('#art-safety').textContent=found.safety;$('#art-reflect').textContent=found.reflect;$('#art-extend').textContent=found.extend;
    $('#art-result').hidden=true;$('#art-checks').replaceChildren();renderStep();$('#art-lesson-title').focus();return true;
  }
  function renderStep(){
    const preparing=step<0;
    $('#art-preparation').hidden=!preparing;
    $('#art-step-label').textContent=preparing?'Chuẩn bị cùng con':`Bước ${step+1} / ${current.steps.length}`;
    $('#art-step-text').textContent=preparing?'Con xem sản phẩm gợi ý, chuẩn bị đồ dùng rồi bắt đầu khi sẵn sàng.':current.steps[step].text;
    $('#art-step-picture').replaceChildren(picture(current,step));
    $('#art-step-next').textContent=preparing?'Đã chuẩn bị, bắt đầu →':step===current.steps.length-1?'Con đã thực hành xong ✓':'Bước tiếp theo →';
    $('#art-step-back').hidden=preparing;$('#art-step-next').hidden=false;
    $('#art-step-progress').max=current.steps.length;$('#art-step-progress').value=step<0?0:step+1;
    $('#art-result').hidden=true;
  }
  function advance(){
    if(screen.hidden||!current||!$('#art-result').hidden)return false;
    if(window.HocCungBeLearning?.canStartThinkingGame?.()===false)return false;
    if(step<current.steps.length-1){step++;renderStep();$('#art-step-text').focus();return true;}
    $('#art-result').hidden=false;$('#art-step-next').hidden=true;$('#art-checks').replaceChildren();
    ['Con đã thử làm theo các bước.','Con có điều muốn kể về sản phẩm.','Con đã cất đồ dùng và dọn bàn.'].forEach(value=>{const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';label.append(input,document.createTextNode(value));$('#art-checks').append(label);});
    $('#art-result-title').focus();return true;
  }
  $('#art-step-next').addEventListener('click',advance);
  $('#art-step-back').addEventListener('click',()=>{if(!screen.hidden&&current&&step>=0){step--;renderStep();$('#art-step-text').focus();}});
  $('#art-replay').addEventListener('click',()=>{if(current)open(current.id);});
  screen.querySelectorAll('[data-art-home]').forEach(b=>b.addEventListener('click',()=>{reset();$('#art-title').focus();}));
  screen.querySelectorAll('[data-art-filter]').forEach(b=>b.addEventListener('click',()=>{group=b.dataset.artFilter;renderCards();}));
  ['hoc-cung-be:screen-changed','hoc-cung-be:child-will-change','hoc-cung-be:child-changed'].forEach(name=>window.addEventListener(name,()=>{reset();group='all';renderCards();}));
  window.addEventListener('hoc-cung-be:auth-state',e=>{const next=e.detail?.user?.uid||null;if(next!==uid)reset();uid=next;});
  data.sources.forEach(s=>{const li=document.createElement('li'),a=text('a',s.title);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';li.append(a,text('p',s.scope));$('#art-sources').append(li);});
  reset();renderCards();
  window.HocCungBeArtStudio={open,reset,advance,getSummary:()=>current?{lessonId:current.id,step,finished:!$('#art-result').hidden}:null};
})();
