"use strict";
(() => {
  const data=window.HocCungBeArtData;if(!data)return;
  const P=(points,color='#a9d9ed')=>`<polygon points="${points}" fill="${color}" stroke="#405b78" stroke-width="2.5" stroke-linejoin="round"/>`;
  const R=(x,y,w,h,c='#a9d9ed')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="#405b78" stroke-width="2.5"/>`;
  const C=(x1,y1,x2,y2)=>`<path d="M${x1},${y1}L${x2},${y2}" stroke="#3f6fac" stroke-width="3" stroke-dasharray="6 5" fill="none"/>`;
  const A=(x1,y1,x2,y2)=>{const a=Math.atan2(y2-y1,x2-x1),q=(x,y)=>`${x.toFixed(1)},${y.toFixed(1)}`;return `<g class="fold-direction"><path d="M${x1},${y1}L${x2},${y2}" fill="none" stroke="#ba345f" stroke-width="4"/>${P(`${q(x2,y2)} ${q(x2-12*Math.cos(a-.5),y2-12*Math.sin(a-.5))} ${q(x2-12*Math.cos(a+.5),y2-12*Math.sin(a+.5))}`,'#ba345f')}</g>`;};
  const dot=(x,y,r=5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#ba345f"/>`;
  const square=R(65,30,170,170),diamond=P('150,20 245,115 150,210 55,115'),tri=P('50,55 250,55 150,195');
  const bird=P('150,15 200,115 160,210 150,170 140,210 100,115')+C(150,15,150,170);
  const slim=P('150,15 178,115 160,210 150,170 140,210 122,115')+C(150,15,150,170);
  const kite=P('150,20 205,115 150,210 95,115')+C(150,20,150,210);
  const petal=P('150,15 190,115 150,215 110,115')+C(150,15,150,215);
  const wings=P('150,65 240,155 150,135 60,155')+P('145,125 90,30 120,45 155,100')+P('155,125 220,40 180,125');
  const crane=wings+P('90,30 60,45 102,50','#ffe5bb');
  function makeSteps(start,rows){let before=start;return rows.map(([text,after,guide,hint,check])=>{const result={text,diagram:after,before,actionDiagram:before+(guide||''),hint,check,visual:true};before=after;return result;});}
  function revise(id,start,rows){const lesson=data.lessons.find(l=>l.id===id);lesson.steps=makeSteps(start,rows);lesson.difficulty='Dễ · làm chậm từng bước';}
  const dog=P('80,55 220,55 150,195')+P('80,55 50,115 105,95','#ffe5bb')+P('220,55 250,115 195,95','#ffe5bb');
  revise('ART-05',square,[
    ['Đặt giấy vuông. Chọn mặt màu con thích quay lên.',square,'','Để giấy phẳng trên bàn.','Bốn cạnh giấy dài bằng nhau.'],
    ['Đưa góc dưới bên trái chạm góc trên bên phải.',P('65,30 235,30 235,200'),C(65,30,235,200)+A(75,190,220,45),'Giữ hai góc trùng nhau.','Hai mép giấy khớp nhau.'],
    ['Miết cạnh vừa gấp từ giữa ra hai phía.',P('65,30 235,30 235,200'),C(65,30,235,200),'Giữ góc giấy bằng tay kia.','Nếp gấp nằm phẳng.'],
    ['Xoay tam giác để cạnh dài ở trên, đỉnh ở dưới.',tri,A(220,170,245,100),'Chỉ xoay giấy, chưa gấp.','Giấy giống mái nhà úp xuống.'],
    ['Gấp góc bên trái xuống để làm một tai.',P('80,55 250,55 150,195')+P('80,55 50,115 105,95','#ffe5bb'),C(80,55,105,95)+A(58,60,65,105),'Miết nhẹ nếp gấp tai.','Tai đầu tiên hướng xuống.'],
    ['Gấp góc bên phải xuống để làm tai còn lại.',dog,C(220,55,195,95)+A(242,60,235,105),'So hai tai trước khi miết.','Hai tai ở hai bên mặt.'],
    ['Vẽ hai mắt lên phần giữa khuôn mặt.',dog+dot(128,124)+dot(172,124),'','Con chọn mắt tròn hoặc cong.','Hai mắt nằm dưới cạnh trên.'],
    ['Vẽ mũi, miệng và thêm đốm nếu con muốn.',dog+dot(128,124)+dot(172,124)+P('143,145 157,145 150,153','#405b78'),'','Bây giờ mới dùng bút màu.','Cún giấy có nét riêng của con.']
  ]);
  const accordion=P('55,65 80,155 105,65 130,155 155,65 180,155 205,65 230,155 250,65','#f5bdcf');
  revise('ART-06',R(45,45,210,140),[
    ['Đặt giấy hình chữ nhật nằm ngang trước mặt.',R(45,45,210,140),'','Cạnh dài nằm ngang.','Giấy nằm phẳng trên bàn.'],
    ['Gấp cạnh ngắn bên trái vào một dải rộng bằng ngón tay.',R(45,45,210,140)+R(45,45,20,140,'#ffe5bb'),C(65,45,65,185)+A(48,110,75,110),'Giữ bề rộng dải đều nhau.','Dải đầu chạy hết chiều cao.'],
    ['Lật mặt giấy lại, giữ nguyên dải vừa gấp.',R(45,45,210,140,'#ffe5bb')+R(45,45,20,140),A(220,70,245,120),'Chỉ lật giấy, chưa gấp tiếp.','Mặt sau giấy quay lên.'],
    ['Gấp một dải kế tiếp có bề rộng như dải đầu.',R(45,45,210,140)+R(45,45,40,140,'#f5bdcf'),C(85,45,85,185)+A(65,110,95,110),'Nếp mới ngược nếp trước.','Hai dải rộng gần bằng nhau.'],
    ['Lặp lại: lật giấy, gấp một dải, cho đến hết.',accordion,A(65,110,235,110),'Làm từng nếp, không gấp vội.','Giấy co giãn như đàn xếp.'],
    ['Gom các nếp thành thanh rồi gấp đôi ở giữa.',P('65,95 235,95 235,125 65,125','#f5bdcf')+C(150,95,150,125),C(150,70,150,150)+A(70,110,215,110),'Đưa hai đầu thanh gặp nhau.','Hai nửa thanh dài gần bằng nhau.'],
    ['Dán hai mép bên trong đang áp vào nhau.',P('150,185 85,65 215,65','#f5bdcf')+C(150,65,150,185),C(150,65,150,185),'Dùng một đoạn băng dính giấy.','Mé giữa được giữ chắc.'],
    ['Mở hai bên nếp giấy ra nhẹ nhàng.',P('150,195 35,55 265,55','#f5bdcf')+[70,110,150,190,230].map(x=>C(150,190,x,60)).join(''),A(130,110,55,70)+A(170,110,245,70),'Giữ chân quạt khi mở.','Chiếc quạt xòe đều hai phía.']
  ]);
  const rows=[
    ['Đặt giấy vuông, mặt màu ở trên.',square,'','Chuẩn bị giấy lớn khoảng 20 cm.','Giấy vuông, không bị rách.'],
    ['Gấp chéo một lần rồi mở ra.',square+C(65,30,235,200),C(65,30,235,200)+A(75,185,220,45),'Đưa hai góc đối diện gặp nhau.','Có một đường chéo.'],
    ['Gấp theo đường chéo còn lại rồi mở.',square+C(65,30,235,200)+C(235,30,65,200),C(235,30,65,200)+A(75,45,220,185),'Miết từ giữa ra ngoài.','Hai nếp giao nhau ở tâm.'],
    ['Lật sang mặt sau của tờ giấy.',R(65,30,170,170,'#ffe5bb')+C(65,30,235,200)+C(235,30,65,200),A(220,60,250,120),'Chỉ lật, không xoay góc.','Mặt không màu quay lên.'],
    ['Gấp đôi theo chiều ngang rồi mở.',R(65,30,170,170,'#ffe5bb')+C(65,115,235,115),C(65,115,235,115)+A(150,40,150,185),'Hai cạnh đối diện chạm nhau.','Có nếp ngang qua tâm.'],
    ['Gấp đôi theo chiều dọc rồi mở.',R(65,30,170,170,'#ffe5bb')+C(150,30,150,200)+C(65,115,235,115),C(150,30,150,200)+A(75,110,220,110),'Miết nếp, rồi mở giấy.','Có nếp dọc qua tâm.'],
    ['Xoay giấy thành hình thoi. Đẩy hai góc bên vào trong.',diamond+C(55,115,245,115)+C(150,20,150,210),A(60,115,125,155)+A(240,115,175,155),'Nhờ người lớn giữ nếp giữa.','Hai bên bắt đầu khép lại.'],
    ['Hạ góc trên xuống, ép phẳng thành hình vuông nhiều lớp.',diamond+C(150,20,150,210),A(150,30,150,190),'Miệng mở của các lớp ở dưới.','Có bốn vạt giấy ở góc dưới.'],
    ['Gấp mép trái của lớp trên vào đường giữa.',diamond+P('55,115 150,80 150,210','#ffe5bb'),C(100,65,150,210)+A(65,115,140,125),'Chỉ cầm lớp trên cùng.','Mép trái trùng đường giữa.'],
    ['Gấp mép phải của lớp trên vào đường giữa.',kite,C(200,65,150,210)+A(235,115,160,125),'Không gấp các lớp phía sau.','Hai mép trước gặp ở giữa.'],
    ['Gấp chóp trên xuống, miết nếp rồi mở lại chóp.',kite+C(110,80,190,80),C(110,80,190,80)+A(150,25,150,125),'Nếp ngang giúp mở cánh hoa.','Có nếp ngang phía trên.'],
    ['Mở lại hai vạt vừa gấp ở mặt trước.',diamond+C(110,80,190,80)+C(150,20,150,210),A(140,125,65,115)+A(160,125,235,115),'Giữ các nếp gấp mới.','Trở về hình thoi có nếp.'],
    ['Nâng góc dưới của lớp trên lên qua nếp ngang.',P('150,15 230,115 150,150 70,115','#ffe5bb')+P('150,150 195,195 150,210 105,195'),A(150,200,150,25),'Đây là bước khó: nhờ người lớn.','Lớp trên mở thành một túi.'],
    ['Khép hai mép túi vào giữa và ép phẳng.',petal,A(75,115,140,115)+A(225,115,160,115),'Gấp theo các nếp đã tạo.','Có hình thoi dài ở mặt trước.'],
    ['Lật giấy và làm lại các bước 9 đến 14 ở mặt sau.',bird,A(220,90,245,140),'Làm lần lượt từng mép và nếp.','Hai mặt thành hình thoi dài.'],
    ['Gấp hai mép dưới mặt trước vào giữa.',slim,C(130,115,145,205)+C(170,115,155,205)+A(105,145,140,150)+A(195,145,160,150),'Giữ hai chân rời nhau phía dưới.','Chân giấy hẹp hơn.'],
    ['Lật giấy, gấp hai mép dưới mặt sau vào giữa.',slim,A(220,90,245,140),'Chừa một khe nhỏ ở giữa.','Cả hai mặt đều được thu hẹp.'],
    ['Gấp chân trái chếch lên rồi mở lại để lấy nếp.',slim+C(130,140,155,155),A(140,200,80,55),'Chân là vạt dài phía dưới.','Có nếp cho phần cổ.'],
    ['Mở khe chân trái, lộn nếp vào trong và dựng cổ lên.',P('150,15 180,115 150,170 120,115')+P('150,155 70,35 100,50 155,115')+P('150,170 160,210 175,115'),A(140,190,85,50),'Người lớn hỗ trợ nếp lộn.','Cổ đứng giữa hai lớp cánh.'],
    ['Làm tương tự với chân phải để dựng đuôi.',P('150,15 180,115 150,170 120,115')+P('150,155 70,35 100,50 155,115')+P('150,155 230,40 195,140'),A(160,195,220,50),'Lấy nếp trước rồi lộn vào trong.','Cổ và đuôi chếch hai bên.'],
    ['Bẻ chóp cổ xuống rồi lộn nếp vào trong làm đầu.',P('150,15 180,115 150,170 120,115')+P('150,155 90,30 60,45 102,50 155,115')+P('150,155 230,40 195,140'),A(90,30,65,60),'Cầm cổ nhẹ, không kéo rách.','Đầu hạc hướng xuống.'],
    ['Hạ hai cánh sang hai bên thật nhẹ.',crane,A(150,30,60,150)+A(150,30,240,150),'Giữ thân hạc bằng tay kia.','Hai cánh mở, cổ và đuôi đứng.']
  ];
  const backRows=rows.slice(8,14).map(row=>[`Ở mặt sau: ${row[0].charAt(0).toLowerCase()+row[0].slice(1)}`,row[1],row[2],row[3],row[4]]);
  backRows[5][1]=bird;
  rows.splice(14,1,['Lật mô hình sang mặt sau.',diamond,A(220,90,245,140),'Giữ phần vừa mở ở phía sau.','Mặt chưa mở quay về phía con.'],...backRows);
  data.lessons.push({id:'ART-13',title:'Hạc giấy',group:'fold',icon:'🕊️',goal:'Tập nếp cơ bản, mở cánh hoa và gấp lộn cùng người lớn.',materials:['Giấy vuông mỏng khoảng 20 × 20 cm, hai mặt khác màu','Mặt bàn phẳng'],safety:'Thử thách nâng cao. Cần người lớn hỗ trợ mở túi giấy và gấp lộn. Không cần kéo; dừng khi giấy kẹt, không kéo mạnh.',difficulty:'Nâng cao · cần người lớn',authored:true,steps:makeSteps(square,rows),reflect:'Bước nào con cần người lớn hỗ trợ? Con đã thử lại thế nào?',extend:'Gấp thêm một hạc bằng giấy lớn hơn để dễ nhìn nếp.',references:['https://www.origami-fun.com/origami-crane.html','https://origami.me/crane/']});
  const pent=P('150,55 208,98 186,165 114,165 92,98','#f5cc7f');
  const star=P('150,42 168,94 222,95 179,127 194,180 150,148 106,180 121,127 78,95 132,94','#f5cc7f');
  data.lessons.push({id:'ART-14',title:'Ngôi sao giấy nhỏ',group:'fold',icon:'⭐',goal:'Tạo nút ngũ giác và bóp cạnh thành sao năm cánh.',materials:['Dải giấy mỏng rộng 1–1,5 cm, dài khoảng 25–30 cm','Dải giấy do người lớn cắt sẵn'],safety:'Làm cùng người lớn. Sao giấy nhỏ không cho vào miệng hoặc đưa cho em bé. Không cần kéo trong lúc gấp.',difficulty:'Khéo tay · cần người lớn',authored:true,steps:makeSteps(R(30,100,240,20),[
    ['Đặt dải giấy dài trước mặt, chừa một đầu ngắn.',R(30,100,240,20),C(80,85,80,135),'Dải cần mềm và đều bề rộng.','Một đầu ngắn, một đầu dài.'],
    ['Uốn đầu ngắn thành vòng như buộc nút lỏng.',`<path d="M265 130H155C70 130 70 40 135 55C195 70 165 140 70 95" fill="none" stroke="#d7a34d" stroke-width="18"/>`,A(75,95,140,70),'Giữ vòng mở bằng một tay.','Có một vòng để luồn đầu.'],
    ['Luồn đầu ngắn qua vòng, kéo nhẹ hai đầu.',pent+R(35,105,70,20)+R(205,105,65,20),A(75,95,165,100),'Không giật hoặc siết quá chặt.','Nút bắt đầu có năm cạnh.'],
    ['Ép nút nhẹ thành hình ngũ giác phẳng.',pent+R(35,105,70,20)+R(205,105,65,20),'','Miết bằng đầu ngón tay.','Nhìn thấy đủ năm cạnh.'],
    ['Gập đầu ngắn và giấu dưới lớp giấy sát cạnh.',pent+R(205,105,65,20),A(65,110,125,110),'Nhờ người lớn mở khe nhỏ.','Đầu ngắn không thò ra ngoài.'],
    ['Gấp phần dài ôm theo một cạnh ngũ giác.',pent+P('185,165 208,98 260,115 240,180','#ffe5bb'),A(260,110,165,150),'Bề rộng dải khớp cạnh giấy.','Dải nằm sát mà không nhăn.'],
    ['Lật và quấn tiếp theo cạnh kế bên.',pent+P('114,165 186,165 200,200 100,200','#ffe5bb'),A(230,150,150,185),'Đổi cạnh, không quấn một chỗ.','Hai mặt được bọc thêm lớp.'],
    ['Lặp lại quanh năm cạnh, chừa đoạn đuôi ngắn.',pent+R(195,100,35,20),A(210,80,230,140),'Bọc vừa tay, không siết cứng.','Khối ngũ giác dày lên đều.'],
    ['Giấu đoạn đuôi cuối vào khe giấy bên dưới.',pent,A(230,110,170,110),'Không cần dán keo.','Không còn đuôi giấy dài.'],
    ['Ấn nhẹ giữa từng cạnh để năm góc nhô ra.',star,A(150,165,150,143)+A(103,131,123,124),'Người lớn hỗ trợ; xoay để ấn đủ năm cạnh.','Sao phồng, không bị bóp bẹp.']
  ]),reflect:'Con đã giữ dải giấy như thế nào để không bị nhăn?',extend:'Thử dải giấy dài hơn với cùng bề rộng nếu sao đầu bị mỏng.',references:['https://origami.me/star/']});
  data.lessons.forEach(l=>{
    l.difficulty=l.difficulty||(l.group==='fold'?'Vừa sức · có thể nhờ người lớn':'Dễ · làm theo ý con');
    l.steps.forEach((s,i)=>{
      if(!s.before)s.before=i?l.steps[i-1].diagram:(l.group==='fold'?(l.id==='ART-07'?R(45,45,210,140):l.id==='ART-08'?R(45,40,125,80)+R(185,105,75,55):square):R(45,35,210,160,'#fffdf5'));
      if(!s.hint)s.hint=l.group==='fold'?'Giữ phần giấy còn lại bằng tay kia.':'Quan sát hình gợi ý rồi làm theo ý con.';
      if(!s.check)s.check='Đối chiếu phần vừa làm với hình kết quả.';
      if(!s.actionDiagram)s.actionDiagram=s.before;
    });
  });
})();
