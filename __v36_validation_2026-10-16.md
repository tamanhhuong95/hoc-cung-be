# V36 — Kiểm chứng local và bàn giao

Ngày: 16/10/2026 (UTC+7). Tài liệu: VAL-1.1. Phần mềm: V36 release candidate, chưa phát hành.

## Trạng thái và phạm vi

- Repo: tamanhhuong95/hoc-cung-be, checkout trực tiếp tại đường dẫn ổ D được chủ dự án chỉ định.
- Branch: main. HEAD và origin/main lưu tại máy: f5fbebe5aa035522eb69bfbb45b41459805e95dd. Không fetch/reset/checkout từ GitHub.
- Cache local: hoc-cung-be-v36. Không tăng V37. Không commit, stage, push hoặc deploy.
- Memory đồng bộ PM-1.0 ngày 14/10 dừng ở báo cáo V31/kế hoạch V32. Repo thực tế có weekly-report.js, baseline V35 và V36 modified; yêu cầu V36 mới nhất được áp dụng. Không sửa tài liệu trong sources/.

## Công việc trong phiên này

1. Kiểm tra repo/branch/HEAD/origin/main/remote/status trước khi sửa; bảo toàn 9 file modified và các file untracked có sẵn.
2. Sửa selector chặn rời quiz: body có data-course nên selector chung nhận nhầm cả nút ở lại/rời bài. Chỉ nhận button[data-course]. Đã kiểm chứng DOM và click vật lý.
3. Sửa vòng refresh: Home đọc progress ba môn làm setActiveCourse phát course-changed, tự lên lịch render vô hạn. Chặn lịch mới trong render, gộp timer, render theo màn hình đang thấy và khôi phục topic/level sau lần đọc gợi ý.
4. Gợi ý bài mới dùng “Bắt đầu học”; chỉ coi incomplete có lastPlayedAt là đã học gần đây; ưu tiên next sau bài hoàn thành. Home so sánh hoạt động gần nhất của từng môn. Tách thuộc tính đích Home khỏi handler level-card để đổi môn trước khi mở bài.
5. Giữ ưu tiên “Đăng nhập để học tiếp” khi guest hết 2 lượt. Check DOM mới đã tái hiện lỗi ghi đè CTA trước khi sửa.
6. Giữ toàn bộ suite cũ; thêm 15 check hành vi V36. Test điều hướng thực hiện xác nhận rời bài và vẫn kiểm tra màn hình đích. Nâng gate lên ít nhất 29 suites/466 checks.
7. Runner giữ JSON evidence, có deadline CDP; nhận chính report DOM qua HTTP loopback (chỉ trong runner test). Các kiểm tra 7 video nguyên bản được khôi phục đầy đủ. Không đưa tracking vào sản phẩm.

## Kết quả kiểm chứng

| Nhóm | Kết quả | Exit code |
|---|---|---|
| Full browser regression, chạy nguyên bộ cùng phiên + refresh | 29 suites, 466 checks, failed=0, runtimeError=0, missingSuites=[] | 0 |
| Responsive | 375x812, 768x1024, 1280x900 đều đạt, 0 failure | 0 |
| Audit media/PWA/security hiện có | 85 checks, 0 failure; 7 video, tổng 1.474.141 byte | 0 |
| Click vật lý mobile + offline/PWA | 13 checks, 0 failure; /hoc-cung-be/, cache V36, reload offline, giữ sentinel local, mở bài Tiếng Việt offline | 0 |

Tất cả test ghi dữ liệu dùng profile Chrome riêng và fixture test; không mở/xóa/reset profile trình duyệt thật. Regression dùng mock tài khoản/hồ sơ theo runner hiện có; không phải kiểm thử đăng nhập thật hay ghi Firestore production.

Full regression ban đầu trên cây V36 nhận bàn giao: 28 suites/451 checks/50 failures, runtime=0, missing=[]. Các lần timeout và thử tách nhóm chỉ là dữ liệu chẩn đoán trước fix; không được dùng làm kết quả final. Sau sửa vòng render, nguyên bộ đã chạy xong. Sau bổ sung check kết quả, một lỗi guest CTA được tái hiện rồi sửa; mốc trước review là 29/462; kết quả sau review là 29/466 trong bảng trên.

## File và dữ liệu

