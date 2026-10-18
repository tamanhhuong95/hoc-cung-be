# Project Memory hiện hành — Học Cùng Bé

Tài liệu PM-7.3, 18/10/2026 UTC+7. V46 kiểm soát nông trại đã hoàn thiện local, chưa commit/push/deploy. Production/HEAD vẫn V45 493562e. Có bật/tắt, 1–120 phút/ngày và mật khẩu riêng theo UID/bé trên trình duyệt, không sync. Xem __v46_parent_farm_validation_2026-10-18.md. Các trạng thái phía dưới là lịch sử.

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


## Production V39 đã xác minh — 16/10/2026

V39 đã commit/push/deploy tại SHA 0c619526f247d34c712092a58c5a418c84102679. Pages run 38934671717 completed/success. Cả13 asset production HTTP200 và bytes khớp commit; cache hoc-cung-be-v39. Smoke production cuối43/43, fail0/runtime0/exit0: bài học cũ/dialog, cả5 trò,3 nhóm Mỹ thuật (ART-03/05/09), cold reload offline và dữ liệu sentinel giữ nguyên. Bằng chứng __v39_production_evidence.json; script tái hiện __run_v39_production_smoke.py dùng profile test riêng và URL production, không dùng profile của người dùng.

Run đầu chưa đầy đủ, lỗi runtime startup và solver dừng, không đủ chẩn đoán để quy nguyên nhân; giữ __v39_production_initial_failure.json. Run chẩn đoán sau đó qua các kiểm tra UI nhưng ghi báo cáo sau đóng Chrome gây lỗi runner; đã sửa thứ tự và chạy lại đầy đủ đạt. Không sửa source hoặc hạ gate để bỏ lỗi. Gate trước phát hành32 suites/551 checks và browser237 vẫn là bằng chứng local, không thay số liệu production.

Các đoạn chưa phát hành V38/V39 phía trên là lịch sử và được thay bằng trạng thái này. Mỹ thuật và5 trò đã online tại Lớp1; Mỹ thuật vẫn chỉ phiên RAM, chưa lưu/sync tiến độ. Nội dung SGK mới tham khảo ở mức chủ đề, chưa đối chiếu toàn bộ từng bài; chưa kiểm tra thiết bị thật, Firebase tài khoản thật hoặc sư phạm thực hành. Source phát hành giữ nguyên; tài liệu và bằng chứng sau deployment được cập nhật local chưa commit.


## V40 local — hướng dẫn trực quan,17/10/2026

Yêu cầu: làm các bước dễ hiểu hơn, thêm hạc giấy và ngôi sao. Đã thêm trước/sau, mũi tên/nếp gấp có ngữ nghĩa, hint/checkpoint, phóng to native dialog, chọn bước. Mobile hình xếp dọc; Escape trả focus. Có14 bài/94 bước; hạc28, sao10, cún/quạt8 bước mỗi bài. Giữ12 lesson ID gốc. Module art-folds.js, candidate cacheV40.

Final regression33 suites/563 checks,fail/runtime0,missing=[],exit0; browser277 checks/0fail/0runtime/exit0; PWA13/13; responsive3; audit85/85. Đã sửa toggle làm mất tự nhận xét và hai fixture số bước/biến runner; có bằng chứng trước sửa. Các kiểm tra dùng profile riêng, nâng cấp actualV39 và giữ dữ liệu đạt.

Đã đối chiếu quy trình gấp truyền thống và tự vẽ sơ đồ; chưa gấp sản phẩm vật lý cùng trẻ/giáo viên. Cần người lớn review nếp mở túi/lộn trước phát hành; không nhận kiểm thử browser là xác nhận hướng dẫn làm thật. Không thay schema/rules/merge/progressVersion2/scoring/unlock hoặc ghi thời gian Mỹ thuật vào ba môn.

Production vẫnV39 SHA0c619526f247d34c712092a58c5a418c84102679; branch codex/art-visual-folds, V40 chưa commit/push/deploy. Bằng chứng __v40_validation_evidence.json; bàn giao/nguồn/giới hạn __v40_validation_2026-10-17.md. Yêu cầu phát hànhV39 trước không tự cấp quyền phát hànhV40. Giữ các phần V39 dưới/trước làm lịch sử.


## Phê duyệt phát hành V40 — 17/10/2026

