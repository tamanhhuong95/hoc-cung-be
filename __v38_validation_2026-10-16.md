# V38 — Xứ sở tư duy, bản local 16/10/2026

Đã thực hiện yêu cầu thêm trò đa dạng và cải thiện giao diện, đồ họa. Production vẫn V37 SHA 3087c529d41fe90461449c5e62943eb143c67e9a. Branch codex/thinking-playground; V38 chưa commit/push/deploy. Các thay đổi tài liệu sau phát hành V37 và untracked có trước được giữ nguyên.

## Nội dung và giao diện

Năm trò: Tìm cặp giống nhau (giữ mô hình/luật V37), Đoàn tàu quy luật (AB, AAB, ABC), Thám tử tí hon (chạm hình duy nhất khác nhóm), Khu vườn biết đếm (3–9 vật), Bậc thang cầu vồng (chạm 4–6 số từ bé đến lớn trong phạm vi 1–10). Mỗi trò mới có năm chặng, sinh đề và trộn lựa chọn khi chơi lại; sai được thử tiếp, không phạt hoặc đếm ngược. Không tuyên bố đánh giá năng lực.

Thư viện thẻ riêng từng màu, nền chuyển màu/cầu vồng, bạn Gấu, minh họa thẻ ghép, toa tàu và khu vườn, nút nổi lớn, trạng thái đúng và tiến độ chặng. Dùng CSS/emoji có sẵn trên thiết bị; không thư viện hoặc tài nguyên mạng mới. Hình emoji có thể khác giữa hệ điều hành. Bố cục 3 cột trên desktop, 2 cột và trò ghép cặp nổi bật trên mobile. Có focus bàn phím, status đọc màn hình và giảm chuyển động.

## File thay đổi

- thinking-playground.js và playground.css: bốn trò mới, UI thư viện và điều hướng nội bộ. Model thuần để kiểm thử, ván active riêng trong RAM; giao diện không công bố đáp án active.
- index.html: thẻ trò và sân chơi; service-worker.js: cache candidate hoc-cung-be-v38, precache hai file mới.
- script.js/parent-tools.js/child-settings.js: chỉ literal phiên bản/cache, không đổi luồng học hoặc settings.
- __run_browser_tests.py: giữ toàn bộ suite cũ, thêm 30 check (31 suites/527 checks). Runner mới __run_playground_browser.py và __run_v38_pwa_smoke.py; __audit_english_videos.py cập nhật cache mong đợi.
- README/PROJECT_MEMORY_CURRENT.md và báo cáo/evidence cập nhật theo kết quả thật. thinking-games.js, thinking-games.css, styles.css, dữ liệu ba môn, Auth/Cloud Sync/Firestore rules không sửa.

## Kiểm chứng cuối trên source hiện tại

| Kiểm tra | Kết quả thật | Exit |
|---|---|---|
| Full regression | 31 suite / 527 check / fail 0 / runtime 0 / missing=[] | 0 |
| Click thực, năm trò, cập nhật, offline | 124 check / fail 0 / runtime 0 | 0 |
| Luồng học cũ, dialog, PWA/offline | 13/13 | 0 |
| Responsive bài học | 375x812, 768x1024, 1280x900 đạt | 0 |
| Audit media/PWA/security | 85/85 | 0 |
| Python compile / git diff --check | đạt | 0 |

Browser test hoàn thành năm chặng của cả bốn trò mới bằng click thực ở cả ba viewport, replay, ghép cặp và phím Enter. Kiểm tra vùng chạm >=44px, không tràn ngang và gallery thực sự ẩn khi chơi. Đã xem ảnh desktop/mobile của gallery, quy luật, tìm khác biệt, đếm và thứ tự.

Nâng cấp dùng actual bytes commit V37 ở profile test riêng rồi update worker V38; progress legacy 8/10, lịch sử, thời gian, quota và sentinel còn nguyên. Cold reload offline mở và chơi cả năm trò. Không xóa hoặc dùng profile dữ liệu thật.

Đã sửa lỗi được đo: nút back mới 42,5px -> min48px; CSS display:grid lấn hidden làm gallery còn hiện trong ván -> scoped [hidden] display:none. Tăng kiểm tra computed style; sau sửa full regression và browser test đều chạy lại đạt. Runner thử nghiệm ban đầu thay nhầm tên hook lịch sử HocCungBeV36 đã sửa, không đổi source hoặc hạ gate.

## Dữ liệu, giới hạn và bàn giao

Giữ progressVersion=2, localStorage keys, scoring/unlock, curriculum, Auth/Firestore schema/rules/merge. Không thêm course, lưu kết quả, history, sync, tracking, ads hoặc EN-41+. Ván mới xóa khi rời/đổi trò/bé/tài khoản; auth guest cùng ngữ cảnh giữ ván. Settings hiện có kiểm tra khi bắt đầu; thời gian game vẫn không ghi vào báo cáo môn học và chưa có timer kiểm soát thời gian trong ván.

Giới hạn: Chrome emulation, chưa thiết bị vật lý/Safari/iOS hoặc Firebase tài khoản thật E2E; chưa trẻ dùng thử. Production vẫn V37. Bước tiếp theo: review/chơi thử bản V38 local trước quyết định phát hành. Trạng thái git đầy đủ __v38_git_status.txt; chi tiết/hash __v38_validation_evidence.json.

Chạy tuần tự: py __run_browser_tests.py; py __run_playground_browser.py; py __run_v38_pwa_smoke.py; py __run_english_responsive.py; py __audit_english_videos.py. Các runner V36/V37 là lịch sử, không chạy vào cache V38.
