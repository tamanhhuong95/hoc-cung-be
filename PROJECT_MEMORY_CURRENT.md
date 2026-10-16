# Project Memory hiện hành — Học Cùng Bé

Tài liệu PM-6.0,17/10/2026 UTC+7. Production V39 đã phát hành; local V40 hướng dẫn trực quan chưa phát hành. Xem mục V40 cuối tài liệu; giữ các phần cũ làm lịch sử.

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