Chủ dự án yêu cầu “Phát hành đi” sau bàn giao V40 và ghi nhận giới hạn chưa làm thử sản phẩm vật lý. Đã đối chiếu hash source/runner với gate33 suites/563 checks và browser277 checks đạt. Cho phép commit/push/deploy V40. Các đoạn chưa phát hành phía trên là lịch sử. Kết quả production ghi sau triển khai tại __v40_production_evidence.json; chưa có bằng chứng production tại thời điểm tạo commit. Giữ giới hạn cần người lớn hỗ trợ, chưa thử gấp vật lý, Mỹ thuật chưa lưu/sync tiến độ.


## Production V40 đã xác minh — 17/10/2026

V40 đã commit/push/deploy tại SHA f189ffa8fa34e23988a929eec04cdbd60adae734. GitHub Pages run38978240870 completed/success. Cả14 asset production HTTP200 và bytes khớp commit; cache hoc-cung-be-v40. Smoke production63/63, fail0/runtime0/exit0: hạc28 bước/sao10 bước online và offline, trước/sau, zoom/Escape trả focus, guide toggle giữ tự nhận xét, các nhóm Mỹ thuật cũ,5 trò, luồng bài học/dialog và sentinel local giữ nguyên. Kiểm tra bằng profile test riêng, không xóa hoặc mở profile người dùng.

Nguồn bằng chứng __v40_production_evidence.json; runner __run_v40_production_smoke.py. Gate trước phát hành33 suites/563 checks và browser277 checks là bằng chứng local riêng. Các đoạn V40 chưa phát hành ở trên mô tả lịch sử trước quyết định phát hành và được thay bằng mục này.

Giới hạn chưa gấp sản phẩm vật lý theo sơ đồ, cần người lớn hỗ trợ hạc/sao, chưa thiết bị thật/Safari/Firebase E2E vẫn giữ. Mỹ thuật chưa lưu/sync tiến độ, không gán bấm xong thành năng lực hoặc sản phẩm thực. Source phát hành không đổi; tài liệu/bằng chứng sau deploy cập nhật local chưa commit.


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


## Production V41 đã xác minh — 17/10/2026

V41 đã commit/push/deploy tại SHA ac9cc771942f5ae1074bd7da1c730198b66569d1. GitHub Pages run39001923922 completed/success. Cả17 asset production HTTP200 và bytes khớp commit; cache hoc-cung-be-v41. Smoke production99/99, fail0/runtime0/exit0: bốn môn lớp2 online/offline, ba môn mở bài đúng curriculum, Learn tiếng Anh, cả8 dự án Mỹ thuật tới tự nhận xét, bài học/dialog/game/Mỹ thuật lớp1 cũ và sentinel local giữ nguyên. Kiểm tra Chrome profile riêng, không mở/xóa dữ liệu người dùng.

Bằng chứng __v41_production_evidence.json, __v41_production_assets.json và v41_production_smoke_report.json; runner __run_v41_production_smoke.py. Gate34 suites/597 checks, browser277, PWA13, responsive3 và audit85 là bằng chứng trước phát hành đã đối chiếu hash, không thay bằng số liệu production. Những đoạn V41 chưa phát hành ở trên là lịch sử và được thay bằng mục này.

Tiến độ lớp2 vẫn chỉ lưu thiết bị, cloudSyncEnabled=false; Firestore rules/schema và metadata child grade giữ nguyên, chưa áp dụng proposal hoặc Firebase E2E. Bộ bài nhập môn56 bài/240 câu/32 bước Mỹ thuật chưa phải trọn năm hay đối chiếu toàn bộ SGK; Speaking chỉ participation/accuracy=null, chưa thử sư phạm/thiết bị vật lý/gấp sản phẩm thật. Mỹ thuật chỉ phiênRAM. Bước tiếp theo: review nội dung cùng giáo viên/phụ huynh; phê duyệt và kiểm chứng rules/backend riêng nếu mở sync/hồ sơ lớp2.

Main/HEAD/origin/main cùng SHA phát hành tại lúc kiểm tra. Source đã phát hành không đổi; README/Project Memory/bàn giao và bằng chứng hậu triển khai cập nhật local, chưa tạo commit tài liệu thứ hai. Untracked cũ giữ nguyên. Nếu cần quay lại, tạo commit revert V41 có cache phát hành mới, giữ nguyên localStorage và không reset dữ liệu; V40 ổn định trước là f189ffa8fa34e23988a929eec04cdbd60adae734. Chưa thực hiện rollback.


## V42 local — lớp3, lớp4, lớp5, 17/10/2026

