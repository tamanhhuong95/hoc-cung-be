# Project Memory hiện hành — Học Cùng Bé

Tài liệu PM-5.0, ngày 16/10/2026 UTC+7. Production V37; local V39 Mỹ thuật + V38 trò chơi chưa phát hành. Xem mục V39 cuối tài liệu; giữ các phần trước làm lịch sử.

## Quyết định và trạng thái xác minh

Chủ dự án đã đồng ý đề xuất phát hành V36, xác minh production rồi triển khai một trò chơi mẫu “Tìm cặp giống nhau”. Quyết định mới thay điểm dừng trước commit của V36. Không suy rộng thành quyền phát hành trò chơi mẫu.

- V36 đã commit/push bình thường lên main: f600cbfb2a1adc5bdf3d28264830bd657c13b7fd. GitHub Pages run 38924257691 completed/success. index.html, script.js, styles.css và service-worker.js production HTTP 200, bytes khớp commit. Production smoke 13/13, exit 0, worker/cache v36 và offline đạt. Chi tiết __v36_production_evidence.json.
- Gate V36 trước phát hành: 29 suites/466 checks, failure/runtime/missing đều 0, exit 0; responsive 3 kích thước, audit 85, smoke 13 đạt. __v36_validation_evidence.json là bằng chứng lịch sử V36, không thay bằng số liệu V37.
- Checkout tiếp tục tại D:\anh hương\o 1\saoluu3012\Desktop\Học Cùng Bé. Branch local codex/thinking-match-pilot từ SHA V36 trên; HEAD/main/origin/main đều SHA V36 tại lần kiểm tra cuối. Game chưa commit/push/deploy. Các file untracked cũ được giữ.

## Nguyên mẫu V37 local

- Lớp 1 → Trò chơi tư duy → Tìm cặp giống nhau. Bốn cặp/tám thẻ, trộn mỗi ván, đếm lượt ghép, phản hồi nhẹ nhàng, chơi lại. Không đếm ngược, không xếp hạng hoặc suy ra năng lực của trẻ.
- Module thinking-games.js và CSS riêng, UI trong index.html; script.js chỉ thêm điều hướng và cầu nối kiểm tra giới hạn hiện có. Đổi màn hình/bé/tài khoản xóa ván đang chơi; sự kiện guest lặp cùng ngữ cảnh không làm mất ván.
- Ván chỉ ở RAM. Không lưu kết quả, thêm course, history, quota, schema hay cloud payload. Không tính thời gian trò chơi vào thời gian học của môn cũ. Giới hạn phụ huynh được kiểm tra khi bắt đầu ván; nguyên mẫu chưa có đo thời gian hoặc cơ chế hết giờ riêng trong ván.
- Cache candidate hoc-cung-be-v37 precache hai asset mới. Production vẫn hoc-cung-be-v36.
- Giữ progressVersion=2, scoring/unlock và dữ liệu trẻ; Auth/Firestore rules/schema/cloud-sync/merge, nội dung ba môn không đổi. Không ads/tracking/dependency/framework mới hoặc EN-41+.

## Kiểm chứng mới của nguyên mẫu

- Regression 30 suites/497 checks; failures=0, runtimeErrors=0, missingSuites=[], realExitCode=0.
- Trình duyệt thao tác thật 24/24, exit 0: chuột, Enter, hoàn thành ván, ba viewport 375x812/768x1024/1280x900, nâng cấp actual V36 worker→V37 và legacy 8/10/history/thời gian/quota còn nguyên, cold reload offline và lật thẻ offline; runtime 0.
- Smoke luồng học/PWA 13/13 exit 0; responsive bài học 3/3 exit 0; audit media/PWA/security 85/85 exit 0. Tất cả dùng profile/fixture riêng, không xóa dữ liệu người dùng.
- Lỗi thực tế sự kiện auth guest lặp làm mất ván đã tái hiện và sửa; bằng chứng trước sửa __v37_auth_failure_before_fix.json. Hai lỗi công cụ (Enter thiếu ký tự và giới hạn ảnh CDP 1MB) đã lưu riêng và sửa runner, không hạ gate.
- Chi tiết file/hash/kết quả: __v37_validation_2026-10-16.md và __v37_validation_evidence.json. Báo cáo chung __full_regression_report.json hiện là V37.

