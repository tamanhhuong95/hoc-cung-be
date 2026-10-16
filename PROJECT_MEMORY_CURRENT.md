# Project Memory hiện hành — Học Cùng Bé

Tài liệu PM-2.2, cập nhật 16/10/2026 UTC+7. Phần mềm: V36 RC local; chưa phát hành.

Nguồn: kiểm tra trực tiếp checkout ổ D, diff và báo cáo kiểm thử trong phiên này; xem __v36_validation_2026-10-16.md. Bản PM-1.0 ngày 14/10 trong sources/ là tham chiếu lịch sử, không sửa.

- main; HEAD/origin/main lưu tại máy = f5fbebe5aa035522eb69bfbb45b41459805e95dd. Không fetch, commit, push, deploy trong phiên. Production V35 là thông tin bàn giao, chưa xác minh production trực tiếp.
- Worktree tiếp tục V36 có sẵn: Home Học tiếp theo bé, marker bài tiếp, CTA kết quả và xác nhận rời quiz, entry Báo cáo tuần, lời giải thích quota guest.
- Đã sửa blocker thực tế: selector data-course nhận body; vòng course-changed/refresh tự phát sinh khi đọc ba môn; mất context topic/level; phân loại bài chưa học là đã học gần đây; xung đột đích Home với level handler; ghi đè CTA đăng nhập khi guest hết lượt.
- Final local regression: 29 suites/466 checks/0 failures/0 runtime errors/missingSuites=[]/exit=0. Responsive 3 kích thước đạt; audit 85 checks đạt; smoke click vật lý mobile/offline 13 checks đạt. Báo cáo timeout/tách nhóm trước fix không phải final gate.
- Giữ progressVersion=2; không đổi rules/schema/cloud-sync/merge/scoring/unlock/nội dung học. Không EN-41+, ads/tracking/framework/dependency mới. Test dùng profile/fixture riêng, không reset dữ liệu thật.
- README và báo cáo validation chứa chi tiết file, kết quả, giới hạn và lệnh chạy lại. JSON full regression được lưu ở __full_regression_report.json; báo cáo smoke/audit/responsive lưu riêng.
- Điểm dừng: local đã kiểm thử, cần review trước mọi commit/push/deploy theo yêu cầu chủ dự án. Không tự mở hạng mục mới hoặc coi V36 đã phát hành.
- Chưa xác minh Firebase E2E thực, thiết bị mobile thật, nâng cấp profile V35 thật, in trực quan mới hoặc production SHA/cache. Sau khi được phép phát hành, phải xác minh production và cập nhật Memory theo bằng chứng.

- Review tiếp ngày 16/10: thêm 4 check (tổng 466); đã tái hiện 3 lỗi auth/sync rồi sửa listener trong script.js, và tái hiện lỗi Tab của dialog rồi thêm focus trap, Escape/ở lại trả focus. Auth event ẩn ngay thẻ cũ trước khi render lại. parent-auth.js, child-profiles.js, rules và cloud-sync vẫn không đổi. Smoke có thêm 3 check phím thật (tổng 13). Kết quả mới được chạy trong lần tiếp tục này, không lấy PASS cũ thay thế. Điểm dừng trước commit/push/deploy giữ nguyên.

## Quyết định tiếp theo — 16/10/2026

Chủ dự án đã đồng ý đề xuất: chốt và phát hành V36, xác minh production, sau đó triển khai một trò chơi tư duy mẫu “Tìm cặp giống nhau” cho lớp 1. Phạm vi này cho phép commit/push/deploy V36; điểm dừng trước commit của giai đoạn review đã được thay bằng quyết định mới. Tại thời điểm ghi mục này mới chuẩn bị phát hành, chưa có SHA/deployment V36 được xác minh. Trò chơi mẫu sẽ giữ nguyên scoring/unlock các môn, schema/rules/merge; không mở thêm thư viện trò chơi, ads hoặc tracking.
