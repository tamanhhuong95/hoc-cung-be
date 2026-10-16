# Bàn giao nguyên mẫu trò chơi — 16/10/2026

## Kết quả

V36 đã phát hành tại SHA f600cbfb2a1adc5bdf3d28264830bd657c13b7fd. [GitHub Pages run](https://github.com/tamanhhuong95/hoc-cung-be/actions/runs/38924257691) completed/success. Bốn asset production khớp bytes commit; production smoke 13/13 exit 0, cache V36, offline đạt. Xem __v36_production_evidence.json.

Nguyên mẫu V37 local trên branch codex/thinking-match-pilot: Lớp 1 → Trò chơi tư duy → Tìm cặp giống nhau. Tám thẻ/bốn cặp, trộn thẻ, đếm lượt, phản hồi đúng/sai, kết quả và chơi lại. Có bàn phím, nhãn đọc màn hình, nút lớn, reduced-motion. Không giới hạn thời gian ván hoặc xếp hạng.

## File và phạm vi

- thinking-games.js, thinking-games.css: mô hình ván và giao diện riêng; hủy timer khi rời/đổi bé/tài khoản.
- index.html: entry và màn hình; script.js: điều hướng/sự kiện màn hình/cầu nối settings.
- service-worker.js: candidate V37 và precache hai asset mới; parent-tools.js, child-settings.js chỉ cập nhật literal phiên bản/cache.
- __run_browser_tests.py thêm 31 check, giữ toàn bộ 29 suite cũ; __run_thinking_game_browser.py kiểm tra thao tác, cập nhật và offline; __run_pwa_smoke.py giữ runner V36 lịch sử; __audit_english_videos.py cập nhật cache mong đợi.
- README/Memory/báo cáo và JSON bằng chứng cập nhật trạng thái thực tế. styles.css không đổi trong nguyên mẫu.

Không đổi progressVersion=2, curriculum, scoring/unlock, Firestore rules/schema/merge hoặc khóa lưu. Ván nằm trong RAM, không thêm history/quota/course/sync. Giới hạn settings kiểm tra ở đầu ván; thời gian game chưa được đo hoặc đưa vào báo cáo học, không gán nhầm vào môn cũ.

## Kết quả thật

| Kiểm tra | Kết quả | Exit |
|---|---|---|
| Full regression | 30 suites / 497 checks / 0 fail / 0 runtime / missing=[] | 0 |
| Game, nâng cấp V36→V37, offline | 24 checks / 0 fail / 0 runtime | 0 |
| Luồng học, bàn phím dialog, PWA/offline | 13 checks / 0 fail | 0 |
| Responsive bài học | 375x812, 768x1024, 1280x900 đều đạt | 0 |
| Media/PWA/security audit | 85 checks / 0 fail | 0 |

Đã xem ảnh intro/board/kết quả; không tràn ngang và nút thẻ ≥44px ở cả ba kích thước. Kiểm tra nâng cấp dùng bytes actual commit V36, profile test riêng với dữ liệu legacy 8/10, history, thời gian, trial và sentinel. Dữ liệu còn nguyên sau cập nhật/chơi/offline. Không dùng profile người dùng thật.

Lỗi auth guest lặp reset ván được tái hiện trước fix; thêm check bảo vệ rồi toàn bộ gate chạy lại đạt. Lỗi runner Enter thiếu ký tự và ảnh vượt giới hạn WebSocket được sửa ở runner; giữ báo cáo lỗi ban đầu, không giảm check/gate.

## Git, giới hạn và tiếp theo

HEAD/main/origin/main: f600cbfb2a1adc5bdf3d28264830bd657c13b7fd. V37 là thay đổi local chưa commit/push/deploy; production vẫn V36. File untracked trước đây được giữ, không staging toàn bộ thư mục. Snapshot trạng thái git trong __v37_git_status.txt.

Chưa Firebase E2E tài khoản thật, mobile vật lý, Safari/iOS hay trẻ dùng thử. Giới hạn thời gian không được theo dõi trong ván prototype. Review và thử một ván trước quyết định phát hành/mở rộng. Bằng chứng/hash tại __v37_validation_evidence.json; giữ nguyên bằng chứng V36 lịch sử.

Chạy lại tuần tự: py __run_browser_tests.py; py __run_thinking_game_browser.py; py __run_pwa_smoke.py; py __run_english_responsive.py; py __audit_english_videos.py. Không chạy nhiều Chrome suite cùng lúc.


## Production V37 xác minh sau phát hành — 16/10/2026

V37 đã commit/push/deploy: 3087c529d41fe90461449c5e62943eb143c67e9a. Pages run 38927546608 completed/success. Tám asset production HTTP 200 và bytes khớp release; cache hoc-cung-be-v37. Smoke production 18/18, failure 0, exit 0; thao tác mở game/lật thẻ online và sau cold reload offline, bài học/leave-dialog, dữ liệu sentinel giữ nguyên, không ghi nhận runtime error. Bằng chứng __v37_production_evidence.json. Các đoạn “chỉ local/chưa phát hành” ở trên là trạng thái lịch sử trước yêu cầu “phát hành luôn”, được thay bằng mục này. Game hiện có tại Lớp 1 → Trò chơi tư duy. Giới hạn chưa test thiết bị thật/Firebase E2E vẫn còn; ván không lưu kết quả/thời gian vào báo cáo môn học. Tài liệu và bằng chứng sau deployment được cập nhật local, không sửa source đã phát hành.
