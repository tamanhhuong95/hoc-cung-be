"use strict";
(()=>{
 const R=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c}" stroke="#526584" stroke-width="2"/>`;
 const L=d=>`<path d="${d}" stroke="#526584" stroke-width="3" fill="none"/>`;
 const C=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#526584" stroke-width="2"/>`;
 const P=(points,c)=>`<polygon points="${points}" fill="${c}" stroke="#526584" stroke-width="2"/>`;
 const blank=R(25,20,250,180,'#fffdf7');
 const scenes={
  town:[R(40,100,60,75,'#efbe8b'),R(115,70,65,105,'#b9d6f0'),R(195,110,55,65,'#c9dfb5'),L('M25 180H275')],
  tree:[L('M150 175V65M150 100L110 75M150 120L190 85'),C(110,65,35,'#b6d9a1'),C(185,65,42,'#a8d8c3'),C(145,40,35,'#d4e9a0')],
  fish:[P('70,110 170,65 220,110 170,155','#f0ba8d'),P('70,110 40,75 40,145','#b5d3ee'),C(195,105,5,'#53647c'),L('M130 85Q165 110 130 135')],
  pattern:[R(45,60,210,95,'#e5d8f1'),P('70,100 90,80 110,100 90,120','#f6c887'),C(150,100,20,'#a3d6cd'),P('190,100 210,80 230,100 210,120','#f6c887')],
  fan:[P('150,175 45,60 255,60','#c4dbea'),L('M150 175L70 60M150 175L110 60M150 175L150 60M150 175L190 60M150 175L230 60'),C(150,175,9,'#eec38a'),L('M150 181V200')],
  flower:[L('M150 170V85'),C(125,75,25,'#efb3b4'),C(170,75,25,'#efb3b4'),C(150,50,25,'#e4bfdc'),C(150,100,25,'#e4bfdc'),C(150,78,15,'#f3d280')],
  mask:[C(150,105,65,'#f2c68d'),P('100,60 90,20 130,45','#e4ab82'),P('170,45 210,20 200,60','#e4ab82'),C(125,100,12,'#fffdf7')+C(175,100,12,'#fffdf7'),P('140,125 160,125 150,138','#806b7c')],
  poster:[R(50,40,200,140,'#d3e8df'),L('M75 65H225M75 75H225'),C(150,115,30,'#a9cbdc'),L('M80 165H220')],
  relief:[R(35,130,230,45,'#d8dfef'),R(80,90,70,65,'#f0c496'),P('80,90 115,55 150,90','#c2aed8'),R(175,110,50,50,'#aed5bb')],
  box:[R(90,70,110,85,'#a8d5d3'),P('90,70 125,40 235,40 200,70','#e6cf92'),P('200,70 235,40 235,125 200,155','#c3c1e5'),L('M145 70V155')]
 };
 const specs={
  3:[
   ['Phố nhỏ nhiều mái nhà','draw','town',['Giấy vẽ','Bút chì','Bút màu'],['Phác đường mặt đất, dành phần trên cho bầu trời.','Vẽ các ngôi nhà bằng hình chữ nhật; thay đổi chiều cao để tạo nhịp điệu.','Thêm cửa, cây và một lối đi; chừa khoảng trống để tranh dễ nhìn.','Chọn một màu chủ đạo, tô nhạt nền và đậm hơn ở ngôi nhà con muốn nhấn.']],
   ['Cây qua những mùa','draw','tree',['Giấy','Bút màu'],['Chọn một mùa con muốn thể hiện và phác thân, cành chính.','Chia tán cây thành các mảng lớn nhỏ.','Dùng màu lá phù hợp với ý tưởng về mùa; thêm nét ngắn tạo chất lá.','Vẽ nền đơn giản rồi kể sự thay đổi của cây trong mùa con chọn.']],
   ['Mặt nạ con vật bằng bìa','craft','mask',['Bìa mỏng sạch','Giấy màu','Hồ dán','Bút màu'],['Vẽ khuôn mặt con vật lên bìa; đây là mặt nạ để trưng bày, không đeo.','Nhờ người lớn cắt đường bao; vẽ mắt thay vì tự khoét bằng vật nhọn.','Xé giấy màu thành tai, mũi và xếp thử lên mặt.','Dán từng phần, thêm nét biểu cảm rồi đặt lên kệ khô ráo.']],
   ['Cá ghép từ những mảnh giấy','craft','fish',['Giấy nền','Giấy màu vụn sạch','Hồ dán'],['Phác đường bao cá và hướng bơi trên nền giấy.','Xé các mảnh nhỏ, xếp thử từ thân tới đuôi.','Dán từng mảnh từ ngoài vào trong, phối hai nhóm màu con thích.','Thêm mắt, nét nước và quan sát khoảng trống quanh đàn cá.']],
   ['Khung ảnh họa tiết lặp','craft','pattern',['Bìa khung do người lớn cắt sẵn','Giấy màu','Hồ dán','Bút'],['Đặt khung bìa trên mặt phẳng; thử bố cục trước, chưa dán ảnh thật.','Chọn hai hình đơn giản và lặp lại quanh viền khung.','Phối màu xen kẽ, chừa phần giữa để đặt một bức vẽ nhỏ.','Dán họa tiết rồi cho bức vẽ vào; kiểm tra viền không che nội dung.']],
   ['Quạt giấy có nhịp điệu','fold','fan',['Giấy chữ nhật','Hồ dán','Bút màu'],['Vẽ dải họa tiết lặp dọc cạnh dài của giấy.','Gấp cạnh ngắn vào một nếp rộng khoảng một ngón tay rồi miết nhẹ.','Lật giấy, gấp ngược một nếp cùng bề rộng; lặp đến hết tờ.','Gom một đầu nếp gấp và dán cố định bằng một dải giấy nhỏ.','Xòe đầu còn lại thành quạt, để hồ khô trước khi cầm.','Nhìn đường gấp và họa tiết; thử thay đổi màu ở chiếc quạt tiếp theo.']]
  ],
  4:[
   ['Phong cảnh gần và xa','draw','town',['Giấy','Bút chì','Màu'],['Kẻ đường chân trời nhẹ, chọn nơi đặt điểm nhấn.','Phác ngôi nhà ở gần lớn hơn, ngôi nhà ở xa nhỏ hơn.','Tô vùng xa nhạt hơn; thêm chi tiết cho vật ở gần.','Kiểm tra phần trước và sau có tách rõ, rồi kể góc nhìn của con.']],
   ['Cây dưới ánh sáng','draw','tree',['Giấy','Bút màu'],['Phác thân và tán, chọn ánh sáng đến từ một phía.','Chia tán thành vùng sáng và vùng tối, không cần tô viền từng lá.','Dùng các sắc xanh sáng tối để tạo khối cho tán.','Thêm bóng cây trên đất phía ngược ánh sáng và quan sát tổng thể.']],
   ['Áp phích giữ trường sạch','craft','poster',['Giấy nền','Giấy màu','Hồ dán','Bút'],['Chọn thông điệp ngắn như “Bỏ rác đúng chỗ”, ghi nháp ở góc riêng.','Xếp tiêu đề lớn, dễ đọc ở phía trên; giữ một hình chính ở giữa.','Xé dán hình thùng rác hoặc cây xanh; chọn màu chữ nổi trên nền.','Đọc từ xa để kiểm tra; giảm chi tiết nếu thông điệp bị chìm.']],
   ['Tranh nổi từ bìa sạch','craft','relief',['Bìa nền','Mảnh bìa cắt sẵn','Hồ dán'],['Chọn cảnh có ba lớp: nền, vật ở xa và vật ở gần.','Xếp các mảnh bìa thành nhà hoặc cây; nhờ người lớn cắt khi cần.','Dán miếng bìa nhỏ làm đệm dưới lớp gần, không dùng vật sắc.','Dán lớp gần lên đệm, để khô rồi quan sát bóng giữa các lớp.']],
   ['Họa tiết cho túi giấy','craft','pattern',['Túi giấy sạch không quai dây','Bút màu','Giấy vụn','Hồ dán'],['Đặt túi phẳng, chọn khoảng trang trí tránh đáy và mép gấp.','Phác một đơn vị họa tiết gồm hình và nét.','Lặp họa tiết theo hàng, giữ khoảng cách tương đối đều.','Thêm điểm nhấn khác màu; chỉ dùng túi đựng đồ nhẹ, khô.']],
   ['Hoa giấy nhiều lớp','fold','flower',['Ba tờ giấy vuông nhỏ','Hồ dán','Giấy làm cành'],['Gấp mỗi tờ vuông theo đường chéo thành một tam giác.','Gấp đôi tam giác một lần nữa, miết rồi mở ra để thấy nếp giữa.','Mở hẳn giấy về hình vuông; chụm nhẹ tâm tạo mảng cánh, không cần cắt.','Xếp ba mảng lệch góc lên nhau, dán một chấm hồ ở giữa mỗi lớp.','Cuộn một dải giấy làm cành và dán vào mặt sau khi hoa đã khô.','Đặt hoa nằm để trưng bày; chỉnh độ mở các lớp và tự nhận xét.']]
  ],
  5:[
   ['Góc phố theo góc nhìn','draw','town',['Giấy','Bút chì','Màu'],['Chọn góc nhìn và đặt đường chân trời nhẹ.','Vẽ khối nhà gần lớn hơn, các khối xa nhỏ dần về một phía.','Thêm cửa và đường đi cùng hướng thu nhỏ, không cần dùng thước cho mọi nét.','Phối sắc độ để nhấn vật chính; kể cách con tạo cảm giác xa gần.']],
   ['Màu sắc truyền cảm xúc','draw','tree',['Giấy','Màu sáp hoặc bút màu'],['Chọn cảm xúc yên bình hoặc rộn ràng, phác bố cục cây.','Chọn nhóm màu phù hợp ý tưởng, thử trên giấy nháp.','Phối mảng lớn nhỏ và nét mạnh nhẹ để thể hiện cảm xúc.','Đặt tên tranh và giải thích một lựa chọn màu của con; không có một màu đúng duy nhất.']],
   ['Thông điệp bảo vệ thiên nhiên','craft','poster',['Giấy nền','Giấy vụn sạch','Hồ dán','Bút'],['Chọn một việc cụ thể như tái sử dụng giấy, viết thông điệp ngắn.','Phân chia vùng chữ và hình; chọn một điểm nhấn rõ.','Ghép giấy màu tạo hình chính, dùng tương phản để chữ dễ đọc.','Nhờ người khác đọc thử và góp ý; chỉnh nếu thông điệp chưa rõ.']],
   ['Phù điêu giấy về di sản','craft','relief',['Bìa nền','Giấy và bìa sạch cắt sẵn','Hồ dán'],['Chọn một công trình con từng biết, phác các khối chính thay vì chép mọi chi tiết.','Xếp thử nền và hai lớp nổi, thử bóng đổ dưới ánh sáng.','Dán đệm bìa thấp giữa các lớp, nhờ người lớn cắt phần khó.','Thêm lời giới thiệu, phân biệt điều con quan sát với chi tiết con tưởng tượng.']],
   ['Thiết kế bìa sổ ý tưởng','craft','pattern',['Bìa sổ rời','Giấy màu','Hồ dán','Bút'],['Chọn người dùng và mục đích của sổ, viết ba từ gợi ý.','Phác hai phương án họa tiết trên giấy nháp rồi chọn một.','Xếp tên sổ và họa tiết, chừa chỗ cầm và phần gáy.','Hoàn thiện bìa, thử đọc tên sổ từ xa và giải thích lựa chọn thiết kế.']],
   ['Mô hình hộp từ hình khai triển','fold','box',['Bìa mỏng','Thước','Bút chì','Hồ dán'],['Vẽ bốn hình vuông cạnh 4 cm nối thành một hàng; thêm một hình trên và một hình dưới hình thứ hai.','Vẽ tai dán rộng khoảng 0,5 cm ở các cạnh ngoài cần nối; tránh vẽ chồng tai lên nhau.','Nhờ người lớn cắt đường bao cả mẫu; không cắt các cạnh chung giữa các hình vuông.','Dùng thước hỗ trợ gấp nhẹ theo cạnh chung và gấp tai dán vào trong.','Dựng bốn mặt bên, dán tai từng mặt; dán đáy rồi khép nắp sau khi hồ khô.','Quan sát sáu mặt vuông của hộp; mô hình chỉ để trưng bày, không dùng đựng đồ ăn.']]
  ]
 };
 window.HOC_CUNG_BE_UPPER_ART={};
 for(const grade of [3,4,5]){
  const lessons=specs[grade].map(([title,group,scene,materials,texts],i)=>{
   const parts=scenes[scene];let before=blank;
   const net=[[65,85],[105,85],[145,85],[185,85],[105,45],[105,125]].map(([x,y])=>R(x,y,40,40,'#c7dfdf')).join('');
   const tabs=P('65,85 65,125 57,118 57,92','#ecd49a')+P('105,45 145,45 138,37 112,37','#ecd49a')+P('105,165 145,165 138,173 112,173','#ecd49a')+P('105,45 105,85 97,78 97,52','#ecd49a')+P('145,45 145,85 153,78 153,52','#ecd49a')+P('105,125 105,165 97,158 97,132','#ecd49a')+P('145,125 145,165 153,158 153,132','#ecd49a');
   return {id:`ART${grade}-${String(i+1).padStart(2,'0')}`,title,group,icon:group==='draw'?'🎨':group==='fold'?'📐':'✂️',goal:title+'. Thử, quan sát và giải thích lựa chọn của con.',materials,safety:'Làm ở nơi đủ sáng. Nhờ người lớn cắt bìa; không dùng dao rọc giấy, ghim hoặc nguồn nhiệt. Không quấn dây hay đeo sản phẩm lên mặt.',authored:true,difficulty:`Thực hành lớp ${grade} · có người lớn hỗ trợ khi cần`,reflect:'Con đã thay đổi điều gì sau khi thử? Chọn một chi tiết con muốn giới thiệu.',extend:'Thử một phương án bố cục hoặc phối màu khác và so sánh.',steps:texts.map((text,j)=>{const diagram=scene==='box'&&j<4?blank+net+(j?tabs:'')+(j===3?L('M95 95Q120 65 145 95M138 86L145 95 133 95'):''):blank+parts.slice(0,Math.max(1,Math.ceil((j+1)*parts.length/texts.length))).join('');const step={text,diagram,before,actionDiagram:before,hint:'Hình là gợi ý bố cục, sản phẩm có thể khác mẫu. Đọc kỹ phần thao tác.',check:'Nhìn lại bước vừa làm; chỉnh khi cần rồi tiếp tục.'};before=diagram;return step;})};
  });
  window.HOC_CUNG_BE_UPPER_ART[grade]={grade:`grade-${grade}`,version:1,groups:[{id:'draw',label:'Vẽ & bố cục',icon:'🎨'},{id:'craft',label:'Thiết kế & thủ công',icon:'✂️'},{id:'fold',label:'Gấp & dựng hình',icon:'📐'}],lessons,sources:[{id:'original',title:'Bài thực hành tự biên soạn',url:'https://sachdientu.nxbgd.vn/',scope:'Tham khảo danh mục môn/lớp; chưa đối chiếu đầy đủ từng bài/trang SGK. Sơ đồ bố cục tự vẽ, chưa xác nhận bằng thực hành sản phẩm vật lý.'}]};
 }
})();