Chủ dự án yêu cầu tiếp tục lớp3/4/5; giữ phạm vi bốn môn như lớp2. Mỗi lớp có12 bài Toán,8 Tiếng Việt,8 Tiếng Anh,6 Mỹ thuật: tổng102 bài mới/420 câu/18 dự án/78 bước SVG. Đây là bộ bài nhập môn tự biên soạn, không phải chương trình trọn năm hay bản đối chiếu đầy đủ từng trang của ba SGK. Không lấy bài lớp2 đổi nhãn; giữ nguyên dữ liệu/nội dung/ID các lớp trước, không có EN-41+.

Toán3: số đến100.000, cấu tạo số, cộng/trừ, nhân/chia/chia dư, phần của số, chu vi/diện tích, thời gian, bài toán hai bước. Toán4: số lớn, nhân/chia hai chữ số, phân số cùng mẫu/phân số bằng nhau, trung bình cộng, đơn vị diện tích, góc/đường thẳng, tổng-hiệu. Toán5: thập phân, phần trăm, diện tích tam giác/hình thang, chu vi tròn, thể tích hộp và chuyển động. Mỗi lớp6 nhóm Toán với2 bài/nhóm, đúng4/5=80% mở bài tiếp theo như engine cũ.

Tiếng Việt có24 đoạn văn gốc riêng, nội dung đọc hiểu, ý chính, hoạt động/tính từ/đọc kỹ câu trích. Chưa có chấm viết đoạn văn, giọng đọc hoặc đầy đủ mạch kiến thức cả năm. Tiếng Anh có24 bài riêng, Learn→Practice, từ/câu tăng độ khó theo lớp. Listening dùng TTS, phụ thuộc giọng và offline của trình duyệt; chưa có bộ video/audio riêng lớp3–5. Writing chỉ nhận biết chữ/thứ tự từ qua trắc nghiệm; Speaking là participation/coverage, accuracy=null, không chấm phát âm.

Mỹ thuật: bố cục phố/cây, xa-gần/sắc độ/cảm xúc, mặt nạ trưng bày, ghép giấy, khung ảnh, áp phích, tranh nổi, bìa sổ, quạt/hoa giấy/mô hình hộp. Có vật liệu, an toàn, bước trước-sau, zoom, chọn bước và tự nhận xét. Hình khai triển hộp sáu mặt và bảy tai dán được vẽ riêng; chưa cắt/gấp sản phẩm vật lý, cần người lớn review và hỗ trợ. Sơ đồ mang tính hướng dẫn/gợi ý bố cục, không chứng minh kết quả làm thật. Toàn bộ Mỹ thuật chỉ RAM, không lưu điểm/ảnh/tiến độ/thời gian hoặc chuyển tự nhận xét thành năng lực.

Ứng dụng có15 course đánh giá, storage vẫn theo trẻ/môn, progressVersion=2 và migration/merge/scoring/unlock cũ giữ nguyên. Home, back về đúng lớp, parent selector15 môn, summary của lớp đang chọn, daily-limit cộng đủ các môn, weekly15 môn và English từng lớp tách riêng. Cloud chỉ whitelist3 môn lớp1; lớp2–5 lưu thiết bị, nút sync khóa và có giải thích. RequestedCourse không thuộc whitelist bị chặn trước khi gọi backend. Không đổi/deploy Firestore rules/schema, metadata hồ sơ child vẫn theo backend cũ; chưa tạo grade3/4/5 trong hồ sơ hoặc tự di chuyển dữ liệu.

Gate cuối: regression35 suites/668 checks, fail0/runtime0/missing=[]/exit0; thao tác thật lớp3–5/PWA/offline/responsive 174/174, runtime[]/exit0, catalog/quiz/EnglishLearn/art ở375×812/768×1024/1280×900, tất cả18 dự án trênmobile và offline; actualV41→V42 upgrade/browser 277/277, fail/runtime0/exit0, dữ liệu /10/history/thời gian/quota/sentinel giữ nguyên; responsive lớp1/2 cũ3/3 exit0; media/PWA/security audit85/85 exit0; syntax và git diff --check exit0. Tất cả dùng hồ sơ test riêng, không reset dữ liệu thật. Kiểm tra mới gồm60% không mở/80% mở, UI hoàn thành4/5 mỗi9 môn, phân biệt30 khóa của2 trẻ×15 môn, context read/save không đổi lựa chọn/phát course event, toán oracle, đoạn đọc gốc, English accuracy=null, chặn cloud lớp3–5 và weekly tách lớp.

