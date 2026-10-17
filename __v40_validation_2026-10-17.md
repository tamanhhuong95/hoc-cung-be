# V40 — hướng dẫn trực quan và gấp hạc/sao, 17/10/2026

## Kết quả local

Đã thực hiện yêu cầu làm bước trực quan, dễ theo dõi và thêm hạc/ngôi sao. Hiện14 bài Mỹ thuật:12 bài V39 được giữ, thêm Hạc giấy28 bước và Ngôi sao giấy nhỏ10 bước. Bài cún/quạt được chia từ4 thành8 bước/bài; tổng94 bước của14 bài. Đây là số bước, không phải94 tác phẩm khác nhau.

Mỗi bước có hình trước làm, hình sau làm, hướng dẫn ngắn, gợi ý và điểm tự kiểm tra. Các thao tác gấp được bổ sung mũi tên đỏ và nét đứt xanh ở nơi có chỉ dẫn chuyển động; bước đặt giấy/trang trí không tự vẽ mũi tên không có căn cứ. Hình trên điện thoại xếp dọc, nút phóng to mở dialog native, Escape đóng và trả focus. Có bật/tắt gợi ý, chọn lại bước, nhãn bước và số bước trên thẻ. Không autoplay hoặc mô phỏng3D; đây là sơ đồ2D chỉ hướng thao tác.

Hạc/sao ghi rõ cần người lớn. Hạc có các bước tạo nếp, gấp nền, mở mặt trước/sau, thu hẹp chân, dựng cổ/đuôi, tạo đầu và mở cánh; không gộp phần mặt sau thành một câu “làm tương tự”. Sao dùng dải giấy tạo nút, bọc ngũ giác và ấn cạnh. Không cho sao nhỏ vào miệng. Bài mở rộng tự vẽ, không gán thành bài SGK.

## Nguồn và review nội dung