## Giới hạn và bước tiếp theo

Chưa kiểm tra Firebase đăng nhập/sync thực bằng tài khoản test, thiết bị mobile vật lý, Safari/iOS hoặc trẻ dùng thử. Bài test auth/sync dùng fixture; mobile dùng Chrome emulation. Chưa phát hành V37. Review trực quan và cho thử một ván trước khi quyết định mở rộng/phát hành. Không thêm game, ads hay persistence mới nếu chưa nằm trong nhiệm vụ.

Bản PM-1.0 trong sources/ và báo cáo V36 cũ là tài liệu lịch sử, không chỉnh sửa nguồn đồng bộ.


## Phê duyệt phát hành V37 — 16/10/2026

Chủ dự án yêu cầu “phát hành luôn” sau bàn giao nguyên mẫu. Đã đối chiếu hash tất cả source/runner với bằng chứng 30 suites/497 checks đạt; không có thay đổi source sau gate. Cho phép commit/push/deploy V37. Các mục “chưa phát hành” phía trên mô tả thời điểm bàn giao; kết quả production sau phát hành được ghi trong __v37_production_evidence.json. Chưa có bằng chứng production V37 tại thời điểm tạo commit này. Giữ giới hạn nguyên mẫu: không lưu kết quả/thời gian game vào báo cáo môn học, chưa Firebase E2E hoặc thiết bị thật.


## Production V37 xác minh sau phát hành — 16/10/2026

V37 đã commit/push/deploy: 3087c529d41fe90461449c5e62943eb143c67e9a. Pages run 38927546608 completed/success. Tám asset production HTTP 200 và bytes khớp release; cache hoc-cung-be-v37. Smoke production 18/18, failure 0, exit 0; thao tác mở game/lật thẻ online và sau cold reload offline, bài học/leave-dialog, dữ liệu sentinel giữ nguyên, không ghi nhận runtime error. Bằng chứng __v37_production_evidence.json. Các đoạn “chỉ local/chưa phát hành” ở trên là trạng thái lịch sử trước yêu cầu “phát hành luôn”, được thay bằng mục này. Game hiện có tại Lớp 1 → Trò chơi tư duy. Giới hạn chưa test thiết bị thật/Firebase E2E vẫn còn; ván không lưu kết quả/thời gian vào báo cáo môn học. Tài liệu và bằng chứng sau deployment được cập nhật local, không sửa source đã phát hành.


## V38 local — mở rộng theo yêu cầu 16/10/2026

Production đã xác minh V37 vẫn tại SHA 3087c529d41fe90461449c5e62943eb143c67e9a. Branch hiện hành codex/thinking-playground, HEAD cùng SHA; V38 chưa commit/push/deploy. Yêu cầu mới: thêm trò đa dạng và giao diện/đồ họa đẹp hơn, không tự suy ra quyền phát hành bản mới từ phê duyệt V37 trước đó.

Đã có Xứ sở tư duy với năm trò: ghép cặp cũ + Đoàn tàu quy luật, Thám tử tí hon, Khu vườn biết đếm, Bậc thang cầu vồng. Bốn trò mới có năm chặng, đề/đáp án trộn, replay và phản hồi không áp lực. Thư viện thẻ nhiều màu, minh họa CSS/emoji local, nút lớn, responsive/reduced motion. Module thinking-playground.js/playground.css; candidate cache V38 precache cả hai. Không thêm dependency hoặc tài nguyên bên ngoài.