Run đầu chỉ thiếu assertion registry cũ (đếm6 toàn app); đã giữ kiểm tra6 môn lớp1/2 và thêm kiểm tra15 toàn ứng dụng, không bỏ suite. Giữ __v42_before_registry_update.json. Runner chụp ảnh desktop gặp giới hạn frame1MiB, sửa transport16MiB và cleanup rồi chạy lại; bằng chứng __v42_capture_transport_before_fix.txt. Đã phát hiện listener runtime bị mất sau offline reload, thêm Page.addScriptToEvaluateOnNewDocument và gate yêu cầu capture là mảng rỗng; report trước sửa __v42_runtime_capture_before_fix.json chỉ là bằng chứng chưa hoàn chỉnh, không dùng kết luận runtime0. Không quy lỗi runner thành lỗi ứng dụng/cache và không hạ gate.

File mới: upper-curriculum.js, upper-language.js, upper-art.js; runner __run_upper_browser.py, __run_upper_upgrade.py, __run_upper_responsive.py. Tích hợp index.html/script.js, art-studio.js, child-profiles.js, cloud-sync.js, learning-analytics.js, weekly-report.js, grade2.css; cache/precache candidate hoc-cung-be-v42 và các assertion liên quan. child-settings vẫn lấy tất cả course cho giới hạn, chỉ literal cache đổi. README/Project Memory/bàn giao cập nhật; thay đổi tài liệu hậu phát hành V41 có sẵn và untracked cũ giữ nguyên. Các source/curriculum lớp1/2 không bị ghi đè. Hash và kết quả __v42_validation_evidence.json; git status __v42_git_status.txt.

Nguồn đối chiếu mới chỉ cấp danh mục/giới thiệu, không nhận đã bám đầy đủ ba bộ SGK: https://sachdientu.nxbgd.vn/ ; https://taphuan.nxbgd.vn/tap-huan/chi-tiet-sach/toan-3-tap-mot-939748183.939748183 . Hướng dẫn và câu hỏi do nhóm tự biên soạn, không chép đoạn sách hoặc hình có bản quyền.

Branch codex/grades-three-to-five; HEAD/origin/main vẫn ac9cc771942f5ae1074bd7da1c730198b66569d1. V42 chưa commit/push/deploy; quyền phát hành V41 không suy rộng sang V42. Production được xác minh lần trước làV41, chưa kiểm tra production mới trong nhiệm vụ này. Preview http://127.0.0.1:8786/ → Lớp3/4/5. Chưa kiểm thử giáo viên/trẻ, gấp sản phẩm vật lý, thiết bị thật/Safari/FirebaseE2E. Tiếp theo: review bài và giao diện local, phát hành khi được duyệt; mở cloud/hồ sơ lớp mới cần phạm vi backend phê duyệt riêng.


Bổ sung kiểm chứng cuối: báo cáo English lớp2–5 thiếu lịch sử nay hiện “Chưa đủ dữ liệu”, không điền0 hoạt động. Test ban đầu dùng toàn bộ tuần rỗng nên renderer hợp lệ trả global empty state trước các section; đã đổi fixture sang có hoạt động Toán nhưng thiếu English để kiểm tra đúng trạng thái thiếu từng môn, giữ failure tại __v42_empty_week_fixture_before_fix.json. Full35 suites/668 checks chạy lại sau sửa fixture/source và đạt. Physical174/upgrade277 kiểm tra điều hướng, bài học, cache và dữ liệu trước chỉnh empty-report này; final regression kiểm tra riêng thay đổi báo cáo mới.


## Phê duyệt phát hành V42 — 17/10/2026

Chủ dự án yêu cầu “phát hành đi” sau bàn giao lớp3/4/5. Đã đối chiếu hash toàn bộ source/runner với gate35 suites/668 checks, physical174, upgrade277, responsive3, audit85 đạt; origin/main vẫn V41 ac9cc77. Cho phép commit/push/deploy bản hiện có. Lớp2–5 vẫn chỉ lưu thiết bị; không suy rộng thành duyệt sửa/deploy Firestore rules, đổi metadata child hoặc bật cloud các lớp này. Production V42 chỉ xác nhận sau deployment và smoke riêng. Những mục chưa phát hành phía trên là lịch sử trước quyết định này.


## Production V42 đã xác minh — 17/10/2026

V42 đã commit/push/deploy tại SHA f7c562f302bd967523cbdd97e0d0731ff2faae41. GitHub Pages run39015140662 completed/success. Cả20 asset production HTTP200 và bytes khớp commit; cache hoc-cung-be-v42. Smoke production174/174, fail0/runtime0/exit0: catalog/ba môn đánh giá/EnglishLearn/Mỹ thuật lớp3–5 ở375×812/768×1024/1280×900, tất cả18 dự án trênmobile online/offline, cold reload offline, sentinel giữ nguyên; bài học lớp1/dialog và Tiếng Việt lớp2 offline vẫn mở được. Runtime capture được cài trước mỗi document và xác nhận tồn tại sau offline reload. Chạy Chrome profile test riêng, không mở/xóa dữ liệu thật.

