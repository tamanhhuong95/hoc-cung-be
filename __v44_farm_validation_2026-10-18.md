# V44 — Nông trại tri thức


## V44 nông trại — bản chơi thử local, 18/10/2026

Chủ dự án yêu cầu nhánh nông trại dùng phần thưởng học tập và thiết kế MagicPath, chọn “Tích hợp bản chơi thử local”. Đã thực hiện trên nhánh codex/farm-pilot từ aaacf770d42092189eab4eebe0350b19a2d662a9. Chưa commit/push/deploy V44. Production V43 là trạng thái đã xác minh ngày17/10; không kiểm chứng lại production trong lần phát triển local này.

Nông trại có8 hoa/cây (hướng dương, xương rồng, tulip, cúc trắng, oải hương, mẫu đơn, hoa hồng, hoa sen),7 vật nuôi (gà, heo, bò, chó, mèo, bồ câu, rùa),4 trang trí (hàng rào, ghế, hồ, cối xay gió). Mỗi vườn bắt đầu với6 ô và1 hướng dương miễn phí; mở thêm3 ô mỗi lần, tối đa18 ô. Mua phải xác nhận và đủ cả hai tiền thưởng; hết chỗ yêu cầu mở đất. Tưới cây có mầm/nụ/hoa, chăm vật nuôi có phản hồi. Chăm sóc tối đa3 bước, không sinh tiền; không có héo/đói/phạt vắng mặt hoặc tiền thật.

Quy tắc bản thử: hoàn thành mỗi bài khác nhau nhận10 Sao; bestScore đạt80 thêm5, đạt100 thêm5; mỗi5 bài khác nhau đạt80 nhận1 Kim cương. Mỗi mốc chỉ tính một lần theo courseId/levelId; cải thiện nhận phần chênh. Bài cũ hợp lệ được ghi nhận khi mở vườn hoặc hoàn thành bài mới. Không suy ra phát âm; Mỹ thuật/tham gia nói theo chưa có phần thưởng riêng. Sao nông trại là tiền thưởng riêng, không trừ hoặc đổi bestStars/điểm đánh giá.

Năm module farm-core.js/farm-art.js/farm-ui.js/farm.js/farm.css. SVG tự vẽ, không tải ảnh/font/network mới. Website giữ HTML/CSS/JS thuần; React chỉ trong nguyên mẫu MagicPath. Tích hợp Home và kết quả bài học; điều hướng nông trại vẫn qua leave-quiz guard và giới hạn phụ huynh hiện có. Tách ví theo UID+childId; guest có vườn riêng, không chuyển ví guest sang tài khoản. Farm local key mới hoc-cung-be:farm:v1:<uid>:<childId>, farmVersion1 độc lập progressVersion2. Dữ liệu học chỉ đọc đúng khóa bé/môn và danh mục bài hiện có; không fallback từ guest sang bé. Ghi nhận phần thưởng tích lũy riêng để không mất ví khi dữ liệu bài học thiếu tạm thời.

Giao dịch dùng Web Locks, đọc lại ví trong khóa và xác minh danh tính trước khi ghi localStorage một lần. Dữ liệu không đọc được hoặc hết dung lượng không bị ghi đè; mua thất bại không trừ tiền. Khóa lưu tiến độ cũ, Firestore schema/rules/merge, child-profiles, nền Văn Miếu và nội dung học giữ nguyên. Vườn chưa đồng bộ thiết bị; bản thử cần trình duyệt hỗ trợ Web Locks (đã thử Chrome), không có backend chống sửa tiền trên máy. Mua không dùng tiền thật. Chưa Firebase E2E, thiết bị vật lý hoặc Safari. Quản lý thời gian chơi theo guard hiện có, chưa có bộ đếm thời gian nông trại riêng.

Validation trên profile test riêng: regression36 suites/680 checks, fail0/runtime0/missing=[]/exit0; core1suite/61checks/exit0; farm browser1suite/55checks/fail0/runtime0/missing=[]/exit0; nâng cấp V43→V44 277checks/fail0/runtime0/exit0; responsive375×812,768×1024,1280×900 đạt; audit85/85/exit0; syntax/diffcheck đạt. Farm browser gồm fixture danh tính/giao dịch, click thật mua/chăm/mở đất, cửa hàng, xác nhận/Escape, guard quiz, resultCTA, storagefailure/concurrency và offline subpath. Không coi fixture là kiểm thử Firebase thật. Lần đầu runner sai escape selector đã sửa; sau đó phát hiện CTA mới ở result chưa có handler (app gắn data-go tĩnh), sửa cầu nối qua entry hiện có rồi chạy lại đạt. Giữ gate cũ.

MagicPath project462124513023377408: desktop462412552253624320 revision462416693671628800; mobile462416662868668416 revision462417017916522496. Chỉ upload mã mới và ví minh họa sau khi chủ dự án trả lời “Cho phép tải bản thiết kế lên MagicPath”; không upload farm.js chứa cầu nối dữ liệu hoặc hồ sơ/tiến độ thật. Backend build completed cho cả hai bản. Đã xem ảnh server của desktop; sau lần sửa cuối mobile, MagicPath hết quota API nên chưa lấy lại ảnh server. Đã dựng lại CSS/JS của revision mobile tại local:2cột,8sản phẩm,nằm trong390px,không lỗi runtime; ảnh farm-mobile-preview.png trong workspace bàn giao. Đây là kiểm chứng local, không thay cho ảnh server của revision cuối. Bản desktop và mobile dùng ví mẫu có nhãn rõ, không lấy số này làm số dư của bé trên web local.

Bằng chứng __v44_farm_evidence.json và __v44_farm_validation_2026-10-18.md. Cache candidate hoc-cung-be-v44 precache5module. Giữ mọi untracked cũ và tài liệu hậu phát hành V43 có sẵn. Bước tiếp theo: chủ dự án trải nghiệm bản local và duyệt quy tắc/giá; chỉ phát hành khi được yêu cầu. Nếu cần sync nông trại phải thiết kế và xin duyệt thay đổi schema/rules riêng.


## Quyền phát hành V44 — 18/10/2026

Chủ dự án yêu cầu “phát hành” sau khi nhận báo cáo bản thử. Đã đối chiếu toàn bộ source hash khớp bản đạt gate; origin/main vẫn là V43 aaacf770d42092189eab4eebe0350b19a2d662a9. Cho phép commit/push/deploy bản nông trại đã duyệt. Chỉ xác nhận production sau Pages success, so khớp tài nguyên và kiểm tra trình duyệt production bằng hồ sơ test riêng. Giữ giới hạn nông trại lưu thiết bị; không đổi Firestore schema/rules.
