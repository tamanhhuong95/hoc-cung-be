"use strict";
(() => {
  const line=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="#56577d" stroke-width="3" stroke-dasharray="7 5"/>`;
  const rect=(x,y,w,h,c='#b7dcee')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c}" stroke="#586783" stroke-width="2"/>`;
  const poly=(points,c='#f8ce87')=>`<polygon points="${points}" fill="${c}" stroke="#586783" stroke-width="2" stroke-linejoin="round"/>`;
  const circle=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const eyes=circle(128,124,4,'#3c3659')+circle(172,124,4,'#3c3659')+poly('143,145 157,145 150,153','#3c3659');
  const fan=(small=false)=>`<g${small?' transform="translate(55 35) scale(.65)"':''}>${poly('60,65 80,155 100,65 120,155 140,65 160,155 180,65 200,155 220,65 240,155','#facbd8')}${[80,120,160,200].map(x=>line(x,80,x+15,140)).join('')}</g>`;
  const roof=poly('65,110 150,45 235,110','#e5a1a3');
  const house=roof+rect(80,110,140,85,'#ffe2a4')+rect(137,145,27,50,'#a9d3d2');
  const tree=rect(140,115,22,80,'#b88e73')+circle(150,85,57,'#86bc93');
  const dots=Array.from({length:12},(_,i)=>circle(65+i%4*55,55+Math.floor(i/4)*55,8,['#df6f8c','#6badd1','#efbf65'][i%3])).join('');
  const leaves=Array.from({length:8},(_,i)=>poly(`${95+i%4*30},${75+Math.floor(i/4)*33} ${110+i%4*30},${60+Math.floor(i/4)*33} ${123+i%4*30},${82+Math.floor(i/4)*33} ${106+i%4*30},${96+Math.floor(i/4)*33}`,'#9bc89a')).join('');
  const lion=(face=true)=>Array.from({length:12},(_,i)=>`<g transform="rotate(${i*30} 150 115)">${rect(143,33,14,50,'#efb66e')}</g>`).join('')+circle(150,115,47,'#f7d78c')+(face?eyes:'');
  const sources=[
    {id:'kntt',title:'Kết nối tri thức với cuộc sống',url:'https://www.nxbgd.vn/bai-viet/gioi-thieu-bo-sgk-ket-noi-tri-thuc-voi-cuoc-song',scope:'Giới thiệu của NXB: quan sát, thực hành và vận dụng tạo hình; chưa đối chiếu từng bài/trang.'},
    {id:'ctst',title:'Chân trời sáng tạo',url:'https://www.nxbgd.vn/bai-viet/gioi-thieu-bo-sgk-chan-troi-sang-tao',scope:'Đã tham khảo giới thiệu của NXB về các chủ đề tạo hình gắn với nhà ở, thiên nhiên, cây cối, con vật và thực hành sáng tạo; chưa đối chiếu từng bài/trang.'},
    {id:'cd',title:'Cánh Diều',url:'https://ebdbook.vn/mi-thuat-1-sach-giao-vien-bo-canh-dieu.html',scope:'Trang giới thiệu sách giáo viên có mục lục về màu, chấm, nét, kết hợp hình và hình khối; chưa truy cập đầy đủ nội dung từng bài.'}
  ];
  const lessons=[];
  const add=(id,title,group,icon,goal,materials,safety,steps,reflect,extend)=>lessons.push({id,title,group,icon,goal,materials,safety,steps:steps.map(([text,diagram])=>({text,diagram})),reflect,extend,authored:true});
  add('ART-01','Khu vườn của những chấm','draw','🟣','Tạo chấm to, nhỏ và sắp xếp thành hình.', ['Giấy vẽ','Bút sáp hoặc bút màu'], 'Dùng bút trên giấy, đậy nắp sau khi dùng.',[
    ['Chọn ba màu bút con thích. Chấm thử nhẹ tay ở góc giấy.',circle(95,95,6,'#df6f8c')+circle(150,95,9,'#6badd1')+circle(205,95,13,'#efbf65')],
    ['Chấm những hạt to và nhỏ, để khoảng trống giữa chúng.',dots],
    ['Xếp một nhóm chấm thành bông hoa hoặc đám mây.',Array.from({length:8},(_,i)=>circle(150+Math.cos(i*Math.PI/4)*38,110+Math.sin(i*Math.PI/4)*38,9,'#df6f8c')).join('')+circle(150,110,13,'#efbf65')],
    ['Thêm chấm làm lá, cỏ hoặc mưa cho khu vườn của con.',tree+dots.replaceAll('r="8"','r="4"')]
  ],'Con đã dùng chấm to và chấm nhỏ ở đâu?','Thử tạo một bức tranh chỉ dùng chấm, không vẽ nét.');
  add('ART-02','Đường nét dạo chơi','draw','〰️','Nhận ra và sử dụng nét thẳng, cong, gấp khúc.', ['Giấy vẽ','Bút màu'], 'Ngồi thoải mái và không tì bút quá mạnh.',[
    ['Vẽ vài nét thẳng dài, ngắn như những tia nắng.',[80,115,150,185,220].map(x=>`<path d="M${x} 55V160" stroke="#dc9d57" stroke-width="6"/>`).join('')],
    ['Vẽ nét cong mềm như sóng nước.',`<path d="M40 110Q80 50 120 110T200 110T280 110" fill="none" stroke="#6aa8c8" stroke-width="7"/>`],
    ['Vẽ nét gấp khúc như đường đi lên núi.',`<path d="M35 170L90 70L140 155L200 45L265 170" fill="none" stroke="#8a98c5" stroke-width="7"/>`],
    ['Kết hợp các nét thành phong cảnh theo ý con.',poly('20,180 80,85 145,180','#9bc89a')+poly('110,180 200,50 280,180','#a5bdd8')+circle(65,45,20,'#f2c967')]
  ],'Con tìm được những nét nào trong bức tranh?','Vẽ một con đường bằng ba kiểu nét khác nhau.');
  add('ART-03','Bảng màu của em','draw','🎨','Gọi tên màu và lựa chọn màu cho bức tranh.', ['Giấy vẽ','Bút sáp đỏ, vàng, xanh lam và các màu khác'], 'Không đưa bút hoặc màu vào miệng.',[
    ['Tìm bút đỏ, vàng và xanh lam. Tô ba ô màu cạnh nhau.',rect(50,75,55,70,'#e36b79')+rect(122,75,55,70,'#f5d66a')+rect(195,75,55,70,'#6b9fd5')],
    ['Nhìn đồ vật quanh con và chọn một màu giống đồ vật đó.',circle(100,110,35,'#e36b79')+rect(165,75,65,70,'#6b9fd5')],
    ['Vẽ một bông hoa và chọn màu cho cánh, nhụy, lá.',circle(125,83,25,'#e36b79')+circle(175,83,25,'#e36b79')+circle(125,130,25,'#e36b79')+circle(175,130,25,'#e36b79')+circle(150,107,20,'#f5d66a')],
    ['Tô nền bằng màu con thích. Không cần giống tranh mẫu.',rect(45,30,210,165,'#d8edf7')+tree]
  ],'Vì sao con chọn những màu này?','Thử vẽ lại một bông hoa bằng bảng màu khác.');
  add('ART-04','Ngôi nhà từ hình cơ bản','draw','🏡','Kết hợp hình tam giác, chữ nhật và vuông.', ['Giấy','Bút chì','Bút màu'], 'Cầm bút nhẹ nhàng, không dùng đầu nhọn chọc vào đồ vật.',[
    ['Vẽ hình chữ nhật làm thân ngôi nhà.',rect(80,95,140,100,'#ffe2a4')],
    ['Vẽ một hình tam giác ở phía trên làm mái.',house.replace(rect(137,145,27,50,'#a9d3d2'),'')],
    ['Thêm cửa ra vào và cửa sổ nhỏ.',house+rect(95,125,26,26,'#a9d3d2')+rect(180,125,26,26,'#a9d3d2')],
    ['Vẽ thêm cây, mây hoặc người thân và tô màu.',house+circle(55,55,20,'#f1cd75')+`<path d="M250 195V140" stroke="#b88e73" stroke-width="8"/>`+circle(250,130,25,'#9bc89a')]
  ],'Mái nhà và cửa có hình gì?','Tạo một ngôi nhà tưởng tượng có cửa tròn.');
  add('ART-05','Gấp khuôn mặt cún con','fold','🐶','Gấp chéo và gấp hai góc để tạo tai.', ['Một tờ giấy vuông','Bút màu'], 'Bài này không cần kéo. Miết nếp bằng đầu ngón tay.',[
    ['Đặt giấy vuông trước mặt. Gấp theo đường chéo để hai góc đối diện chạm nhau.',rect(75,35,150,150)+line(75,35,225,185)],
    ['Đặt tam giác với cạnh dài ở trên, đỉnh hướng xuống dưới. Miết nếp gấp.',poly('50,55 250,55 150,190')],
    ['Gấp hai góc trái và phải xuống như hình để làm hai tai.',poly('80,55 220,55 150,190')+poly('80,55 50,115 105,95','#e5ae75')+poly('220,55 250,115 195,95','#e5ae75')],
    ['Vẽ mắt, mũi và miệng. Con có thể thêm đốm màu cho cún.',poly('80,55 220,55 150,190')+poly('80,55 50,115 105,95','#e5ae75')+poly('220,55 250,115 195,95','#e5ae75')+eyes]
  ],'Hai tai cún của con có giống nhau không?','Thử thay đổi độ dài tai bằng cách gấp hai góc nhiều hoặc ít hơn.');
  add('ART-06','Chiếc quạt xếp nhỏ','fold','🪭','Gấp các nếp luân phiên như đàn xếp.', ['Giấy hình chữ nhật','Một đoạn băng dính giấy'], 'Không vung quạt vào mặt bạn. Nhờ người lớn lấy băng dính nếu cần.',[
    ['Đặt giấy nằm ngang. Gấp một dải hẹp dọc theo cạnh ngắn.',rect(55,45,190,135)+rect(55,45,22,135,'#f4c8d6')],
    ['Lật mặt giấy, gấp dải tiếp theo có bề rộng tương tự. Lặp lại đến hết tờ giấy.',fan()],
    ['Gom các nếp lại thành một thanh. Gấp đôi thanh giấy ở giữa.',rect(65,95,170,25,'#f4c8d6')+line(150,75,150,145)],
    ['Dán hai mép trong ở giữa, rồi mở các nếp ra thành chiếc quạt.',poly('150,190 40,65 260,65','#f4c8d6')+[70,110,150,190,230].map(x=>line(150,185,x,70)).join('')]
  ],'Khi khép quạt, các nếp giấy nằm như thế nào?','Trang trí hai mặt giấy trước khi gấp chiếc quạt tiếp theo.');
  add('ART-07','Tấm thiệp yêu thương','fold','💌','Gấp đôi tờ giấy và trang trí tấm thiệp.', ['Giấy chữ nhật','Bút màu'], 'Bài này không cần kéo hay keo.',[
    ['Đặt tờ giấy nằm ngang. Tìm đường giữa tờ giấy.',rect(45,45,210,140,'#f9dbe6')+line(150,45,150,185)],
    ['Đưa cạnh trái trùng cạnh phải rồi miết nếp gấp.',rect(150,45,105,140,'#f4bfd4')],
    ['Vẽ hoa hoặc hình con thích lên mặt ngoài tấm thiệp.',rect(95,30,110,165,'#f9dbe6')+circle(150,100,25,'#e99bb4')+circle(150,100,10,'#f1d572')],
    ['Mở thiệp và viết hoặc nhờ người lớn ghi lời chúc của con.',rect(45,45,210,140,'#f9dbe6')+line(150,45,150,185)+`<path d="M70 95H125M70 115H125M175 95H230M175 115H230" stroke="#997d9b" stroke-width="4"/>`]
  ],'Con muốn tặng tấm thiệp cho ai?','Dùng những chấm và nét để tạo viền trang trí.');
  add('ART-08','Bướm giấy nếp quạt','fold','🦋','Kết hợp hai phần giấy gấp để tạo hình bướm.', ['Hai giấy chữ nhật một to, một nhỏ','Đoạn sợi mềm','Bút màu'], 'Nhờ người lớn buộc sợi và cắt phần sợi thừa. Không quấn sợi vào người.',[
    ['Trang trí hai tờ giấy. Tờ to sẽ làm cánh trên, tờ nhỏ làm cánh dưới.',rect(45,40,125,80,'#f4c8d6')+rect(185,105,75,55,'#c3d9ef')],
    ['Gấp từng tờ thành các nếp đàn xếp như bài chiếc quạt.',fan()+fan(true)],
    ['Bóp giữa mỗi dải giấy, xếp dải to phía trên dải nhỏ. Nhờ người lớn buộc hai phần ở giữa.',poly('150,110 55,55 55,165','#f4c8d6')+poly('150,110 245,55 245,165','#f4c8d6')+poly('150,125 95,160 115,195','#c3d9ef')+poly('150,125 205,160 185,195','#c3d9ef')],
    ['Xòe nhẹ các nếp hai bên thành cánh. Vẽ thêm bướm vào một khu vườn giấy.',poly('150,105 55,45 55,150','#f4c8d6')+poly('150,105 245,45 245,150','#f4c8d6')+poly('150,125 80,155 115,190','#c3d9ef')+poly('150,125 220,155 185,190','#c3d9ef')+rect(144,80,12,75,'#9c84ad')]
  ],'Cánh trên và cánh dưới khác nhau ở điểm nào?','Thử chọn hai màu khác nhau cho cánh trên và cánh dưới.');
  add('ART-09','Cây xanh xé dán','craft','🌳','Xé mảng giấy nhỏ và ghép thành tán cây.', ['Giấy nền','Giấy màu xanh và nâu','Hồ dán học sinh'], 'Dùng ít hồ dán, không đưa hồ vào miệng. Rửa tay sau khi làm.',[
    ['Xé một dải giấy nâu làm thân cây.',poly('140,195 138,100 158,95 166,195','#b88e73')],
    ['Xé giấy xanh thành những mảng nhỏ. Mép giấy không cần đều nhau.',leaves],
    ['Dán thân lên nền, rồi dán các mảng xanh thành tán ở phía trên.',rect(140,115,22,80,'#b88e73')+leaves],
    ['Thêm cỏ, hoa hoặc quả bằng giấy xé nhỏ.',tree+circle(130,75,8,'#df7788')+circle(175,100,8,'#df7788')+poly('40,195 50,170 62,195 75,172 85,195','#9bc89a')]
  ],'Những mảng giấy nhỏ đã ghép thành hình gì?','Tạo thêm một cây có tán dài hoặc tán tròn.');
  add('ART-10','Ngôi nhà giấy màu','craft','🏠','Ghép hình cắt sẵn thành bức tranh ngôi nhà.', ['Giấy nền','Hình vuông, tam giác và chữ nhật bằng giấy màu','Hồ dán'], 'Nhờ người lớn cắt sẵn các hình. Nếu tập cắt, dùng kéo đầu tròn và có người lớn bên cạnh.',[
    ['Chọn các hình đã được người lớn cắt sẵn cho thân, mái và cửa.',rect(45,75,65,75,'#ffe2a4')+poly('130,120 175,50 220,120','#e5a1a3')+rect(240,110,25,50,'#a9d3d2')],
    ['Xếp thân nhà lên nền, đặt mái ở trên. Chưa dán vội để con thử vị trí.',house.replace(rect(137,145,27,50,'#a9d3d2'),'')],
    ['Thêm cửa và cửa sổ, rồi dán từng hình bằng một lớp hồ mỏng.',house+rect(95,125,25,25,'#a9d3d2')+rect(180,125,25,25,'#a9d3d2')],
    ['Dùng bút vẽ thêm đường đi, cây hoặc mây quanh nhà.',house+`<path d="M150 195L125 220M165 195L190 220" stroke="#b9a2ba" stroke-width="4"/>`+circle(255,65,22,'#f1cd75')]
  ],'Con đã đặt mái ở đâu so với thân nhà?','Sắp xếp nhiều ngôi nhà nhỏ thành một khu phố.');
  add('ART-11','Dây vòng sắc màu','craft','🔗','Tạo vòng giấy và nối chúng thành chuỗi.', ['Các dải giấy màu cắt sẵn','Hồ dán hoặc băng dính giấy'], 'Nhờ người lớn chuẩn bị dải giấy. Không đeo vòng giấy quanh cổ hoặc quấn vào người.',[
    ['Chọn vài dải giấy màu đã được cắt sẵn.',rect(45,65,210,20,'#f4c8d6')+rect(45,105,210,20,'#c3d9ef')+rect(45,145,210,20,'#f4d98b')],
    ['Uốn dải đầu thành vòng, chồng hai đầu một đoạn ngắn và dán lại.',`<ellipse cx="150" cy="115" rx="55" ry="65" fill="none" stroke="#e9a7c0" stroke-width="20"/>`],
    ['Luồn dải thứ hai qua vòng đầu, rồi dán hai đầu dải thứ hai.',`<ellipse cx="115" cy="105" rx="43" ry="57" fill="none" stroke="#e9a7c0" stroke-width="17"/><ellipse cx="182" cy="140" rx="43" ry="57" fill="none" stroke="#a4c7e9" stroke-width="17"/>`],
    ['Nối tiếp vài vòng. Đặt dây vòng trên bàn để trang trí.',[0,1,2,3].map((i)=>`<ellipse cx="${65+i*55}" cy="${100+i%2*25}" rx="33" ry="47" fill="none" stroke="${['#e9a7c0','#a4c7e9','#ead080'][i%3]}" stroke-width="14"/>`).join('')]
  ],'Mỗi vòng mới nối với vòng trước bằng cách nào?','Xếp màu các vòng theo quy luật con tự chọn.');
  add('ART-12','Sư tử bờm giấy','craft','🦁','Ghép dải giấy quanh hình tròn để tạo bờm.', ['Hình tròn và dải giấy màu cắt sẵn','Giấy nền','Hồ dán','Bút màu'], 'Nhờ người lớn cắt sẵn các hình; dùng hồ dán học sinh và rửa tay sau khi làm.',[
    ['Chọn một hình tròn cho mặt và các dải giấy cho bờm.',circle(90,110,42,'#f7d78c')+rect(170,50,15,125,'#efb66e')+rect(200,50,15,125,'#efb66e')+rect(230,50,15,125,'#efb66e')],
    ['Xếp các dải tỏa ra xung quanh vị trí đặt mặt. Dán đầu trong của dải lên nền.',lion(false).replace(circle(150,115,47,'#f7d78c'),'')],
    ['Dán hình tròn đè lên các đầu dải giấy để tạo khuôn mặt.',lion(false)],
    ['Vẽ mắt, mũi, miệng. Đặt tên cho bạn sư tử của con.',lion()]
  ],'Những dải giấy đã biến thành bộ phận nào của sư tử?','Thay các dải thẳng bằng dải giấy hơi cong để bờm khác đi.');
  window.HocCungBeArtData={version:1,sources,groups:[{id:'draw',label:'Màu sắc & tạo hình',icon:'🎨'},{id:'fold',label:'Gấp giấy',icon:'🪭'},{id:'craft',label:'Xé dán & thủ công',icon:'✂️'}],lessons};
})();