Bằng chứng __v42_production_evidence.json, __v42_production_assets.json, __v42_production_smoke_report.json và runner __run_v42_production_smoke.py. Gate35 suites/668 checks, physical174, upgrade277, responsive3, audit85 là kết quả local trước phát hành riêng, không thay bằng số production. Các đoạn V42 chưa phát hành ở trên là lịch sử và được thay bằng mục này.

Lớp2–5 vẫn chỉ lưu thiết bị; cloud chỉ3 môn lớp1. Không sửa/deploy Firestore rules/schema hoặc mở metadata grade mới. Nội dung102 bài/420 câu/78 bước lớp3–5 là nhập môn tự biên soạn, chưa trọn năm hoặc đối chiếu đầy đủ từng trang3SGK. Chưa FirebaseE2E, trẻ/giáo viên/thiết bị vật lý/Safari hoặc thực hành cắt/gấp sản phẩm thật. Speaking participation/accuracy=null; Mỹ thuật RAM-only vẫn giữ.

Main/HEAD/origin/main cùng SHA phát hành lúc kiểm tra. Source phát hành không đổi; tài liệu/bằng chứng hậu triển khai cập nhật local chưa tạo commit tài liệu thứ hai, untracked cũ giữ nguyên. Bước tiếp theo: đánh giá nội dung với phụ huynh/giáo viên và mở rộng đủ chương trình theo phạm vi được giao; backend sync cần phê duyệt riêng. Nếu cần quay lại, dùng commit revert có cache phát hành mới, không reset localStorage hay dữ liệu trẻ; V41 ổn định trước là ac9cc771942f5ae1074bd7da1c730198b66569d1. Chưa thực hiện rollback.


## V43 — giao diện vườn học, 17/10/2026

Chủ dự án yêu cầu “Đưa lên web” sau khi duyệt hướng thiết kế MagicPath, giữ nền Văn Miếu và thân thiện với học sinh tiểu học. Quyền này gồm triển khai giao diện lên website sau validation. Không đổi framework hoặc đưa React/TSX/prototype curriculum vào sản phẩm. Bản MagicPath chỉ là thiết kế; bản website dùng HTML/CSS/JS thuần và luồng/dữ liệu thật hiện có.

Thêm garden-theme.css và garden-ui.js. Giữ đúng bytes ảnh assets/backgrounds/van-mieu-quoc-tu-giam.webp, tạo hero rõ cảnh Văn Miếu, màu kem/xanh lá, wordmark, thẻ môn với SVG riêng, chọn lớp gọn và điều hướng dưới trênmobile. Home có4 nút môn thật theo lớp đang xem, cập nhật theo sự kiện điều hướng/course; trạng thái chọn lớp chỉ RAM, không đọc/ghi tiến độ hoặc gửi mạng. Quiz giữ đáp án/feedback/score thật, chỉ thay màu/chữ/khoảng cách/vùng chạm. Mỹ thuật/parent/auth cùng bảng màu; không thay nội dung học, số câu, điều kiện mở bài, phiên Mỹ thuật hoặc Speaking accuracy=null.

Đăng nhập/đăng ký/học thử/PWA giữ luồng hiện có, không nhập demo account hoặc số liệu giả từ prototype. Mobile phụ huynh guest dùng login thật, authenticated dùng parent gate thật. Nút mới được thêm vào selector bảo vệ rời quiz; không được đi vòng qua dialog/PIN. Giữ7 chức năng tài khoản; action mobile riêng không chèn vào registry của menu. Còn15 môn đánh giá, dữ liệu theo trẻ/môn, progressVersion2, schema/rules/merge/quota hiện có; lớp2–5 chỉ lưu thiết bị. Không thêm dependencies/tracking/ads/networkfont. Font dùng stack hiện có, nên có thể khác Nunito trong MagicPath tùy máy.

Gate cuối: regression36 suites/680 checks, fail0/runtime0/missing=[]/exit0; physical207/207/runtime[]/exit0 ở375×812/768×1024/1280×900, gồmHome/minimumtargets/điều hướng mới/thoát quiz/parentlogin và các môn lớp3–5/Mỹ thuật online-offline; upgrade actualV42→V43 277/277,fail/runtime0/exit0, legacy /10/history/time/quota/sentinel giữ nguyên; responsive lớp1/2 cũ3/3 exit0; audit85/85 exit0; syntax/diffcheck exit0. Dùng profile/fixture riêng, không mở/xóa dữ liệu thật.

