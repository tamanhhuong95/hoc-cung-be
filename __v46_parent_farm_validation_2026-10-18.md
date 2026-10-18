# V46 local — Phụ huynh kiểm soát nông trại

Ngày 18/10/2026 UTC+7. Chưa commit/push/deploy. Production vẫn V45, HEAD 493562e53f32fbca59590cbd81338621b202bd60.

## Đã triển khai

- Khu vực phụ huynh → **Kiểm soát nông trại**, hiển thị tên bé đang cài đặt. Bật/tắt quyền chơi và chọn tối đa 1–120 phút/ngày, mặc định 15 phút.
- Mật khẩu nông trại riêng, 4–64 ký tự; mỗi lần vào vườn phải nhập. Mật khẩu băm PBKDF2-SHA256 250,000 vòng với muối ngẫu nhiên. Không lưu mật khẩu rõ, không gửi lên Firestore. Nhập sai 5 lần khóa 30 giây, giữ khóa khi reload.
- Phụ huynh xác nhận PIN hiện có để lưu hoặc đặt lại mật khẩu. Quên mật khẩu nông trại có thể đổi bằng PIN phụ huynh; không xóa cây, vật nuôi, ví hay thời gian đã chơi.
- Đồng hồ thời gian chơi riêng trong nông trại; tự khóa khi hết giờ. Thời gian lưu trước khi cho chơi, làm tròn giây; tải lại/ra vào không trả lại thời gian. Chỉ một phiên chơi cho cùng UID/bé trên các cửa sổ; ẩn tab hoặc đổi bé/tài khoản sẽ khóa phiên.
- Khi phụ huynh tắt nông trại ở cửa sổ khác, phiên đang chơi đóng ngay. Không tiếp tục chơi nếu không lưu được thời gian. Mua/chăm sóc cũng kiểm tra quyền, không chỉ ẩn giao diện.
- Chưa có mật khẩu thì nông trại khóa để phụ huynh thiết lập. Học thử không mở được nông trại; phụ huynh cần đăng nhập/chọn hồ sơ bé. Bài học vẫn dùng được theo quyền hiện hành.
- Trang minh hoạ cũ chuyển về ứng dụng, không còn trò chơi riêng bỏ qua khóa.
- Sửa phép tự kiểm tra PIN cũ: thử migration trên bộ nhớ giả lập, không tráo PIN thật trong localStorage lúc khởi động. Giữ phép kiểm tra migration SHA/FNV→PBKDF2 và xác minh PIN cũ vẫn nguyên sau nâng cấp.

## Dữ liệu và phạm vi

Khóa mới: hoc-cung-be:farm-access:v1:<UID>:<child>:policy / usage / attempts. Thiết lập/quota/mật khẩu riêng theo UID và bé, chỉ trên trình duyệt này. Không đưa vào child-settings learning đồng bộ, không đổi farmVersion/progressVersion=2, khóa dữ liệu học, scoring/unlock, nội dung, Firestore schema/rules/merge, Auth hoặc dependencies. Kho đồ/ví V45 giữ nguyên.

## Tệp thay đổi

- Mới: farm-access-core.js (hash, policy, ngày/quota), farm-access.js (quyền, phiên chơi, form phụ huynh), farm-access.css.
- Tích hợp: farm.js, index.html; service-worker.js precache 3 tệp mới, cache candidate v46. script.js/child-settings.js chỉ đổi nhãn cache; parent-tools.js thêm tách storage của self tests và đổi nhãn phiên bản.
- Đóng preview không khóa: __living-farm-preview.html.
- Kiểm tra: __test_farm_access_core.cjs, __run_farm_access_browser.py, __run_farm_access_visual.py; cập nhật các runner nông trại cũ để đi qua mật khẩu hồ sơ test, upgrade đúng V45, responsive và cache.
- README.md/PROJECT_MEMORY_CURRENT.md và bằng chứng V46. Giữ các sửa tài liệu V43–V45 và tệp untracked cũ.

## Kết quả thật

| Kiểm tra | Suite | Checks | Fail | Runtime errors | Missing suites | Exit |
|---|---|---:|---:|---|---|---:|
| Full browser regression | 36 | 680 | 0 | 0 | [] | 0 |
| Farm controls core | 1 | 56 | 0 | 0 | [] | 0 |
| Farm controls physical browser | 1 | 67 | 0 | 0 | [] | 0 |
| Farm economy and growth | 1 | 70 | 0 | 0 | [] | 0 |
| Existing farm browser flows | 1 | 74 | 0 | 0 | [] | 0 |
| V45 to V46 upgrade and art/games | Không báo riêng | 280 | 0 | 0 | Không báo riêng/không áp dụng | 0 |
| Controls visual review at three sizes | 1 | 7 | 0 | 0 | [] | 0 |
| Media/PWA/security audit | Không báo riêng | 85 | 0 | Không báo riêng | Không báo riêng/không áp dụng | 0 |
| English responsive | Không báo riêng | 3 | 0 | Không báo riêng | Không báo riêng/không áp dụng | 0 |

Các kiểm tra dùng profile/fixture riêng; không xóa/reset dữ liệu người dùng. Hai cửa sổ được mô phỏng trạng thái hiển thị để kiểm tra Web Locks thực giữa hai trang. Thử PIN phụ huynh bằng giao diện thật; prompt xác nhận dùng PIN cố định trong fixture. Giới hạn 1 phút được tăng đồng hồ monotonic của profile test để kiểm tra hết giờ, không thêm hook test vào sản phẩm.

Đã xem ảnh bảng kiểm soát/mật khẩu ở 375×812, 768×1024, 1280×900. Chi tiết/hash trong __v46_validation_evidence.json; report theo từng runner: __v46_access_core_report.json, __v46_access_browser_report.json, __v46_core_report.json, __v46_farm_browser_report.json, __v46_game_browser_report.json, __v46_controls_visual_report.json, __v46_responsive_report.json và __full_regression_report.json.

## Giới hạn và bàn giao

- Kiểm soát trong ứng dụng trên trình duyệt hiện tại; chưa đồng bộ hoặc là khóa của hệ điều hành. Người biết dùng công cụ phát triển/xóa bộ nhớ có thể can thiệp dữ liệu local. Không tự đổi schema/rules để làm khóa toàn thiết bị.
- Chưa thiết bị thật/Safari/Firebase đăng nhập và đồng bộ E2E thật trong lượt này.
- Chuyển tab/tải lại yêu cầu nhập mật khẩu lại; thời gian làm tròn lên giây. Giữ các giới hạn học/chơi chung đã có.
- Chưa phát hành V46. Xem local tại http://127.0.0.1:8790/; phụ huynh mở dashboard, chọn bé → Kiểm soát nông trại.
- Duyệt thao tác rồi chỉ commit/push/deploy khi chủ dự án yêu cầu. Sau phát hành phải xác minh Pages, byte tài nguyên, nâng cấp dữ liệu và browser/offline trên production.


## Phê duyệt phát hành V46 — 18/10/2026

Chủ dự án yêu cầu “phát hành” sau khi duyệt V46 local. Cho phép commit/push/deploy V46. Đã đối chiếu SHA-256 toàn bộ 10 tệp source đã kiểm thử; không đổi source sau gate. Production vẫn V45 tại thời điểm chuẩn bị commit. Phải xác minh Pages, byte tài nguyên, kiểm soát phụ huynh, nông trại và offline trên website thật. Không đổi visibility/Firestore hoặc dữ liệu trẻ.