Gate V38 hiện tại: 31 suites/527 checks, fail/runtime 0, missing=[], exit 0; click/game/upgrade V37/offline 124/124 exit0, runtime0; PWA/luồng học 13/13; responsive 3 kích thước; audit85/85. Đã xem ảnh thực và sửa CSS hidden + vùng chạm trước final run. Giữ toàn bộ suite cũ, thêm30 check. Không thay progressVersion=2/rules/schema/merge/scoring/unlock/curriculum hoặc dữ liệu trẻ.

Ván chỉ RAM, không đưa kết quả/thời gian game vào báo cáo môn học. Giới hạn settings chỉ ở đầu ván như V37; chưa Firebase E2E/thiết bị thật/Safari/trẻ dùng thử. Chi tiết file, giới hạn và bước review: __v38_validation_2026-10-16.md; bằng chứng/hash __v38_validation_evidence.json. Các mục V37 ở trên là lịch sử đã phát hành; V38 mới là bản local chưa phát hành.


## V39 local — Mỹ thuật tổng hợp, 16/10/2026

Yêu cầu mới nhất: thêm Mỹ thuật lớp 1, tổng hợp cả Kết nối tri thức, Chân trời sáng tạo và Cánh Diều; có gấp hình/thủ công. Đã thêm Xưởng sắc màu với12 bài/48 hình SVG riêng, nhóm màu/hình, gấp giấy, thủ công; có vật liệu, an toàn, bốn bước, tự nhận xét và ý tưởng mở rộng. Giữ năm trò V38.

Nguồn mới chỉ đủ đối chiếu giới thiệu/nhóm chủ đề, chưa từng bài/trang của toàn bộ ba SGK. Không tự nhận là bản bám sát hoàn chỉnh hoặc bài gấp cụ thể trong sách. __v39_art_curriculum_review.md ghi URL, mức xác minh, liên hệ từng bài và phần mở rộng tự viết. UI phụ huynh cũng nêu giới hạn này.

Mỹ thuật không vào COURSE_IDS/Firestore; phiên chỉ RAM, chưa lưu tiến độ, ảnh, thời gian hoặc tự nhận xét. Không chấm điểm, không biến bấm xong thành năng lực/hoàn thành thật; không đưa vào báo cáo ba môn. progressVersion=2, dữ liệu/schema/rules/merge/scoring/unlock giữ nguyên. Settings kiểm tra đầu/chuyển bước.

Final gate local:32 suites/551 checks, fail/runtime0, missing=[], exit0; browser237/237/runtime0/exit0; PWA smoke13/13; responsive3; audit85/85; diff/compile exit0. Browser12 bài tại3 viewport, giữ dữ liệu actual V37→V39 và offline đạt. Chưa sư phạm/làm thật với trẻ, mobile vật lý/Safari/Firebase E2E.

Production vẫn V37 SHA3087c529d41fe90461449c5e62943eb143c67e9a. Branch codex/thinking-playground; V38/V39 chưa commit/push/deploy. Bằng chứng __v39_validation_evidence.json, bàn giao __v39_validation_2026-10-16.md. Cần review/làm thử trước phát hành; việc lưu/sync Mỹ thuật cần phê duyệt mở rộng dữ liệu riêng. Các mục V38/V37 phía trên là lịch sử.


## Phê duyệt phát hành V39 — 16/10/2026

Chủ dự án yêu cầu “phát hành đi” sau bàn giao. Đã xác nhận hash source/runner khớp gate 32 suites/551 checks và browser237 checks đạt. Cho phép commit/push/deploy V39 (gồm cả năm trò V38). Các mục chưa phát hành phía trên là lịch sử. Kết quả production sau triển khai được ghi riêng tại __v39_production_evidence.json; chưa có bằng chứng production tại thời điểm tạo commit này. Giữ giới hạn nội dung SGK tham khảo theo chủ đề và Mỹ thuật chưa lưu/sync tiến độ.