Review đầu phát hiện assertion brand cũ yêu cầu không có chữ, không còn đúng với wordmark mới; đã thay bằng kiểm tra logo+tên thật. Assertion7 menu phát hiện mobile parent dùng chung data-function-action; đã tách data-garden-parent, giữ đúng7 menu và bổ sung leave-quiz guard. Giữ __v43_before_navigation_review.json. Header nhãn Việt hóa “Trang chủ”; giữ auth CTA và kiểm tra trạng thái guest/auth. Runner click thật chọn phần tử đang hiển thị khiHome vàcatalog cùng dẫn tới một course, không click node có rect0. Sau xem ảnh thật đã thu gọn nút tài khoản, giảm khoảng68px cũ, ưu tiênCTA học và chạy lại toàn bộ gate trên tree cuối.

Nguồn thiết kế: MagicPath project462124513023377408, desktop component462124548473638912 revision462127320858255360, mobile462127631505186816 revision462127631505186817. Giữ bản mẫu ở MagicPath; source website không phụ thuộc dịch vụMagicPath hoặc GoogleFonts. Giới hạn khác prototype: giữ toàn bộ auth/status/install/học tiếp thật, khóa môn/PIN/thiếu dữ liệu, không thay chúng bằng dữ liệu hoặc màn giả. Chưa đánh giá với trẻ/giáo viên, thiết bị vật lý/Safari hoặc Firebase E2E.

File source đổi: index.html, script.js (copy/wordmark/navigationguard), manifest.webmanifest (màu), service-worker.js (cache hoc-cung-be-v43/precache2file), garden-theme.css, garden-ui.js; parent-tools/child-settings chỉ literal cache. Runner/audit và README/Project Memory cập nhật; giữ tài liệu hậu phát hànhV42 có sẵn vàuntracked cũ. __v43_validation_evidence.json ghi hash. Không thay data curriculum, cloud-sync.js, Firestore rules hoặc scoring/sync logic.

Branch codex/garden-interface từ V42 f7c562f302bd967523cbdd97e0d0731ff2faae41; origin/main cùngbaseline tạipreflight. Chủ dự án đã cho phép commit/push/deploy V43. Chỉ xác nhậnproduction sau workflow và đối chiếu asset/smoke riêng; các số gate trên là local. Bằng chứng production sẽ ghi __v43_production_evidence.json. Nếu cần quay lại, tạo commit revert có cache phát hành mới và giữ localStorage; chưa thực hiện rollback.


## V43 đã push — phát hành bị chặn bởi hosting, 17/10/2026

V43 đã commit/push lên main tại SHA aaacf770d42092189eab4eebe0350b19a2d662a9; HEAD/origin/main cùng SHA. Chưa deploy và chưa xác minhproduction. GitHub API public/connector trả404; API xác thực bằng kết nối Git hiện có xác nhận repo private=true, has_pages=false, không có workflow run cho commit. Website/service-worker public trả404. Thử bật Pages giữ repo private bị GitHub422: “Your current plan does not support GitHub Pages for this repository.” Đây là lỗi điều kiện hosting, không có bằng chứng lỗi source hoặc thời điểm/nguyên nhân repo đổiprivate.

Không chuyển public, không đổi gói/chi tiền/nhà cung cấp, không sửa rules hoặc dữ liệu. Đã hỏi chủ dự án có cho phép chuyển repository sang public hay giữ private; câu hỏi đang chờ trả lời, không coi im lặng là đồng ý. Public sẽ công khai toàn bộ mã nguồn và lịch sử Git, không chỉwebsite. Nếu giữ private, cần chủ dự án chọn gói GitHub hỗ trợ hoặc duyệt phương án hosting khác trước khi làm tiếp.

Bằng chứng __v43_release_blocker.json, __v43_github_release_diagnostic.json, __v43_pages_enable_result.json. Gate36 suites/680 checks, physical207, upgrade277, responsive3, audit85 là local; chưa có smokeproductionV43 và không gọi chúng là productionPASS. Source đã kiểm chứng giữ nguyên. Tài liệu này/README/Memory cập nhậtlocal, chưa commit tài liệu mới; untracked cũ giữ nguyên. Sau khi có quyết định hợp lệ, bật hosting, đối chiếu asset/SHA/cache và chạy __run_v43_production_smoke.py trước xác nhận phát hành.