Đối chiếu quy trình truyền thống tại [Origami-Fun: crane](https://www.origami-fun.com/origami-crane.html), [Origami.me: crane](https://origami.me/crane/), [Origami.me: star](https://origami.me/star/). Lời hướng dẫn tiếng Việt và SVG tự biên soạn; không tải/copy ảnh/PDF/video từ các nguồn hoặc nhúng tài nguyên mạng vào luồng trẻ. Không đưa lịch sử, mê tín hoặc hứa hẹn may mắn/sức khỏe vào bài học.

Giới hạn quan trọng: các sơ đồ là bản biên soạn2D, đã kiểm tra SVG và xem ảnh giao diện, chưa được người lớn/trẻ gấp sản phẩm vật lý theo hướng dẫn để xác minh mọi góc nhìn/lớp giấy. Hạc có nếp lộn phức tạp; cần review thực hành cùng người lớn trước khi phát hành. Kiểm thử trình duyệt chỉ chứng minh UI/điều hướng/dữ liệu, không chứng minh dễ gấp hoặc đánh giá kỹ năng của trẻ. Giới hạn đối chiếu đầy đủ ba SGK ởV39 vẫn giữ.

## File và bảo toàn

- art-folds.js mới: bổ sung metadata trước/sau, chỉ hướng,94 bước tổng cộng và2 bài mới; tải sau art-grade1-data.js. Data12 bài gốc vẫn giữ trong file gốc, không sửa ID.
- art-studio.js/CSS và index.html: UI so sánh/zoom/checkpoint/step-picker; dialog đóng khi rời màn hình/đổi bé/tài khoản. Bật/tắt gợi ý không xóa tự nhận xét sau hoàn thành.
- service-worker.js: candidate hoc-cung-be-v40 và precache art-folds.js. script.js/parent-tools.js/child-settings.js chỉ cập nhật literal cache/version so vớiV39; không thay scoring/unlock hoặc dữ liệu học.
- __run_browser_tests.py: giữ toàn bộ suite cũ, cập nhật fixture số bài/số bước thực và thêm10 check trực quan; thêm2 check luồng theo2 lesson mới => tổng563. Mới __run_visual_art_browser.py/__run_v40_pwa_smoke.py. README/Memory/evidence cập nhật local.

Giữ progressVersion=2, Auth/Firestore rules/schema/cloud-sync/merge/localStorage keys, ba course có tiến độ và năm game. Không reset dữ liệu, thêm tracking/ads/dependency/EN-41+. Mỹ thuật chưa lưu/sync điểm, ảnh, kết quả hoặc thời gian. Không dùng số lần bấm để suy ra năng lực/hoàn thành sản phẩm. Các fixture trong profile riêng; dữ liệu thật không bị reset.

## Kết quả thật cuối cùng

| Gate | Kết quả | Exit |
|---|---|---|
| Full regression |33 suite /563 check /fail0 /runtime0 /missing=[]|0|
| Browser thao tác/zoom/keyboard/cập nhật/offline |277 check /fail0 /runtime0|0|
| Luồng học/dialog/PWA offline |13/13|0|
| Responsive bài học |375x812,768x1024,1280x900 đạt|0|
| Audit media/PWA/security |85/85|0|
| Diff check / Python compile |đạt|0|

Browser đi qua14 bài với số bước thực ở3 viewport, zoom và Escape cho hạc/sao, chọn bước cuối offline,5 game, giữ legacy8/10/history/thời gian/trial/sentinel sau nâng cấp actualV39→V40. Đã xem ảnh mobile zoom hạc, bước mở cánh hoa và nút ngũ giác sao. Có thử startup V39 bằng bytes commit thực gồm cả art-studio.js/CSS cũ, không đưaJS mới vàoHTML cũ khi dựng fixture.

Trước sửa, regression có2 fail: toggle gợi ý làm mất tự nhận xét (lỗi source đã sửa); fixture finish cũ cố định4 bước (đã cập nhật để đi qua đủ bước, không bỏ kiểm tra). Lưu __v40_before_review_fix.json. Lượt browser đầu bị runner khai báo const select lặp ở offline, đã lưu __v40_runner_scope_failure.json, sửa biến fixture và chạy lại; không quy thành lỗi ứng dụng hoặc hạ gate.

## Git và bước tiếp theo

Branch codex/art-visual-folds; HEAD/main/origin/main kiểm tra cuối là0c619526f247d34c712092a58c5a418c84102679 (productionV39). V40 chỉlocal, chưa commit/push/deploy. Bảo toàn tài liệu cập nhật sau phát hànhV39 và untracked có sẵn. Bằng chứng __v40_validation_evidence.json; status __v40_git_status.txt.

Bước tiếp: người lớn gấp thử hạc/sao bằng giấy thực, review nếp mở túi/lộn và ngôn ngữ, rồi quyết định phát hành. Chưa thiết bị vật lý/Safari/iOS/Firebase tài khoản thật E2E. Lệnh chạy tuần tự: py __run_browser_tests.py; py __run_visual_art_browser.py; py __run_v40_pwa_smoke.py; py __run_english_responsive.py; py __audit_english_videos.py. Runner cũ là lịch sử.


## Production V40 đã xác minh — 17/10/2026

V40 đã commit/push/deploy tại SHA f189ffa8fa34e23988a929eec04cdbd60adae734. GitHub Pages run38978240870 completed/success. Cả14 asset production HTTP200 và bytes khớp commit; cache hoc-cung-be-v40. Smoke production63/63, fail0/runtime0/exit0: hạc28 bước/sao10 bước online và offline, trước/sau, zoom/Escape trả focus, guide toggle giữ tự nhận xét, các nhóm Mỹ thuật cũ,5 trò, luồng bài học/dialog và sentinel local giữ nguyên. Kiểm tra bằng profile test riêng, không xóa hoặc mở profile người dùng.

Nguồn bằng chứng __v40_production_evidence.json; runner __run_v40_production_smoke.py. Gate trước phát hành33 suites/563 checks và browser277 checks là bằng chứng local riêng. Các đoạn V40 chưa phát hành ở trên mô tả lịch sử trước quyết định phát hành và được thay bằng mục này.

Giới hạn chưa gấp sản phẩm vật lý theo sơ đồ, cần người lớn hỗ trợ hạc/sao, chưa thiết bị thật/Safari/Firebase E2E vẫn giữ. Mỹ thuật chưa lưu/sync tiến độ, không gán bấm xong thành năng lực hoặc sản phẩm thực. Source phát hành không đổi; tài liệu/bằng chứng sau deploy cập nhật local chưa commit.
