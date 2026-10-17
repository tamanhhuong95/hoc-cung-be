"use strict";
(() => {
  const screen=document.querySelector('#art-screen');let data=window.HocCungBeArtData;const gradeOneData=data;
  if(!screen||!data)return;
  const $=s=>screen.querySelector(s);
  let current=null,step=-1,uid=null,group='all',showGuide=true;
  const zoom=$('#art-zoom-dialog');
  $('#art-step-picture').before($('.art-visual-tools'));
  function text(tag,value,className=''){const node=document.createElement(tag);node.textContent=value;node.className=className;return node;}
  function picture(lesson,index){
    const node=document.createElement('div');node.className='art-diagram';
    // Only first-party static diagram markup from the bundled curriculum is inserted.
    node.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 230" role="img" aria-label="${lesson.title} — ${index<0?'sản phẩm gợi ý':'bước '+(index+1)}"><rect x="0" y="0" width="300" height="230" rx="20" fill="#fffaf3"/>${lesson.steps[index<0?lesson.steps.length-1:index].diagram}</svg>`;
    return node;
  }
  function svg(markup,label){
    const node=document.createElement('div');node.className='art-diagram';
    node.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 230" role="img" aria-label="${label}"><rect width="300" height="230" rx="20" fill="#fffaf3"/>${markup}</svg>`;return node;
  }
  function instruction(){
    if(step<0)return picture(current,-1);
    const item=current.steps[step],wrap=document.createElement('div');wrap.className='art-compare';
    const before=document.createElement('figure'),after=document.createElement('figure');
    before.append(text('figcaption','1. Trước khi làm'),svg(showGuide?item.actionDiagram:item.before,`${current.title}: trước bước ${step+1}`));
    after.append(text('figcaption','2. Sau khi làm'),svg(item.diagram,`${current.title}: kết quả bước ${step+1}`));
    wrap.append(before,after);return wrap;
  }
  function closeZoom(){if(zoom.open)zoom.close();$('#art-zoom-content').replaceChildren();}
  function renderCards(){
    $('#art-cards').replaceChildren();
    data.lessons.filter(l=>group==='all'||l.group===group).forEach(l=>{
      const b=document.createElement('button');b.type='button';b.className=`art-card art-card--${l.group}`;b.dataset.artLesson=l.id;
      b.append(picture(l,-1),text('small',`${data.groups.find(g=>g.id===l.group).label} · ${l.steps.length} bước`),text('strong',l.title),text('span',l.goal),text('em',l.difficulty),text('b','Cùng làm nhé →'));
      b.addEventListener('click',()=>open(l.id));$('#art-cards').append(b);
    });
    screen.querySelectorAll('[data-art-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.artFilter===group)));
    $('#art-count').textContent=`${$('#art-cards').children.length} bài thực hành`;
  }
  function reset(){closeZoom();current=null;step=-1;$('#art-library').hidden=false;$('#art-lesson').hidden=true;$('#art-step-picture').replaceChildren();$('#art-checks').replaceChildren();$('#art-result').hidden=true;}
  function open(id){
    const found=data.lessons.find(l=>l.id===id);
    if(screen.hidden||!found)return false;
    closeZoom();current=found;step=-1;showGuide=true;$('#art-library').hidden=true;$('#art-lesson').hidden=false;
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
    $('#art-step-picture').replaceChildren(instruction());
    $('#art-step-hint').textContent=preparing?(current.group==='fold'?'Mặt có màu và mặt sau được vẽ khác nhau. Đặt giấy theo hình trước khi làm.':'Nhìn sản phẩm gợi ý. Con có thể chọn màu khác.'): `💡 ${current.steps[step].hint}`;
    $('#art-step-check').textContent=preparing?'':`✓ Con nhìn lại: ${current.steps[step].check}`;
    $('#art-step-check').hidden=preparing;$('#art-legend').hidden=preparing||current.group!=='fold';
    $('#art-guide-toggle').hidden=preparing||current.group!=='fold'||!current.steps[step]?.actionDiagram.includes('fold-direction');
    $('#art-guide-toggle').textContent=showGuide?'Ẩn mũi tên gợi ý':'Hiện mũi tên gợi ý';$('#art-guide-toggle').setAttribute('aria-pressed',String(showGuide));
    const select=$('#art-step-select');select.replaceChildren(...current.steps.map((s,i)=>{const option=document.createElement('option');option.value=i;option.textContent=`Bước ${i+1}: ${s.text}`;return option;}));select.disabled=preparing;select.value=String(Math.max(0,step));
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
  $('#art-guide-toggle').addEventListener('click',()=>{if(current&&step>=0&&!screen.hidden){showGuide=!showGuide;$('#art-step-picture').replaceChildren(instruction());$('#art-guide-toggle').textContent=showGuide?'Ẩn mũi tên gợi ý':'Hiện mũi tên gợi ý';$('#art-guide-toggle').setAttribute('aria-pressed',String(showGuide));}});
  $('#art-zoom-open').addEventListener('click',()=>{if(!current||screen.hidden)return;$('#art-zoom-content').replaceChildren(instruction());$('#art-zoom-title').textContent=step<0?'Sản phẩm gợi ý':`Bước ${step+1}: ${current.steps[step].text}`;zoom.showModal();$('#art-zoom-close').focus();});
  $('#art-zoom-close').addEventListener('click',closeZoom);
  $('#art-step-select').addEventListener('change',()=>{const value=Number($('#art-step-select').value);if(!screen.hidden&&current&&step>=0&&Number.isInteger(value)&&value>=0&&value<current.steps.length&&window.HocCungBeLearning?.canStartThinkingGame?.()!==false){closeZoom();step=value;renderStep();$('#art-step-text').focus();}else if(current)$('#art-step-select').value=String(Math.max(0,step));});
  $('#art-step-next').addEventListener('click',advance);
  $('#art-step-back').addEventListener('click',()=>{if(!screen.hidden&&current&&step>=0){step--;renderStep();$('#art-step-text').focus();}});
  $('#art-replay').addEventListener('click',()=>{if(current)open(current.id);});
  screen.querySelectorAll('[data-art-home]').forEach(b=>b.addEventListener('click',()=>{reset();$('#art-title').focus();}));
  screen.querySelectorAll('[data-art-filter]').forEach(b=>b.addEventListener('click',()=>{group=b.dataset.artFilter;renderCards();}));
  ['hoc-cung-be:screen-changed','hoc-cung-be:child-will-change','hoc-cung-be:child-changed'].forEach(name=>window.addEventListener(name,()=>{reset();group='all';renderCards();}));
  window.addEventListener('hoc-cung-be:auth-state',e=>{const next=e.detail?.user?.uid||null;if(next!==uid)reset();uid=next;});
  data.sources.forEach(s=>{const li=document.createElement('li'),a=text('a',s.title);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';li.append(a,text('p',s.scope));$('#art-sources').append(li);});
  function setGrade(grade){
    const next=grade==="grade-2"?window.HOC_CUNG_BE_ART_GRADE2:gradeOneData;if(!next)return false;reset();data=next;group="all";renderCards();
    const two=data.grade==="grade-2";$('#art-title').textContent=two?"Xưởng sáng tạo lớp 2":"Xưởng sắc màu của bé";
    screen.querySelector('.page-intro .eyebrow').textContent=two?"🎨 Mỹ thuật lớp 2":"🎨 Mỹ thuật lớp 1";
    screen.querySelector('.page-intro .back-button').dataset.go=two?"grade2":"grade1";screen.querySelector('.page-intro .back-button').textContent=two?"← Về lớp 2":"← Về lớp 1";
    $('#art-sources').replaceChildren();data.sources.forEach(s=>{const li=document.createElement("li"),a=text("a",s.title);a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";li.append(a,text("p",s.scope));$('#art-sources').append(li);});return true;
  }
  document.addEventListener('click',event=>{const button=event.target.closest('button[data-go="art"]');if(button)setGrade(button.dataset.artGrade||"grade-1");},true);
  reset();renderCards();
  window.HocCungBeArtStudio={open,reset,advance,setGrade,getGrade:()=>data.grade||"grade-1",getSummary:()=>current?{lessonId:current.id,step,finished:!$('#art-result').hidden}:null};
})();