## V43 đã phát hành và xác minh production — 17/10/2026

Chủ dự án trả lời rõ “Cho phép chuyển repo sang public” sau khi được thông báo toàn bộ source/lịch sử Git sẽ công khai. Đã chuyển tamanhhuong95/hoc-cung-be sang public (API200), bật Pages main/root (API201). Pages run39026217751 completed/success, đúng SHA aaacf770d42092189eab4eebe0350b19a2d662a9; Pages status built. Trạng thái chặn private/404 ở mục trước là lịch sử và đã được giải quyết.

Production https://tamanhhuong95.github.io/hoc-cung-be/: 18/18 tài nguyên HTTP200, bytes khớp commit, giữ nguyên ảnh Văn Miếu. Kiểm tra trình duyệt production207/207, failure0/runtime0/exit0, gồm điều hướng Home/quiz/parent/Mỹ thuật, ba kích thước màn hình, lớp3–5 và offline với cache hoc-cung-be-v43. Hồ sơ test riêng, không reset dữ liệu thật. Bằng chứng __v43_production_evidence.json, __v43_production_assets.json, __v43_production_smoke_report.json, __v43_public_publish_result.json. Gate local36 suites/680 checks, missing=[]/failure0/runtime0/exit0 là kiểm tra trước phát hành, không thay cho production smoke.

Đã commit/push/deploy source V43. Tài liệu hậu phát hành cập nhật local, chưa commit thêm; giữ untracked cũ. Không đổi source sau validation/deploy. Giữ progressVersion2/schema/rules/scoring/sync; lớp2–5 vẫn lưu thiết bị. Chưa kiểm tra Safari/thiết bị vật lý, đánh giá với trẻ/giáo viên hoặc Firebase E2E. Theo dõi phản hồi sử dụng; rollback nếu cần bằng commit revert và cache mới, bảo toàn localStorage.


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


## V44 đã phát hành — 18/10/2026

Chủ dự án yêu cầu “phát hành”. Đã commit/push V44 lên main, SHA 7b45bd0bd984e92ba09a7b7017ec72c5033e8c2e. Pages run39098720495 completed/success đúng SHA. Production https://tamanhhuong95.github.io/hoc-cung-be/ trả23/23 tài nguyên HTTP200, bytes khớp commit, cache hoc-cung-be-v44; nền Văn Miếu giữ nguyên. Production farm smoke55/55, fail0/runtime0/missing=[]/exit0, hồ sơ Chrome riêng, gồm click mua/chăm/mở đất, resultCTA, guard rời quiz, ví/fixture danh tính, responsive375/768/1280 và offline. Không dùng dữ liệu bé thật. Bằng chứng __v44_production_evidence.json.

Bản phát hành vẫn là nông trại thử nghiệm lưu thiết bị theo UID+bé, chưa đồng bộ giữa máy; giữ progressVersion2 và Firestore schema/rules. Không có Firebase E2E hoặc kiểm tra Safari/thiết bị vật lý. Không lấy điểm nói theo/Mỹ thuật làm điểm đánh giá. Các gate680/core61/upgrade277/responsive3/audit85 ở phần trước là local;55 kiểm tra này chạy riêng trên HTTPS production. Chưa thay đổi dữ liệu thật hoặc reset trình duyệt người dùng.

Tài liệu hậu phát hành cập nhật local chưa commit thêm, giữ thay đổi tài liệu V43 và untracked cũ. Theo dõi phản hồi; rollback nếu cần bằng commit revert và cache mới, giữ localStorage.


## V45 local — nông trại mô hình, 18/10/2026

Chủ dự án chọn hình chân thực hơn, giống mô hình nông trại. Cảnh liên tục có 8 cây/hoa và 7 vật nuôi, đi lại theo khung hình, tưới/cho ăn và cây mới chờ 6/12/18 giây. Không mất cây/vật nuôi khi nghỉ. Nút Play có thể chủ động bật khi máy mặc định giảm chuyển động.

Giữ progressVersion=2, scoring/unlock, khóa dữ liệu, Auth/Firestore schema/rules/merge và thưởng học tập. Farm v1 thêm trường tăng trưởng tùy chọn, đọc được dữ liệu cũ; nông trại chưa sync. Vườn minh hoạ chỉ ở RAM. Chưa được phép phát hành V45; duyệt local rồi chờ yêu cầu phát hành.

