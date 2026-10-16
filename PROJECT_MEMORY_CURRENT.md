# Project Memory hiện hành — Học Cùng Bé

Tài liệu PM-3.0, ngày 16/10/2026 UTC+7. Production: V36 đã phát hành; phần mềm local: nguyên mẫu V37.

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
