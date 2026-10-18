# V45 local — Nông trại mô hình có chuyển động

Ngày 18/10/2026 (UTC+7). Chưa commit, push hoặc deploy. Production vẫn V44.

## Đã làm

- Cảnh nông trại nhìn chéo với luống đất, đồng cỏ, chuồng và hồ nước; cây và vật nuôi mua trong ứng dụng xuất hiện trực tiếp trong cảnh.
- 8 cây/hoa và 7 loài vật nuôi dùng hình mô hình chân thực; vật nuôi có 4 tư thế bước đi, đổi hướng và di chuyển trong đồng cỏ.
- Dụng cụ khám phá, tưới nước, cho ăn; hiệu ứng chỉ chạy sau khi lưu thành công. Cây mới lần lượt chờ 6/12/18 giây để mọc mầm, ra nụ, nở hoa. Thời gian rút ngắn được giải thích trong trò chơi. Cây V44 đã trưởng thành được giữ hình trưởng thành.
- Nút dừng/bật chuyển động; mặc định theo thiết lập giảm chuyển động của máy, người dùng có thể chủ động bật. Rời màn hình/ẩn tab dừng hoạt ảnh; đổi bé/tài khoản hủy giao diện cũ.
- Cuộn bản đồ và nút chuyển giữa vườn hoa/đồng cỏ trên điện thoại. Giữ ví, giá mua, phần thưởng học tập và kho đồ; không tạo thưởng từ việc chăm sóc.
- Vườn minh hoạ riêng chỉ dùng RAM, có nhãn rõ ràng; không ghi tiền/cây mẫu vào hồ sơ.

## Tệp thay đổi

- Giao diện/cảnh: farm-ui.js, living-farm.js, living-farm.css, index.html.
- Trạng thái: farm-core.js thêm thời gian lớn của cây, tương thích farmVersion=1 và dữ liệu V44; không đổi khóa lưu.
- Hình ảnh: assets/farm/living-farm-background.png, animal-walk-atlas.png, plant-atlas.png. Nguồn tạo và bản tóm tắt prompt trong __v45_asset_manifest.json. Các PNG gốc được sao chép nguyên vẹn; CSS chọn khung hình.
- PWA: service-worker.js và nhãn cache trong script.js, child-settings.js, parent-tools.js; precache đủ ba ảnh và hai module cảnh mới.
- Kiểm tra: __test_farm_core.cjs, __run_farm_browser.py, __run_farm_upgrade.py, __run_farm_responsive.py, __run_browser_tests.py, __audit_english_videos.py; có bản runner tên living_farm tương ứng. Giữ các kiểm tra cũ, cập nhật selector/cảnh và thêm trường hợp mới.
- Tài liệu: README.md, PROJECT_MEMORY_CURRENT.md, báo cáo và bằng chứng V45. Các sửa tài liệu V43/V44 có sẵn và hàng loạt tệp untracked cũ được giữ nguyên.

## Kết quả kiểm tra thật

| Kiểm tra | Số mục | Fail | Runtime | Missing suites | Exit |
|---|---:|---:|---|---|---:|
| Full browser regression (36 suites) | 680 | 0 | 0 | [] | 0 |
| Farm core and timed growth (1 suites) | 70 | 0 | 0 | [] | 0 |
| Farm physical browser, motion, offline (1 suites) | 74 | 0 | 0 | [] | 0 |
| V44 upgrade, art and games | 278 | 0 | 0 | Không áp dụng/báo riêng | 0 |
| Media/PWA/security audit | 85 | 0 | Không báo riêng | Không áp dụng/báo riêng | 0 |
| English responsive | 3 | 0 | Không báo riêng | Không áp dụng/báo riêng | 0 |

Nông trại có kiểm tra hiển thị/cỡ nút ở 375×812, 768×1024 và 1280×900; mua/hủy/thiếu tiền, khóa chống mua đồng thời, lỗi lưu, tách UID/bé, dữ liệu hỏng không ghi đè, offline và học bài vẫn giữ điều hướng. Nâng cấp dùng đúng SHA V44 7b45bd0bd984e92ba09a7b7017ec72c5033e8c2e; ví/kho đồ/cây trưởng thành cũ và dữ liệu học /10, history, thời gian, quota được bảo toàn.

Báo cáo chi tiết: __v45_validation_evidence.json, __full_regression_report.json, __v45_core_report.json, __v45_farm_browser_report.json, __v45_game_browser_report.json, __v45_responsive_report.json, __video_audit_report.json.

## Giới hạn

- Chỉ kiểm tra Chrome và mobile giả lập; chưa Safari/iOS, thiết bị thật hoặc đăng nhập/sync Firebase thật trong lượt này. Nông trại vẫn lưu riêng trên thiết bị.
- Ba ảnh tổng 7,558,668 byte (~7.56 MB); tải lần đầu nặng hơn giao diện cũ, các ảnh đã được kiểm tra có trong cache để dùng offline.
- Đây là cảnh mô phỏng bằng nền và khung chuyển động, chưa có môi trường 3D, thu hoạch hay sinh sản. Thời gian cây lớn không phải thời gian sinh học thật.

## Git và bước tiếp theo

Branch codex/farm-pilot; HEAD và origin/main 7b45bd0bd984e92ba09a7b7017ec72c5033e8c2e. Chưa tạo commit mới, chưa push/deploy. Cache v45 chỉ là candidate local. Trạng thái đầy đủ trong __v45_git_status.txt.

Xem thử http://127.0.0.1:8789/__living-farm-preview.html (vườn mẫu), hoặc http://127.0.0.1:8789/ (ứng dụng thật → Nông trại). Duyệt thiết kế và thao tác trước; chỉ phát hành khi chủ dự án yêu cầu. Khi phát hành phải xác minh production và nâng cấp offline trên đúng commit được đưa lên.


## Phê duyệt phát hành V45 — 18/10/2026

Chủ dự án yêu cầu “phát hành đi” sau khi duyệt nông trại mô hình local. Cho phép commit/push/deploy V45. Đã đối chiếu SHA-256 12 tài nguyên với bằng chứng kiểm thử; không đổi source sau gate. Production vẫn V44 tại thời điểm chuẩn bị commit; phải xác minh Pages, tài nguyên, browser và offline sau deploy. Không thay đổi visibility/schema/rules hoặc dữ liệu trẻ.