Kết quả: Full browser regression: 680 checks, fail 0, exit 0; Farm core and timed growth: 70 checks, fail 0, exit 0; Farm physical browser, motion, offline: 74 checks, fail 0, exit 0; V44 upgrade, art and games: 278 checks, fail 0, exit 0; Media/PWA/security audit: 85 checks, fail 0, exit 0; English responsive: 3 checks, fail 0, exit 0. Chi tiết runtime/missing và SHA trong __v45_validation_evidence.json. Chưa Firebase E2E hay thiết bị thật.


## Phê duyệt phát hành V45 — 18/10/2026

Chủ dự án yêu cầu “phát hành đi” sau khi duyệt nông trại mô hình local. Cho phép commit/push/deploy V45. Đã đối chiếu SHA-256 12 tài nguyên với bằng chứng kiểm thử; không đổi source sau gate. Production vẫn V44 tại thời điểm chuẩn bị commit; phải xác minh Pages, tài nguyên, browser và offline sau deploy. Không thay đổi visibility/schema/rules hoặc dữ liệu trẻ.


## Production V45 xác minh — 18/10/2026

Chủ dự án yêu cầu phát hành; đã commit/push V45 493562e53f32fbca59590cbd81338621b202bd60. GitHub Pages run 39115462661 completed/success. Production 28/28 tài nguyên byte-match commit; browser 74/74, failed=0, runtime=0, missingSuites=[], realExitCode=0; cache hoc-cung-be-v45 và cold reload offline đạt.

Website: https://tamanhhuong95.github.io/hoc-cung-be/ → Nông trại tri thức. Giữ dữ liệu học, ví/kho đồ hiện có; không đổi schema/rules. Chi tiết __v45_production_evidence.json và __v45_production_smoke_report.json. Báo cáo local phía trên là mốc lịch sử trước phát hành. Chưa thử thiết bị thật/Safari/Firebase sync thật.

Rollback nếu cần: hoàn nguyên commit V45 bằng commit mới, tăng tên cache và giữ dữ liệu local; V44 đọc được các trường tăng trưởng bổ sung mà không đổi farmVersion. Không force push hoặc xóa dữ liệu bé.


## V46 local — kiểm soát nông trại theo yêu cầu, 18/10/2026

Chủ dự án yêu cầu cho phép/không cho phép chơi, giới hạn thời gian và mật khẩu riêng vào vườn. Đã bổ sung trong dashboard, mặc định 15 phút/ngày, 1–120 phút; chưa có mật khẩu thì khóa, cần hồ sơ bé. Mỗi lượt vào xác thực lại; rời tab/đổi bé/tài khoản khóa phiên; Web Locks giới hạn một phiên cùng UID/bé và lưu quota trước khi chơi. Hết giờ/lỗi lưu khóa vườn, không reset ví/kho đồ. Khóa/password PBKDF2 có muối chỉ local, không sync. Đổi/reset mật khẩu cần PIN phụ huynh và giữ nguyên thời gian đã dùng.

Tự kiểm tra migration PIN cũ được tách sang storage RAM để không tráo PIN thật lúc khởi động. Giữ đầy đủ test migration và dữ liệu cũ. Preview cũ chuyển về app để không có vườn chơi không khóa. Không sửa Firestore/schema/progressVersion/scoring/unlock hoặc nội dung.

Gate: Full browser regression: 680, fail=0, exit=0; Farm controls core: 56, fail=0, exit=0; Farm controls physical browser: 67, fail=0, exit=0; Farm economy and growth: 70, fail=0, exit=0; Existing farm browser flows: 74, fail=0, exit=0; V45 to V46 upgrade and art/games: 280, fail=0, exit=0; Controls visual review at three sizes: 7, fail=0, exit=0; Media/PWA/security audit: 85, fail=0, exit=0; English responsive: 3, fail=0, exit=0. Runtime/missing cụ thể và hash trong __v46_validation_evidence.json. Chưa thử thiết bị thật/Safari/Firebase E2E. Chưa được yêu cầu phát hành V46; chờ duyệt local.


## Phê duyệt phát hành V46 — 18/10/2026

Chủ dự án yêu cầu “phát hành” sau khi duyệt V46 local. Cho phép commit/push/deploy V46. Đã đối chiếu SHA-256 toàn bộ 10 tệp source đã kiểm thử; không đổi source sau gate. Production vẫn V45 tại thời điểm chuẩn bị commit. Phải xác minh Pages, byte tài nguyên, kiểm soát phụ huynh, nông trại và offline trên website thật. Không đổi visibility/Firestore hoặc dữ liệu trẻ.