- Sửa chức năng trong phiên này: script.js.
- Sửa kiểm thử trong phiên này: __run_browser_tests.py; thêm suite V36 tương tác, chống vòng refresh và các trạng thái kết quả.
- Cập nhật bàn giao: README.md, PROJECT_MEMORY_CURRENT.md, báo cáo này; lưu JSON/log kết quả và smoke helper.
- 9 file vốn đã modified khi bắt đầu vẫn được giữ: README.md, __audit_english_videos.py, __run_browser_tests.py, __run_english_responsive.py, child-settings.js, parent-tools.js, script.js, service-worker.js, styles.css. Không nhận các thay đổi có sẵn là do phiên này tạo ra.
- Giữ nguyên HTML/CSS/JS thuần, PWA, localStorage, Firebase Auth/Firestore, progressVersion=2, scoring/unlock. firestore.rules, cloud-sync.js, data/ và index.html không đổi so với HEAD.
- Không thêm EN-41+, tracking, quảng cáo, dependency hay schema/rules/migration. Không đổi merge/sync.
- Thư mục New folder/ chứa PDF và 3 báo cáo untracked có sẵn được giữ nguyên.

## Giới hạn và điểm dừng

- Chưa commit/push/deploy; chưa xác minh SHA/cache/luồng trên production, và chưa kiểm thử nâng cấp từ profile V35 thật của người dùng.
- Chưa chạy E2E bằng tài khoản Firebase thật, OTP/Phone Auth thật hoặc thiết bị Android/iOS thật; bộ regression dùng mock và Chrome headless. Không coi suite tự kiểm tra auth/cloud là bằng chứng kiểm thử server production.
- Không bổ sung kiểm thử in trực quan mới trong phiên này; weekly-report.js không đổi và suite hiện có vẫn đạt.
- PWA smoke xác nhận đường dẫn con local và offline; không thay thế production smoke sau một lần deploy được phép.
- Bước tiếp theo: review diff và các evidence; chờ chủ dự án quyết định commit/push/deploy. Khi được cho phép, phát hành bình thường, xác minh SHA/cache V36 và các luồng chính trên production, bảo toàn dữ liệu trẻ.

## Lệnh chạy lại

```text
py __run_browser_tests.py
py __run_english_responsive.py
py __audit_english_videos.py
py __run_v36_smoke.py
```

Python mặc định trỏ shortcut Store trên máy này, nên dùng py. Full runner cần requests, websockets và Chrome như môi trường hiện có; không cài thêm dependency trong phiên.

Ghi chú lần chốt trước review: chạy đồng thời nhiều trình duyệt có một lần full runner lỗi tải tài nguyên JS local; không dùng lần đó làm PASS. Sau khi các phiên khác kết thúc, `py __run_browser_tests.py` chạy riêng tại cổng mặc định 8767/9342 đã đạt 29/462, fail=0, runtime=0, missing=[], exit=0. JSON final là lần chạy riêng này; nên chạy các gate lần lượt trên máy này.

## Review tiếp — 16/10/2026, VAL-1.1

- Tái hiện bằng test DOM/event trong profile riêng: login chưa hiện thẻ Học tiếp, logout còn thẻ của bé cũ, cloud-synced dựng lại level grid làm mất marker. Lần trước fix: 29 suites/465 checks/3 failures, runtime=0, missing=[], exit=1. Evidence: __v36_review_failure_before_fix.json.
- Sửa tối thiểu trong script.js: auth-state ẩn ngay thẻ cũ rồi làm mới; cloud-synced làm mới marker/gợi ý. Không sửa SDK, tài khoản, schema, merge hoặc khóa dữ liệu.
- Tái hiện lỗi Tab ở dialog: 29 suites/466 checks/1 failure, runtime=0, missing=[], exit=1. Evidence: __v36_keyboard_failure_before_fix.json.
- Dialog giữ Tab/Shift+Tab trong hai nút; Escape và “Tiếp tục làm” trả focus về nút mở; xác nhận rời bài vẫn dùng điều hướng cũ, cờ replay được khôi phục bằng finally.
- Chạy lại nguyên bộ sau sửa: **29 suites/466 checks/0 failures/0 runtime errors/missingSuites=[]/exit=0**. Không bỏ suite/assertion cũ; coverage guard tăng lên 466.
- Smoke Chrome headless có click và phím thật: **13 checks/0 failures/exit=0**, gồm Tab, Shift+Tab, Escape và offline tại đường dẫn con. Responsive ba kích thước và audit 85 checks đều chạy lại tuần tự, exit=0.
- File đổi trong lần tiếp tục: script.js, __run_browser_tests.py, __run_v36_smoke.py, README.md, PROJECT_MEMORY_CURRENT.md, báo cáo/evidence. Bộ log 462 cũ là lịch sử; JSON __full_regression_report.json và evidence hiện hành mới là kết quả sau review.
- Review không chứng minh Firebase E2E thật hoặc production đã đúng. Các giới hạn và điểm dừng nêu ở trên giữ nguyên. Không stage/commit/push/deploy; bước tiếp theo vẫn là duyệt diff trước phát hành được cho phép.
