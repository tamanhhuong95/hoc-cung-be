# Bàn giao V41 lớp2 — bản local

## V41 local — bốn môn lớp 2, 17/10/2026

Phạm vi chủ dự án chốt: Toán, Tiếng Việt, Tiếng Anh và Mỹ thuật trước. Branch `codex/grade-two-subjects`; HEAD/origin/main vẫn `f189ffa8fa34e23988a929eec04cdbd60adae734` (V40). V41 chưa commit/push/deploy, candidate cache `hoc-cung-be-v41`. Production V40 là trạng thái đã xác minh trước nhiệm vụ, không phải lần kiểm tra production mới.

Bộ bài nhập môn tự biên soạn: Toán 24 bài/120 câu; Tiếng Việt 12 bài/60 câu với đoạn đọc gốc; Tiếng Anh 12 bài/60 câu, E2-01–E2-12; Mỹ thuật 8 bài/32 bước SVG gồm vẽ, xé dán, giấy tái sử dụng, thẻ đánh dấu sách và hoa nếp quạt. Tổng56 bài,240 câu trắc nghiệm. Không phải chương trình trọn năm hay bản đối chiếu hoàn chỉnh từng bài/trang của ba SGK. Tiếng Anh nghe phụ thuộc TTS của trình duyệt/giọng cài trên máy; chưa thêm bộ audio/video lớp2 riêng. Writing là nhận biết chữ/thứ tự từ qua trắc nghiệm, chưa đánh giá viết tự do. Speaking chỉ participation, accuracy=null.

Trang Lớp2 đã mở, dùng engine5 câu/unlock80% hiện có; ba course ID mới tách riêng tiến độ local theo trẻ/môn. Phụ huynh có bộ chọn6 môn, thống kê/thời gian và báo cáo tuần nhận dữ liệu lớp2; kỹ năng English lớp1/lớp2 tách riêng. Mỹ thuật chỉ phiênRAM, không lưu tiến độ/điểm/thời gian/ảnh hoặc tự nhận xét. Lớp1 vẫn giữ3 môn đánh giá và14 bài Mỹ thuật; không thêm EN-41+.

Firestore rules/schema/progressVersion2/merge giữ nguyên. `cloudSyncEnabled=false`: ba môn lớp2 chưa đồng bộ lên Firebase; UI ghi rõ lưu thiết bị và khóa nút sync trong lớp2. Cloud chỉ xử lý3 course cũ. Chưa mở metadata hồ sơ grade-2: hồ sơ hiện vẫn là loại grade-1 theo backend cũ, nhưng được chọn học danh mục lớp2, không đổi grade hay di chuyển tiến độ tự động. `__grade2_rules_proposal.patch` chỉ là đề xuất chưa áp dụng; cần phê duyệt riêng theo AGENTS và kiểm chứng backend trước bật đồng bộ. Không có kiểm chứng Firebase tài khoản thật.

Gate lần này: regression34 suites/597 checks, failedCount=0, runtimeErrorCount=0, missingSuites=[], realExitCode=0; browser277 checks, fail/runtime0, exit0 (actualV40→V41, dữ liệu /10/history/time/quota/sentinel giữ nguyên, game/Mỹ thuật cũ online/offline); PWA13/13, exit0 (gồm mở Tiếng Việt lớp2 offline bằng click thật); responsive3/3, exit0 ở375×812/768×1024/1280×900, bao gồm4 môn mới; audit85/85, exit0. Syntax JS và git diff --check exit0. Regression mới có luồng mỗi môn làm4/5=80% sau một câu sai/thử lại, lưu lịch sử/táchcourse/không ghi sang trẻ khác, normalizer khôi phục context và speakingaccuracy null.

Đã sửa nguyên nhân đọc tiến độ6 môn phát10 sự kiện đổi môn: helper context đồng bộ, khôi phục đúng topic/level, không phát sự kiện điều hướng; thống kê phụ huynh/summary/cloud normalizer dùng cùng helper. Không nâng ngưỡng4 event của test cũ. Một assertion registry cũ được tách rõ3 môn lớp1 và6 môn toàn ứng dụng. Giữ bằng chứng2 failure ban đầu tại __v41_before_context_fix.json. Runner chèn raw JS bằng callback regex để không biến escape trong JS thành replacement Python; selector test mới được đối chiếu lại DOM thật math-screen/learn-screen.

Nguồn tham khảo cấp giới thiệu/chủ đề:
- Kết nối tri thức: https://www.nxbgd.vn/bai-viet/gioi-thieu-sach-giao-khoa-lop-2-bo-sach-ket-noi-tri-thuc-voi-cuoc-song
- Mỹ thuật2: https://heid.vn/product/mi-thuat-2-sgk/
- Cổng Cánh Diều: https://www.hoc10.vn/
- Cổng tập huấn: https://taphuan.nxbgd.vn/tap-huan/cac-bo-sach-khac?grade=2&id_book=3

File chính: grade2-curriculum.js, grade2-art-data.js, grade2.css; index.html/script.js điều hướng và registry; art-studio.js tách danh mục theo lớp; child-settings.js, child-profiles.js, learning-analytics.js, weekly-report.js, cloud-sync.js tích hợp dữ liệu và giới hạn local. Service-worker/parent-tools/audit/runner cập nhật candidate cache. Runner mới __run_grade2_browser.py, __run_grade2_responsive.py, __run_v41_pwa_smoke.py; bằng chứng __v41_validation_evidence.json. README/PROJECT_MEMORY_CURRENT cập nhật trạng thái. Các tài liệu V40 đã modified trước nhiệm vụ và untracked cũ được giữ, không gom/xóa.

Giới hạn: chưa đánh giá sư phạm với giáo viên/trẻ, gấp thủ công vật lý, mobile thật/Safari, Firebase E2E hoặc đối chiếu SGK toàn năm. Test browser không chứng minh trẻ đã làm sản phẩm hoặc đã có năng lực tương ứng. Chưa xác minh production V41 vì chưa phát hành. Tiếp theo: review bộ bài và UI local; duyệt phạm vi backend riêng nếu muốn đồng bộ/hồ sơ lớp2; chỉ release sau phê duyệt. Preview http://127.0.0.1:8785/ → Lớp2.


## Phê duyệt phát hành V41 — 17/10/2026

Chủ dự án yêu cầu “phát hành” sau bàn giao bốn môn lớp2. Đã đối chiếu toàn bộ hash source/runner với gate34 suites/597 checks, browser277, PWA13, responsive3, audit85 đạt; origin/main vẫn V40 f189ffa. Cho phép commit/push/deploy bản hiện có với tiến độ lớp2 chỉ lưu thiết bị và metadata hồ sơ backend hiện hành. Không suy rộng thành duyệt sửa/deploy Firestore rules hoặc bật sync lớp2. Production V41 chỉ được xác nhận sau deployment và smoke riêng. Các mục chưa phát hành ở trên là lịch sử trước quyết định này.
