"use strict";
// Original introductory practice for Grades 3–5; no textbook passage is reproduced.
(()=>{
  const rotate=(a,n)=>a.slice(n%a.length).concat(a.slice(0,n%a.length));
  const choice=(stem,answer,other,n=0,extra={})=>({type:'choice',prompt:stem,displayText:stem,answer:String(answer),options:rotate([answer,...other].map(String),n),speechText:stem,helper:'Đọc kỹ đề, suy nghĩ rồi chọn đáp án nhé.',tip:'Con hãy xem lại dữ kiện trong đề.',...extra});
  const fmt=n=>String(Math.round(n*1000)/1000).replace('.',',');
  const num=(stem,value,n,unit='',extra={})=>choice(stem,fmt(value)+unit,[1,2,5].map(d=>fmt(value+d)+unit),n,extra);
  const math={
    3:[
      ['Số đến 100.000',(i)=>num(`Số liền sau của ${23456+i*1000} là bao nhiêu?`,23457+i*1000,i)],
      ['Giá trị các chữ số',i=>num(`Số gồm ${i+2} chục nghìn, 3 nghìn, 4 trăm, 5 chục, 6 đơn vị là số nào?`,(i+2)*10000+3456,i)],
      ['Cộng số có nhiều chữ số',i=>num(`${2345+i*111} + ${1234+i*10} = ?`,3579+i*121,i)],
      ['Trừ số có nhiều chữ số',i=>num(`${8000+i*100} − ${2345+i*11} = ?`,5655+i*89,i)],
      ['Nhân với số có một chữ số',i=>num(`${123+i*12} × ${i+3} = ?`,(123+i*12)*(i+3),i)],
      ['Chia cho số có một chữ số',i=>num(`${(i+3)*(125+i)} : ${i+3} = ?`,125+i,i)],
      ['Chia có dư',i=>choice(`${29+i*7} : 7 có thương và số dư nào?`,`${4+i} dư 1`,[`${4+i} dư 2`,`${3+i} dư 1`,`${5+i} dư 1`],i)],
      ['Một phần của một số',i=>num(`1/${i+2} của ${(i+2)*12} là bao nhiêu?`,12,i)],
      ['Chu vi hình chữ nhật',i=>num(`Hình chữ nhật dài ${8+i} cm, rộng 4 cm. Chu vi là bao nhiêu?`,(12+i)*2,i,' cm')],
      ['Diện tích hình vuông',i=>num(`Hình vuông có cạnh ${3+i} cm. Diện tích là bao nhiêu?`,(3+i)**2,i,' cm²')],
      ['Đồng hồ và khoảng thời gian',i=>num(`Bắt đầu lúc 8 giờ ${10+i*5} phút, kết thúc lúc 9 giờ. Khoảng thời gian là bao nhiêu?`,50-i*5,i,' phút')],
      ['Bài toán hai bước',i=>num(`Có 3 hộp, mỗi hộp ${12+i} bút. Tặng 5 bút. Còn bao nhiêu bút?`,3*(12+i)-5,i,' bút')]
    ],
    4:[
      ['Số có nhiều chữ số',i=>num(`Số gồm ${i+2} triệu, 3 trăm nghìn và 5 nghìn là số nào?`,(i+2)*1000000+305000,i)],
      ['Cộng số tự nhiên',i=>num(`${123456+i*1000} + 234567 = ?`,358023+i*1000,i)],
      ['Trừ số tự nhiên',i=>num(`${800000+i*1000} − 234567 = ?`,565433+i*1000,i)],
      ['Nhân với số có hai chữ số',i=>num(`${123+i*10} × ${12+i} = ?`,(123+i*10)*(12+i),i)],
      ['Chia cho số có hai chữ số',i=>num(`${(12+i)*(34+i)} : ${12+i} = ?`,34+i,i)],
      ['Phân số cùng mẫu',i=>choice(`${i+1}/9 + 2/9 = ?`,`${i+3}/9`,[`${i+3}/18`,`${i+2}/9`,`${i+4}/9`],i)],
      ['Trừ phân số cùng mẫu',i=>choice(`8/11 − ${i+1}/11 = ?`,`${7-i}/11`,[`${6-i}/11`,`${7-i}/22`,`${8-i}/11`],i)],
      ['Phân số bằng nhau',i=>choice(`Phân số nào bằng 1/${i+2}?`,`2/${2*(i+2)}`,[`2/${i+2}`,`1/${i+3}`,`3/${2*(i+2)}`],i)],
      ['Tìm số trung bình cộng',i=>num(`Ba ngày đọc lần lượt ${12+i}, ${18+i}, ${24+i} trang. Trung bình mỗi ngày đọc bao nhiêu trang?`,18+i,i,' trang')],
      ['Đổi đơn vị diện tích',i=>num(`${i+2} m² bằng bao nhiêu dm²?`,(i+2)*100,i,' dm²')],
      ['Góc và đường thẳng',i=>[
        choice('Góc vuông có số đo bao nhiêu?','90°',['45°','60°','180°'],i),
        choice('Góc 45° là loại góc nào?','Góc nhọn',['Góc vuông','Góc tù','Góc bẹt'],i),
        choice('Góc 120° là loại góc nào?','Góc tù',['Góc nhọn','Góc vuông','Góc bẹt'],i),
        choice('Hai đường thẳng cùng nằm trong một mặt phẳng và không cắt nhau gọi là gì?','Hai đường thẳng song song',['Hai đường thẳng vuông góc','Hai đường thẳng trùng nhau','Hai đoạn thẳng bằng nhau'],i),
        choice('Hai đường thẳng cắt nhau tạo góc vuông gọi là gì?','Hai đường thẳng vuông góc',['Hai đường thẳng song song','Hai đường tròn','Hai đường thẳng trùng nhau'],i)
      ][i]],
      ['Tổng và hiệu',i=>num(`Hai số có tổng ${30+i*2}, hiệu 6. Số lớn là bao nhiêu?`,18+i,i)]
    ],
    5:[
      ['Đọc và hiểu số thập phân',i=>choice(`Chữ số 5 trong số ${i+2},45 có giá trị nào?`,'0,05',['5','0,5','50'],i)],
      ['Cộng số thập phân',i=>num(`${fmt(12.5+i)} + 3,75 = ?`,16.25+i,i)],
      ['Trừ số thập phân',i=>num(`${fmt(20.5+i)} − 4,25 = ?`,16.25+i,i)],
      ['Nhân số thập phân',i=>num(`${fmt(1.2+i/10)} × 3 = ?`,(1.2+i/10)*3,i)],
      ['Chia số thập phân',i=>num(`${fmt(7.5+i*1.5)} : 1,5 = ?`,5+i,i)],
      ['Tỉ số phần trăm',i=>num(`Lớp có 40 bạn, ${8+i*4} bạn chọn đọc sách. Số bạn chọn đọc sách chiếm bao nhiêu phần trăm?`,20+i*10,i,'%')],
      ['Tìm giá trị phần trăm',i=>num(`25% của ${80+i*20} là bao nhiêu?`,20+i*5,i)],
      ['Diện tích tam giác',i=>num(`Tam giác có đáy ${8+i*2} cm và chiều cao tương ứng 5 cm. Diện tích là bao nhiêu?`,(8+i*2)*5/2,i,' cm²')],
      ['Diện tích hình thang',i=>num(`Hình thang có hai đáy ${10+i} cm và ${6+i} cm, chiều cao 4 cm. Diện tích là bao nhiêu?`,32+i*4,i,' cm²')],
      ['Chu vi hình tròn',i=>num(`Hình tròn có bán kính ${i+2} cm. Lấy π = 3,14. Chu vi là bao nhiêu?`,(i+2)*6.28,i,' cm')],
      ['Thể tích hình hộp chữ nhật',i=>num(`Hình hộp chữ nhật dài ${5+i} cm, rộng 4 cm, cao 3 cm. Thể tích là bao nhiêu?`,(5+i)*12,i,' cm³')],
      ['Quãng đường, vận tốc, thời gian',i=>num(`Xe đi đều với vận tốc ${30+i*5} km/giờ trong 2 giờ. Quãng đường là bao nhiêu?`,(30+i*5)*2,i,' km')]
    ]
  };
  const result={};
  for(const grade of [3,4,5]){
    const topics={},levels=[];
    const topicNames={3:['Số và cấu tạo số','Cộng và trừ','Nhân và chia','Chia và phần của một số','Chu vi và diện tích','Thời gian và vận dụng'],4:['Số lớn và phép cộng','Phép trừ và phép nhân','Phép chia và phân số','Tính chất của phân số','Trung bình và diện tích','Hình học và bài toán'],5:['Thập phân và phép cộng','Thập phân: trừ và nhân','Phép chia và phần trăm','Phần trăm và tam giác','Hình thang và hình tròn','Thể tích và chuyển động']};
    math[grade].forEach(([title,make],i)=>{const id=`M${grade}-${String(i+1).padStart(2,'0')}`,topic=`m${grade}-${Math.floor(i/2)+1}`,topicTitle=topicNames[grade][Math.floor(i/2)];topics[topic]={id:topic,title:topicTitle,shortTitle:topicTitle,icon:['🔢','🧩','➕','📐'][Math.floor(i/2)%4],colorTheme:['blue','green','purple','orange'][Math.floor(i/2)%4],description:'Hai bài, mỗi bài 5 câu hỏi ngắn.',sortOrder:Math.floor(i/2)+1};levels.push({id,title,topic,order:i+1,type:'authored-math',grade:`grade-${grade}`,questionCount:5,unlockScore:80,rewardStars:[60,80,100],pilotQuestions:Array.from({length:5},(_,j)=>({...make(j),key:`${id}-${j+1}`,contentRelease:'v42',contentPilot:true}))});});
    result[grade]={math:{id:`math-grade-${grade}`,name:`Toán lớp ${grade}`,grade:`grade-${grade}`,icon:'🔢',description:grade===3?'Số đến 100.000 • Nhân chia • Hình học':grade===4?'Số tự nhiên • Phân số • Đại lượng':'Thập phân • Phần trăm • Hình và chuyển động',topics,levels}};
  }
  window.HOC_CUNG_BE_UPPER=result;
  window.HocCungBeUpperAuthoring={choice,rotate};
})();
