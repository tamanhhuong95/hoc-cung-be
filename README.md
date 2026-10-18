# Học Cùng Bé

Website giáo dục tĩnh bằng HTML, CSS và JavaScript thuần cho học sinh tiểu học.

**Website production:** `https://tamanhhuong95.github.io/hoc-cung-be/`

## Trạng thái mới nhất

**V44 nông trại đang ở local, chưa phát hành.** Xem [báo cáo nông trại](__v44_farm_validation_2026-10-18.md). Production gần nhất là V43, đã xác minh ngày17/10/2026; các mục V40/V39 bên dưới là lịch sử.

**Production V40 đã phát hành**, SHA `f189ffa`:14 bài Mỹ thuật/94 bước, thêm hạc và sao, hình trước-sau/zoom/chọn bước. Smoke production63/63 đạt; xem `__v40_production_evidence.json`. Xem [báo cáo V40](__v40_validation_2026-10-17.md).

### Bản production đã xác minh

**Production V39 đã phát hành**, SHA `0c61952`: Xưởng Mỹ thuật (12 bài/48 hình) và Xứ sở tư duy (5 trò). Smoke production43/43 đạt; xem `__v39_production_evidence.json`. Mỹ thuật chưa lưu/sync tiến độ. Xem [báo cáo V39](__v39_validation_2026-10-16.md) và [đối chiếu nội dung](__v39_art_curriculum_review.md). Chạy qua máy chủ HTTP local để dùng đầy đủ PWA/offline.

## Cách chạy

Mở tệp `index.html` bằng trình duyệt web hiện đại (Chrome, Edge, Firefox hoặc Safari). Không cần cài Node.js, npm hay máy chủ backend.

Trong VS Code, có thể nhấp đúp vào `index.html` trong Explorer rồi chọn mở bằng trình duyệt. Nếu đã cài tiện ích Live Server, cũng có thể chọn **Open with Live Server**.

## Phần đã triển khai

- Trang chủ chọn lớp 1 đến lớp 5; lớp 2–5 thông báo sắp ra mắt.
- Lớp 1 hiện có ba môn hoạt động: **Toán lớp 1**, **Tiếng Việt lớp 1** và **Tiếng Anh lớp 1**. Production V36 còn hiển thị trò chơi tư duy sắp ra mắt; branch local V37 có nguyên mẫu **Tìm cặp giống nhau**, chưa phát hành.
- Toán lớp 1 hiện có 12 chuyên đề và 109 level: Số và đếm, So sánh số, Phép cộng, Phép trừ, Điền số, Hình học, Số đến 20, Số đến 100, Bài toán có lời văn, Xem đồng hồ, Đo độ dài và Tiền Việt Nam.
- Tiếng Việt lớp 1 có nền tảng chữ, âm, ghép tiếng, thanh điệu và từ quen thuộc theo dữ liệu riêng `data/vietnamese-grade-1.js`.
- Tiếng Anh lớp 1 hiện có **EN-01 → EN-40, tổng 200 task** trong `data/english-grade-1.js`: nền tảng chữ cái/từ vựng ở EN-01→EN-20 và phần mở rộng giao tiếp ở EN-21→EN-40 về lớp học, nhà ở, thức ăn, nơi chốn, phương tiện, thời tiết, quần áo, cảm xúc, khả năng, thói quen, lời lịch sự, trình tự, story ngắn và Review 2. Đây là nội dung tự viết theo định hướng làm quen, không phải toàn bộ chương trình chính thức.
- Mỗi level Tiếng Anh đi theo flow **Learn → Practice → Review**: xem tranh local, nghe TTS `en-US`, nói theo không chấm phát âm, rồi làm đúng 5 task. Course dùng nhiều dạng tương tác như choice, image-choice, listen-choice, word-to-image, match, letter-order/order, true-false, mini-dialogue-choice và animation-choice.
- Nội dung Tiếng Anh tự viết, phù hợp định hướng làm quen Tiếng Anh lớp 1–2 và trẻ Việt Nam 6–7 tuổi; ưu tiên nghe → nói/lặp lại → nhận biết → đọc → viết rất cơ bản. Kỹ năng được tham chiếu trung lập với **CEFR Pre-A1** và **Cambridge English Pre A1 Starters**, nhưng ứng dụng không phải chương trình được Bộ GDĐT hoặc Cambridge chứng nhận và không sao chép SGK, đề thi, wordlist nguyên khối hay artwork của bên thứ ba.
- Hệ thống `TOPICS` và `LEVELS` là dữ liệu cấu hình động: mỗi chuyên đề có thể có số level bất kỳ (0, 4, 6, 8, 20 hoặc nhiều hơn) mà không cần sửa dashboard hay giao diện.
- Các helper `getLevelsByTopic`, `getLevelCountByTopic`, `getLevelIndexInTopic`, `getNextLevelInTopic` và `getTopicProgress` dùng chung cho chọn level, mở khóa, Học tiếp và dashboard.
- Có object library emoji offline `OBJECT_LIBRARY`/`VISUAL_SETS`: con mèo, con chó, con cá, con bướm, quả táo, quả cam, chiếc bóng, cây bút, viên kẹo, bông hoa và ngôi sao. Text câu hỏi, mẹo nhỏ và giọng đọc dùng cùng object nên luôn khớp hình minh họa.
- Câu đếm, cộng bằng hình ảnh và trừ bằng hình ảnh có object lớn, tự xuống hàng; phép cộng hiển thị hai nhóm, phép trừ đánh dấu rõ nhóm bị bớt.
- Mỗi level mặc định có 5 câu hỏi và 4 đáp án, dùng chung hằng số `DEFAULT_QUESTION_COUNT = 5`. Mỗi câu đúng ngay lần đầu tương ứng 20 điểm; 1/5–5/5 lần lượt là 20–100 điểm. Chuyên đề Xem đồng hồ giữ 10 level tăng dần: nhận biết kim, giờ đúng, giờ rưỡi, 15 phút, 5 phút, từng phút, chọn mặt đồng hồ, kim giây, đọc giờ-phút-giây và thử thách tổng hợp. Bài lời văn dùng emoji theo đúng đồ vật trong câu; đồng hồ, thanh độ dài và thẻ tiền học tập đều được vẽ offline bằng HTML/CSS.
- Level đầu tiên mở sẵn. Level kế tiếp mở khi **điểm tốt nhất** của level trước đạt từ 80/100, tương đương đúng ít nhất 4/5 câu; sau khi đã mở, level luôn giữ trạng thái mở.
- **Guest Trial Mode:** người chưa đăng nhập được xem toàn bộ topic/level và hoàn thành tối đa 2 level khác nhau trên toàn ứng dụng, miễn level hợp lệ theo tiến độ. Danh sách được lưu riêng tại `hoc-cung-be:guest-trial`; làm lại cùng level không tăng lượt và không lưu email, mật khẩu hay token.
- Auth gate và khóa tiến độ là hai trạng thái riêng: sau khi guest đã dùng 2/2, level thứ ba nhận khóa tài khoản `🔐`; user Firebase đã đăng nhập không bị giới hạn trial nhưng vẫn nhận khóa tiến độ `🔒` nếu chưa đạt điều kiện 80%. `startQuiz()` kiểm tra cùng helper nên không thể bỏ qua gate bằng gọi trực tiếp.
- Sau level thử thứ hai, kết quả, điểm, sao, mascot và lời khen vẫn hiển thị; nút tiếp theo đổi thành **🔐 Đăng nhập để học tiếp** cùng nút đăng nhập/đăng ký. Login/logout không xóa trial, progress, history, studyTime hoặc Parent PIN.
- Thư viện level được mở rộng có mục tiêu: Số và đếm 12 level, So sánh 8, Phép cộng 14, Phép trừ 14, Điền số 8, Hình học 7, Số đến 20 có 8, Số đến 100 có 8, Bài toán lời văn 8, Xem đồng hồ 10, Đo độ dài 6 và Tiền Việt Nam 6. Phép cộng/trừ được tách thành các bài ngắn như cộng/trừ 0–5, hình ảnh, số còn thiếu, phạm vi 20, qua 10, lời văn và ôn tập.
- Có sao, điểm, số bài hoàn thành, hiệu ứng trả lời đúng, phản hồi trả lời sai, kết quả tốt nhất từng level và nút Học tiếp/Học lại/Về chủ đề/Về trang chủ.
- Toàn bộ tiến độ được lưu trong `localStorage` của trình duyệt, vẫn dùng `progressVersion: 2`, tự migrate dữ liệu cũ và tự phục hồi nếu dữ liệu bị lỗi. ID của các level cũ được giữ nguyên; khi thêm level, level mới chỉ nhận tiến độ mặc định còn `bestScore`, `bestCorrect`, `bestStars`, `attempts`, `completed`, `unlocked`, `lastPlayedAt`, history và studyTime cũ vẫn được giữ. History mới lưu thêm `questionCount: 5`; best result mới lưu `bestQuestionCount: 5`. Record cũ thiếu hai field này được hiểu là bài 10 câu, nên dashboard vẫn hiển thị đúng `8/10` thay vì `8/5` và không thay đổi `bestScore` cũ.
- Có nút đọc câu hỏi tiếng Việt và cài đặt bật/tắt âm thanh. SpeechSynthesis đọc số đến 100, tiền theo dạng “một nghìn đồng” và thời gian tự nhiên đến giây, ví dụ “tám giờ hai mươi bốn phút ba mươi lăm giây”; âm thanh đúng/sai/hoàn thành được tạo offline bằng Web Audio API.
- Có mascot 🐻 Bạn Gấu tạo bằng emoji và CSS, với trạng thái chờ, vui mừng khi đúng, khuyến khích khi cần thử lại và ăn mừng khi hoàn thành bài.
- Màn hình hoàn thành hiển thị số câu đúng trên mẫu số thực tế, điểm trên thang 100, lời khen tích cực và sao xuất hiện tuần tự. Quy tắc sao: dưới 60 điểm là 0 sao, 60 điểm là 1 sao, 80 điểm là 2 sao và 100 điểm là 3 sao; chỉ từ 80 điểm mới mở level tiếp theo.
- Các card, đáp án, nút quay lại, icon và action button có hiệu ứng nhún bằng CSS (`hover` nâng nhẹ, `active` thu nhỏ), không gây layout shift và có hỗ trợ `prefers-reduced-motion`; bộ nhận diện thương hiệu và app icon được phục vụ nội bộ, không dùng CDN hay thư viện ảnh bên ngoài.
- Có khu vực **Dành cho phụ huynh** được khóa bằng Parent PIN 4–6 chữ số do phụ huynh tự đặt trên từng thiết bị. Dashboard vẫn tự nhận đủ 12 chuyên đề và mọi level mới, chi tiết từng level, gợi ý luyện thêm, lịch sử 50 bài hoàn thành gần nhất và thao tác xóa tiến độ hai bước bằng mã `XOA`.
- Khi phụ huynh chọn **Tiếng Anh lớp 1**, Parent Dashboard có thêm phân tích bốn kỹ năng **Listening, Speaking participation, Reading và Writing** từ progress, history gần đây và metadata curriculum hiện có. Analytics được tính local, không tạo database riêng, không gửi dữ liệu sang AI/third-party analytics và không lấy Toán/Tiếng Việt vào mẫu số.
- Speaking hiện chỉ đo **mức tham gia/luyện tập** qua các lesson thực sự có speaking practice; ứng dụng không có AI pronunciation scoring nên không hiển thị pronunciation accuracy hoặc biến dữ liệu thiếu thành `0%`.
- **V33 Parent Weekly Report** hiển thị báo cáo tuần Thứ Hai–Chủ Nhật theo giờ địa phương của browser: thời gian/ngày học, hoạt động theo ba môn, kết quả gần đây, bốn kỹ năng Tiếng Anh, điểm nổi bật, nội dung nên luyện, tối đa ba bài gợi ý và so sánh tuần trước khi dữ liệu dated thật sự đủ. Báo cáo có empty/partial state, biểu đồ 7 ngày accessible, CTA không bỏ qua khóa level và layout in bằng browser.
- Báo cáo tuần được tính tại thời điểm render từ `progress`, tối đa 50 record `history`, `studyTimeByDate`, curriculum metadata và bé đang được chọn. Ứng dụng không lưu/sync report object, không tạo Firestore analytics/report collection, không gọi AI API, không dùng cloud analytics riêng và không thêm tracking bên thứ ba.
- Thời gian học chỉ được ghi nhận khi bé ở màn hình làm bài và tab đang hiển thị. `studyTime` và `history` được bổ sung tương thích ngược trong cùng dữ liệu tiến độ `localStorage`, không thay đổi `progressVersion: 2`.
- Website hoạt động như một **Progressive Web App (PWA)**: sau lần truy cập online đầu tiên, giao diện chính, dữ liệu Toán/Tiếng Việt/Tiếng Anh lớp 1, artwork English quan trọng, mã nguồn, manifest, logo, nền Văn Miếu – Quốc Tử Giám và icon nội bộ được cache để tiếp tục học và xem tiến độ khi offline; cache production là `hoc-cung-be-v36`; branch nguyên mẫu local dùng `hoc-cung-be-v37` và có `weekly-report.js` cùng `learning-analytics.js` trong app shell.
- Artwork English là WebP local tự tạo trong `assets/english-grade-1/images/` và poster trong `assets/english-grade-1/posters/`; EN-08, EN-12, EN-19, EN-25, EN-27, EN-29 và EN-37 có video WebM local thật, không audio, kèm poster/image và CSS micro-animation fallback. Video không được precache toàn bộ mà dùng runtime cache; khi video chưa có cache hoặc không tải được, lesson vẫn hoạt động bằng ảnh + TTS + text + animation fallback.
- Bộ nhận diện dùng master logo đầy đủ tại `assets/branding/logo-hoc-cung-be.png`, master app icon không chữ tại `assets/branding/app-icon-hoc-cung-be.png` và bản logo web tối ưu tại `assets/branding/logo-hoc-cung-be-web.png`. Icon PWA/favicons/Apple touch/maskable được sinh từ app icon không chữ trong `assets/icons/`.
- Guest Home chỉ giữ một cụm Đăng nhập/Đăng ký trong Hero **Học vui mỗi ngày**; Header chỉ còn Home/Học thử và hai khối phụ huynh/tài khoản phía dưới luôn được ẩn hoàn toàn. Firebase `onAuthStateChanged()` là nguồn sự thật; guest actions chỉ hiện sau khi auth đã xác định trạng thái để tránh flash kéo dài khi refresh. Sau đăng nhập, mọi `data-guest-only` được ẩn, phần chọn lớp đổi thành **CHỌN LỚP – Bé muốn học lớp nào?**, hai khối phụ huynh/tài khoản dư thừa trên Home được ẩn hoàn toàn, và header hiện nút **Chức năng** gồm Thông tin cá nhân, Phân tích kết quả học tập, Hồ sơ của bé, Cài đặt, Đồng bộ dữ liệu, Tài khoản của tôi và Đăng xuất; trạng thái auth được áp lại sau mỗi lần render/navigation Home.
- Một tài khoản Firebase của phụ huynh quản lý tối đa 5 hồ sơ bé. Trẻ không có email, mật khẩu, Phone Auth hoặc Firebase Auth account riêng. Mỗi hồ sơ dùng Firestore auto-ID, có tên, lớp, năm sinh tùy chọn và avatar; hiện chỉ hỗ trợ `grade-1`.
- Sau đăng nhập, tài khoản có một bé sẽ tự chọn bé đó; tài khoản có nhiều bé luôn mở màn hình **Chọn bé đang học**. Home/quiz hiển thị **Đang học**, Dashboard hiển thị **Đang xem tiến độ của**, và nút **Đổi bé** không cần đăng xuất.
- Tiến độ dùng kiến trúc **local-first**: quiz luôn ghi `localStorage` trước, sau đó mới đồng bộ nền/thủ công với Cloud Firestore khi phụ huynh đã đăng nhập và có mạng. Firestore lỗi không chặn bài học, không xóa local và không reset progress.
- Progress local của account được namespace bằng `hoc-cung-be:progress:{childId}`; `hoc-cung-be:active-child` chỉ chứa child ID. Guest Trial vẫn dùng dữ liệu riêng và không tự merge vào một bé sau đăng ký nếu chưa có lựa chọn đích an toàn.
- Firestore dùng `users/{uid}` cho profile phụ huynh, `users/{uid}/children/{childId}` cho hồ sơ bé và `users/{uid}/children/{childId}/progress/math-grade-1` cho Toán lớp 1. Mọi lần sync được xác định bằng `uid + childId + courseId`, không merge chéo hai bé.
- Cloud sync **tiến độ** chỉ gửi progress level, kết quả tốt nhất, attempts, trạng thái hoàn thành/mở khóa, lịch sử, thời gian học, `totalCompleted` và `progressVersion`. Payload tiến độ không gửi Parent PIN/PIN attempts, password, OTP, auth token, guest trial, audio settings hoặc feedback draft; audio chỉ nằm trong document cài đặt học riêng của từng bé nêu bên dưới.
- Khi local và cloud cùng có dữ liệu, ứng dụng merge từng field thay vì chọn một bên: điểm/sao dùng giá trị tốt hơn, kết quả đúng và mẫu số đi cùng record điểm tốt nhất, boolean dùng OR, thời gian gần nhất dùng timestamp mới hơn, attempts dùng MAX kết hợp số history đã dedupe để tránh cộng mù quáng.
- History mới có `historyId`; history cũ được gắn fingerprint ổn định từ `levelId + score + correct + questionCount + completedAt`, dedupe và giữ tối đa 50 lượt mới nhất. Record `/10` cũ và `/5` mới giữ đúng `questionCount`.
- Study time có thêm `studyTimeByDate`; mỗi ngày merge bằng MAX để tránh double count khi cùng dữ liệu đã xuất hiện ở hai phía. Tổng cũ được giữ trong `legacySeconds`, vì vậy migration không làm mất `studyTime.totalSeconds` cũ và vẫn giữ `progressVersion: 2`.
- Auto sync chạy khi đăng nhập, hoàn thành quiz, app chuyển background, mở/cập nhật Parent Dashboard và khi mạng trở lại nếu còn dữ liệu pending. Thay đổi thường được debounce 5 giây; không ghi từng câu hoặc từng giây.
- Mỗi hồ sơ bé có thêm **Cài đặt cho bé** local-first: giới hạn thời gian học/số bài mỗi ngày, khung giờ được học, lời nhắc nghỉ và bật/tắt hiệu ứng âm thanh hoặc đọc câu hỏi. Thay đổi cần xác thực Parent PIN nếu PIN đã được đặt. Cài đặt lưu riêng theo `uid + childId`, chỉ đồng bộ vào `users/{uid}/children/{childId}/settings/learning`; đây là cài đặt học của bé, không phải Parent PIN, mật khẩu, OTP hoặc token.
- Form phụ huynh có đăng ký/đăng nhập Email + Mật khẩu, quên mật khẩu, email verification, đổi mật khẩu có re-authentication, hiển thị trạng thái email và liên kết số điện thoại Việt Nam vào chính Firebase user hiện có bằng Phone Auth + visible reCAPTCHA. Flow link dùng `linkWithCredential()` và bắt buộc giữ nguyên UID; mật khẩu, OTP, `verificationId` và token không được ứng dụng lưu vào storage hoặc Firestore.
- Firebase Authentication và Cloud Firestore dùng Firebase Web config trong `firebase-config.js`. Nếu không có mạng/tài nguyên SDK, app vẫn học local/Guest Trial bình thường. Service worker cache app shell hiện là `hoc-cung-be-v36` và không xử lý/cache Firebase Auth, Firestore API, Google API, Google Identity, Firebase CDN hoặc reCAPTCHA request.

## Mở rộng level

Thêm một level bằng cách thêm một object vào `LEVELS` trong `script.js`, gồm tối thiểu `id`, `topic`, `title`, `type`, `min`, `max` và `order`. Có thể cấu hình thêm `questionCount`, `unlockScore`, `imageMode`, `visualSet` và `hint`. Không đổi ID của level đã phát hành để giữ tiến độ cũ. Nếu thêm loại `type` mới, bổ sung generator tương ứng trong `generateQuestion()`.

Các kiểm tra không làm thay đổi dữ liệu thật được xuất ra Console qua `window.__hocCungBeFiveQuestionTests` (A–O), `window.__hocCungBeClockTests` (A–J và các mốc bổ sung), `window.__hocCungBeGuestTrialTests` (K–S), `window.__hocCungBeDynamicLevelTests` (A–L), `window.__hocCungBeParentAuthTests` (Phone Link A–R), `window.__hocCungBeChildProfilesTests` (Multiple Children A–T), `window.__hocCungBeParentPinFeedbackTests` (A–L), `window.__hocCungBeChildSettingsTests` (A–X) và các test progress/dashboard/PWA hiện có.

## Parent PIN và góp ý phụ huynh

### Parent PIN cục bộ

- Lần đầu mở **Dành cho phụ huynh**, phụ huynh tạo Parent PIN gồm đúng 4–6 chữ số và xác nhận lại. PIN là khóa cục bộ trên **thiết bị/trình duyệt này**, không phải Firebase password và không yêu cầu đăng nhập Firebase.
- Ứng dụng không lưu PIN nguyên văn. PIN mới dùng Web Crypto API PBKDF2 với SHA-256, salt ngẫu nhiên tối thiểu 16 byte, 250000 iterations và derived key 256 bit. Record `hoc-cung-be:parent-pin` có dạng `{ version: 2, algorithm: "PBKDF2-SHA256", iterations: 250000, salt, hash }`.
- Không còn tạo PIN mới bằng fallback FNV-1a hoặc thuật toán yếu. Nếu trình duyệt không có Web Crypto cần thiết, app chặn tạo/đổi PIN và yêu cầu dùng Chrome, Edge hoặc trình duyệt hiện đại; phần học vẫn hoạt động bình thường.
- Record PIN cũ `SHA-256` + salt hoặc `fallback-fnv1a` vẫn được xác minh để tương thích. Sau khi phụ huynh nhập đúng PIN cũ trên trình duyệt hỗ trợ Web Crypto, app lập tức ghi đè nó bằng record PBKDF2 Version 2; không cần tạo lại PIN.
- Mỗi lần reload, mở lại PWA hoặc tạo phiên trang mới, khu phụ huynh yêu cầu PIN lại. Trạng thái mở chỉ nằm trong bộ nhớ của phiên hiện tại, không có key “đã mở khóa” trong `localStorage`.
- Sau 5 lần nhập sai liên tiếp, khóa tạm 30 giây bằng key `hoc-cung-be:parent-pin-attempts`; sau thời gian này phụ huynh có thể thử lại. Nhập đúng sẽ xóa bộ đếm sai.
- Trong Dashboard có mục **Đổi mã bảo mật**: nhập PIN hiện tại, PIN mới và xác nhận PIN mới. Hash/salt mới sẽ thay thế record cũ.
- **Quên mã bảo mật:** hiện chưa có reset tự động và không có nút xóa/bỏ qua PIN, nhằm tránh tạo backdoor cho trẻ. Khi Firebase Authentication production đã cấu hình hoàn chỉnh, có thể bổ sung luồng reset yêu cầu phụ huynh xác thực tài khoản thật trước khi xóa/reset PIN cục bộ.

### Góp ý cho Học Cùng Bé

- Form **💬 Góp ý cho Học Cùng Bé** chỉ có trong Dashboard phụ huynh. Nó xác thực loại góp ý, tiêu đề, nội dung 10–2000 ký tự, email liên hệ tùy chọn và checkbox đồng ý phản hồi.
- Không có backend feedback ở phiên bản này, và app không lưu góp ý vĩnh viễn vào `localStorage`. Nút gửi tạo liên kết `mailto:` có subject/body được encode an toàn; email client mở ra để phụ huynh tự gửi. Vì `mailto:` không xác nhận gửi thật, UI chỉ thông báo email client đã mở.
- Địa chỉ nhận nằm tại `feedback-config.js`: `window.HOC_CUNG_BE_FEEDBACK_EMAIL = ""`. Repository để trống có chủ đích. Chủ dự án cần thay bằng inbox do mình quản lý (xem `feedback-config.example.js`) trước khi bật gửi email. Không tự bịa email nhận góp ý.
- Checkbox kỹ thuật là tùy chọn. Nếu được chọn, email chỉ kèm user agent, URL hiện tại và phiên bản cache app; nó không kèm PIN, Firebase password, OTP, email đăng nhập, số điện thoại, toàn bộ `localStorage` hay chi tiết progress. Sau này có thể thay hàm `buildFeedbackMailto()` bằng Firebase/Firestore hoặc API backend có xác thực, validation và chính sách lưu trữ phù hợp.

## Thiết lập Firebase Authentication

> **Trạng thái repository ngày 2 tháng 10 năm 2026:** Firebase Web config cho project `hoc-cung-be-71920` đã được đặt trong `firebase-config.js`, nên website có thể khởi tạo Firebase Authentication khi online. Email/Password và Phone Auth chỉ hoạt động sau khi chủ project bật từng provider trong Firebase Console.

### 1. Tạo Firebase project

1. Mở Firebase Console và đăng nhập bằng tài khoản Google của phụ huynh/chủ dự án.
2. Chọn **Add project** (Thêm dự án), đặt tên, rồi hoàn tất các bước tạo project.
3. Trong trang Overview của project, chọn biểu tượng **Web** (`</>`) để thêm ứng dụng web.
4. Đặt nickname, ví dụ `hoc-cung-be-web`. Không cần bật Firebase Hosting vì website đang deploy bằng GitHub Pages.
5. Firebase sẽ hiện một object `firebaseConfig`. Đây là **Firebase Web config**, không phải service account và không phải private key.

### 2. Đặt Web config vào đúng file

1. Mở file `d:/anh hương/o 1/saoluu3012/Desktop/Học Cùng Bé/firebase-config.example.js` để xem cấu trúc.
2. Mở `d:/anh hương/o 1/saoluu3012/Desktop/Học Cùng Bé/firebase-config.js`.
3. `firebase-config.js` hiện đã chứa Firebase Web config của project `hoc-cung-be-71920`; khi Firebase Console cấp config mới, chỉ cập nhật các giá trị trong object `window.HOC_CUNG_BE_FIREBASE_CONFIG`.
4. Không đặt vào file này: password, OTP, refresh token, reset token, service account JSON, private key, Firebase Admin SDK credential hoặc secret backend.
5. Commit/push `firebase-config.js` chỉ sau khi kiểm tra nó đúng là **Web config**. Firebase Web config được dùng ở client theo kiến trúc Firebase Web; quyền truy cập Cloud Firestore phải được bảo vệ bằng Security Rules. Ứng dụng không dùng Realtime Database.

### 3. Bật Email/Password

1. Trong Firebase Console, vào **Build → Authentication** rồi chọn **Get started** nếu đây là lần đầu.
2. Mở tab **Sign-in method**.
3. Chọn **Email/Password**, bật tùy chọn **Email/Password**, sau đó nhấn **Save**.
4. Trong **Authentication → Settings**, rà soát phần email/action URLs và tính năng bảo vệ email enumeration nếu Firebase Console hiển thị chúng.
5. Sau khi deploy config thật, đăng ký bằng form **Đăng ký tài khoản phụ huynh**. Ứng dụng gọi Firebase `createUserWithEmailAndPassword`, cập nhật họ tên, gọi `sendEmailVerification`, rồi cập nhật cùng document profile `users/{uid}`. Nếu Firestore tạm lỗi, email xác minh và tài khoản Auth vẫn hoạt động; profile sẽ được thử cập nhật lại khi auth state chạy lần sau.
6. Kiểm tra hộp thư của email vừa đăng ký và mở link **Email address verification**. Phụ huynh chưa xác minh vẫn có thể cho bé học và đồng bộ tiến độ.
7. Quay lại **Tài khoản của tôi** rồi bấm **Kiểm tra lại trạng thái xác minh**. Ứng dụng gọi `reload(user)`, đọc lại `auth.currentUser.emailVerified`, cập nhật UI và trường `emailVerified`/`updatedAt` trong Firestore profile.
8. Nếu chưa nhận được thư, bấm **Gửi lại email xác minh**. Nút có cooldown 45 giây; Firebase `auth/too-many-requests` được hiển thị bằng thông báo tiếng Việt thân thiện. Token xác minh không được ứng dụng lưu.

### 4. Authorized domains cho GitHub Pages và local

1. Trong **Build → Authentication → Settings**, tìm mục **Authorized domains**.
2. Thêm chính xác domain production: `tamanhhuong95.github.io`.
3. Khi test local, kiểm tra `localhost` đã có trong danh sách; nếu chưa, thêm `localhost` theo hướng dẫn trong Firebase Console. Không nhập đường dẫn `/hoc-cung-be/` vào ô domain.
4. Deploy lên GitHub Pages, mở `https://tamanhhuong95.github.io/hoc-cung-be/` khi online để service worker `hoc-cung-be-v36` cập nhật app shell.
5. Luồng hiện tại dùng action URL mặc định của Firebase nên không thêm `actionCodeSettings` không cần thiết. Nếu sau này cấu hình action URL tùy chỉnh, URL production phải là `https://tamanhhuong95.github.io/hoc-cung-be/`, không dùng localhost trong production.

### 5. Quên mật khẩu, đổi mật khẩu và re-authentication

- **Test quên mật khẩu:** mở màn hình **Quên mật khẩu**, nhập email hợp lệ và bấm gửi. Form gọi `sendPasswordResetEmail()`. Dù email có tồn tại hay Firebase trả lỗi enumeration, UI dùng cùng thông báo: “Nếu email này đã được đăng ký, hướng dẫn đặt lại mật khẩu sẽ được gửi tới hộp thư.”
- **Test đổi mật khẩu:** đăng nhập → **Tài khoản của tôi** → **Đổi mật khẩu** → nhập mật khẩu hiện tại, mật khẩu mới tối thiểu 6 ký tự và nhập lại mật khẩu mới.
- Trước `updatePassword()`, ứng dụng luôn tạo `EmailAuthProvider.credential(user.email, currentPassword)` và gọi `reauthenticateWithCredential()`. Mật khẩu hiện tại sai được hiển thị là “Mật khẩu hiện tại chưa đúng.”; lỗi recent-login được xử lý bằng chính flow re-auth này.
- Sau khi đổi thành công, cả ba input mật khẩu được xóa. Mật khẩu hiện tại/mới, reset code và verification code không được ghi vào localStorage, Firestore hoặc log.

### 6. Tùy chỉnh email template

Trong Firebase Console, vào **Authentication → Templates** và rà soát:

- **Email address verification**
- **Password reset**

Có thể chỉnh sender name, subject và message theo thương hiệu Học Cùng Bé. Không cần bật billing chỉ để dùng các email template này. Firebase có quota/chống lạm dụng email theo project và có thể trả `auth/too-many-requests`; không nên gửi lặp liên tục khi test.

### 7. Bật Phone provider và kiểm thử bằng test phone number (không gửi SMS thật)

1. Mở **Firebase Console → Authentication → Sign-in method → Phone** và bật Phone provider nếu Firebase Console cho phép.
2. Trong cấu hình Phone, mở **Phone numbers for testing** / **Test phone numbers**.
3. Nhấn **Add phone number**, nhập số test ở định dạng quốc tế, ví dụ `+84912345678`, rồi tự đặt OTP test 6 chữ số trong Console. Không hardcode số hoặc OTP test vào source code.
4. Nhấn **Save** và bảo đảm số test chưa thuộc một Firebase account khác.
5. Mở website production GitHub Pages, đăng nhập tài khoản Email/Password, ghi lại UID hiện tại trong Firebase Console, rồi vào **Tài khoản của tôi → Liên kết số điện thoại**.
6. Nhập `0912345678`; ứng dụng chuẩn hóa thành `+84912345678`, hiển thị `RecaptchaVerifier` visible, rồi dùng `PhoneAuthProvider.verifyPhoneNumber()` để nhận `verificationId` chỉ trong memory.
7. Nhập OTP test đã cấu hình trong Console và bấm **Xác minh và liên kết**. Ứng dụng tạo `PhoneAuthCredential` rồi bắt buộc gọi `linkWithCredential(auth.currentUser, credential)`; flow link không gọi `signInWithPhoneNumber()` hoặc `signInWithCredential()` và không tạo UID mới.
8. Kiểm tra lại Firebase Console: user cũ có thêm Phone provider, `phoneNumber` hiện trên UI, và UID trước/sau phải giống nhau. Nếu UID khác, ứng dụng coi là lỗi nghiêm trọng và không tự merge hoặc chuyển progress.
9. `Firebase Auth user.phoneNumber` là source of truth. Ứng dụng không ghi `phoneNumber` vào Firestore profile nên `firestore.rules` không cần thêm field; Rules vẫn khóa dữ liệu theo `request.auth.uid == userId`.
10. OTP, `verificationId`, Firebase token và reCAPTCHA token không được ghi vào localStorage, sessionStorage, Firestore, IndexedDB hoặc log. Nút **Gửi lại mã** có cooldown 45 giây và tạo `verificationId` mới.

### 8. SMS production và billing

- Không tự bật gửi SMS production và không tự thay đổi billing. Phone Auth/SMS có thể yêu cầu kích hoạt billing hoặc chịu hạn mức/quota tùy Firebase project, quốc gia và chính sách Firebase tại thời điểm cấu hình.
- Chỉ dùng **test phone numbers** ở bước hiện tại để không phát sinh SMS thật. Trước khi bật production, chủ dự án cần tự rà soát pricing, quota, reCAPTCHA và yêu cầu billing ngay trong Firebase Console.

### 9. Kiểm tra sau khi cấu hình

1. Mở trang production khi có Internet và hard reload một lần sau deploy.
2. Mở DevTools Console và chạy `window.__hocCungBeParentAuthTests`; xác nhận Phone Link A–R đều `passed: true`. Bộ test dùng mock helper, không tạo account, không gửi email/SMS và không gọi reCAPTCHA production.
3. Test đăng ký và xác nhận UI báo email đích; mở email verification, quay lại app và bấm **Kiểm tra lại trạng thái xác minh**.
4. Test resend, quên mật khẩu và đổi mật khẩu/re-authentication theo các bước trên.
5. Test Phone Link trên production GitHub Pages bằng test number trong Console; đối chiếu UID trước/sau, phone provider và số điện thoại trên cùng user.
6. Kiểm tra Firestore `users/{uid}` chỉ có một profile; Phone Link không thêm `phoneNumber` vào document và không đổi progress document.
7. Reload/PWA mở lại để kiểm tra `onAuthStateChanged()` tự cập nhật UI và Cloud Sync vẫn chạy dù email chưa verified.
8. Tắt Internet sau lần tải online: bài học, localStorage progress, history, studyTime, dashboard và app shell vẫn hoạt động; Phone Link phải báo “Cần kết nối Internet để xác minh số điện thoại.” thay vì làm ứng dụng lỗi.

## Bật Cloud Firestore và đồng bộ tiến độ

Cloud Firestore của project `hoc-cung-be-71920` đã được bật và production Rules có whitelist đóng cho `math-grade-1`, `vietnamese-grade-1`, `english-grade-1` theo xác nhận ngày **9 tháng 10 năm 2026**. Các bước dưới đây được giữ làm hướng dẫn cấu hình và đối chiếu cho môi trường mới; release vẫn phải chạy authenticated Cloud Sync test trước khi commit/push.

### 1. Tạo Cloud Firestore database

1. Mở Firebase Console và chọn project `hoc-cung-be-71920`.
2. Vào **Build → Firestore Database**.
3. Chọn **Create database**.
4. Chọn vị trí database phù hợp với người dùng chính. Vị trí đã chọn thường không thể đổi trực tiếp về sau.
5. Có thể chọn **Production mode** rồi publish rules trong bước kế tiếp. Không để test mode/public write hoạt động lâu dài.

Nếu Firestore chưa được bật, Auth và bài học local vẫn hoạt động; trạng thái sync sẽ báo lỗi/chưa đồng bộ và dữ liệu local không bị xóa.

### 2. Publish Security Rules

Repository có file `firestore.rules`. Rules yêu cầu có Firebase Authentication và chỉ cho user đọc/ghi đúng cây dữ liệu mang UID của chính họ:

```text
users/{uid}
users/{uid}/children/{childId}
users/{uid}/children/{childId}/progress/{courseId}
users/{uid}/children/{childId}/settings/learning
```

Trong Firebase Console:

1. Vào **Build → Firestore Database → Rules**.
2. Sao chép toàn bộ nội dung `firestore.rules` vào editor.
3. Nhấn **Publish**.
4. Không dùng `allow read, write: if true` và không mở public write.

Rules chỉ cho chủ tài khoản quản lý profile, children, progress thuộc whitelist đóng `math-grade-1`, `vietnamese-grade-1`, `english-grade-1` và document cài đặt `settings/learning` của chính mình, đồng thời whitelist field/schema mà ứng dụng đang ghi. Không có public read/write, UID khác bị chặn, child/settings document không được delete và mọi document hoặc field ngoài cấu trúc đó bị từ chối mặc định. Đường dẫn progress legacy chỉ còn quyền đọc để migration/rollback; ứng dụng mới không ghi hoặc xóa document legacy.

### 3. Cấu trúc collection/document

- `users/{uid}`: `uid`, `displayName`, `email`, `emailVerified`, `createdAt`, `updatedAt`; có thể có `childrenMigrationVersion` và `childrenMigrationChildId`. Không có password hoặc full child objects.
- `users/{uid}/children/{childId}`: `childVersion: 1`, `name`, `grade: "grade-1"`, `birthYear`, `avatar`, `createdAt`, `updatedAt`. `childId` do Firestore tạo tự động, không dùng tên bé.
- `users/{uid}/children/{childId}/progress/{courseId}`: progress riêng của một bé cho đúng một course trong whitelist `math-grade-1`, `vietnamese-grade-1`, `english-grade-1`; history tối đa 50 record, study time và metadata đồng bộ.
- `users/{uid}/children/{childId}/settings/learning`: `{ settingsVersion: 1, dailyTimeLimitMinutes, dailyLessonLimit, breakEnabled, breakAfterMinutes, breakDurationMinutes, allowedTimeEnabled, allowedStartTime, allowedEndTime, soundEnabled, speechEnabled, updatedAt }`. Đây là cài đặt local-first riêng theo `childId`; khi offline app vẫn áp dụng bản local và đồng bộ lại khi có mạng. `allowedStartTime`/`allowedEndTime` có dạng `HH:mm`; nếu giờ bắt đầu lớn hơn giờ kết thúc, khung giờ được hiểu là đi qua nửa đêm (ví dụ `22:00` đến `06:00`).
- Document ID môn học/lớp học độc lập để sau này thêm `math-grade-2`, `vietnamese-grade-1`, `english-grade-1` mà không đổi cây user.

Trong tab **Data**, đăng nhập một account test rồi kiểm tra đúng UID tại `users/{uid}`, child tại `users/{uid}/children/{childId}`, progress từng môn tại `users/{uid}/children/{childId}/progress/{courseId}` và cài đặt tại `users/{uid}/children/{childId}/settings/learning`. Không được thấy Parent PIN, PIN attempts, password, OTP, token, guest trial hoặc feedback draft. Cài đặt âm thanh chỉ có trong document `settings/learning` của đúng bé.

### 4. Tạo, sửa và đổi hồ sơ bé

- Sau đăng nhập lần đầu, nếu chưa có child và không có progress legacy, ứng dụng yêu cầu tạo hồ sơ bé đầu tiên.
- Form gồm tên, năm sinh tùy chọn, lớp và avatar. Giai đoạn này chỉ cho Lớp 1 và tối đa 5 bé/tài khoản.
- Có thể sửa tên, năm sinh và avatar; không đổi `childId`. Chưa có chức năng xóa hồ sơ bé để tránh xóa nhầm toàn bộ progress.
- Khi có từ hai bé trở lên, màn hình chọn bé hiển thị avatar, tên, lớp, số level hoàn thành và tổng sao. Đổi bé flush study time, hủy quiz đang làm, dừng timer/overlay nhắc nghỉ của bé cũ, rồi tải lại progress, dashboard và cài đặt riêng theo child mới.

### 5. Migration tài khoản cũ

- Nếu account chưa có child nhưng có `users/{uid}/progress/math-grade-1`, transaction tạo đúng một child mặc định **Bé 1**, copy progress sang child mới và ghi `childrenMigrationVersion: 1` cùng `childrenMigrationChildId` vào parent profile.
- Marker và toàn bộ bản copy cloud được ghi atomically; sau đó ứng dụng đọc lại progress mới để xác minh. Chỉ sau xác minh child mới được dùng.
- Migration idempotent: chạy lại dùng child ID trong marker, không tạo thêm **Bé 1**. Document progress legacy không bị xóa và chỉ còn read-only trong rules để rollback.
- Nếu thiết bị đang có local progress legacy của account cũ, dữ liệu đó được copy sang namespace local của child migration rồi merge với cloud. Việc này chỉ áp dụng cho migration account cũ; guest trial/guest progress của đăng ký mới không tự merge vào child.

### 6. Merge và local-first

- Cloud trống + local có dữ liệu: upload local sau lần login đầu tiên.
- Local trống + cloud có dữ liệu: tải cloud, normalize rồi ghi xuống local.
- Hai bên đều có dữ liệu: merge theo từng field, ghi kết quả vào cả local và cloud bằng Firestore transaction.
- `bestScore`/`bestStars`: MAX. Nếu bằng điểm, `bestCorrect` cao hơn thắng; `bestQuestionCount` đi cùng record thắng.
- `attempts`: không cộng hai phía; dùng MAX và đối chiếu số history đã dedupe để giảm double count.
- `completed`/`unlocked`: OR. `lastPlayedAt`: timestamp mới hơn.
- History mới có ID phiên; history cũ dùng fingerprint ổn định và giới hạn 50.
- Study time dùng MAX theo từng ngày; tổng legacy cũ được giữ riêng để không mất dữ liệu.
- Logout chỉ dừng sync, không xóa local progress. Guest không ghi Firestore và không bắt buộc tạo child. Nếu logout, đổi account hoặc đổi child khi transaction cũ còn chạy, kết quả của phiên cũ không được áp ngược xuống namespace local của phiên mới.

### 7. Test đồng bộ hai thiết bị

1. Bật Firestore và publish rules trước.
2. Trên thiết bị A, đăng nhập, chọn cùng một bé, hoàn thành một level rồi chờ trạng thái **Đã đồng bộ**.
3. Trên thiết bị B, đăng nhập cùng account, chọn đúng bé đó và nhấn **☁️ Đồng bộ tiến độ**.
4. Kiểm tra điểm, số câu đúng/mẫu số, sao, mở khóa, history và study time xuất hiện đúng.
5. Tạo kết quả tốt hơn ở A và kết quả thấp hơn ở B; đồng bộ hai bên và xác nhận kết quả tốt hơn không bị ghi đè.
6. Tắt mạng, học thêm một level, xác nhận quiz vẫn hoàn thành local và trạng thái là **Không có mạng/Chưa đồng bộ**. Bật mạng lại để app sync pending.

### 8. Quota và chi phí

- Thiết kế không dùng realtime listener, không write từng câu và không write từng giây. Mỗi chu kỳ thường đọc một progress document và ghi tối đa profile + progress document.
- Sync thay đổi thường được debounce 5 giây; trigger quan trọng gồm login, hoàn thành quiz, background, dashboard, manual sync và online trở lại.
- Cloud Firestore có quota và có thể phát sinh chi phí theo số lần đọc/ghi, dung lượng và băng thông tùy plan/chính sách hiện hành. Hãy theo dõi trang Usage trong Firebase Console.
- Repository **không bật billing tự động, không nâng plan và không tạo budget**. Chủ dự án phải tự quyết định mọi thay đổi billing. Nếu dùng billing, nên cấu hình budget/alert; budget alert không phải hard spending cap.

### 9. Troubleshooting

- **`permission-denied`**: kiểm tra user đã đăng nhập, UID trong path, và rules đã Publish đúng từ `firestore.rules`.
- **`failed-precondition` / database chưa tồn tại**: vào **Build → Firestore Database → Create database**.
- **Sync báo lỗi nhưng quiz vẫn chạy**: đây là hành vi local-first dự kiến; không xóa localStorage, sửa cấu hình/mạng/rules rồi bấm sync lại.
- **Thiết bị mới chưa thấy dữ liệu**: xác nhận dùng cùng Firebase account, có mạng, document đúng UID tồn tại và nhấn manual sync.
- **`PWA còn code cũ`**: mở online, hard reload và kiểm tra service worker/cache đã lên `hoc-cung-be-v36`.
- **History trùng từ dữ liệu rất cũ**: record không ID chỉ được dedupe khi năm field fingerprint giống hoàn toàn; timestamp khác được coi là lượt học khác.

### 10. Self-test Multiple Children, Child Settings và Cloud Sync

Mở DevTools Console và chạy:

```js
window.__hocCungBeCloudSyncTests
window.__hocCungBeChildProfilesTests
window.__hocCungBeChildSettingsTests
```

Multiple Children A–T kiểm tra tạo hai child, ID/namespace khác nhau, đổi active child, không trộn progress, đường dẫn cloud theo child, dashboard/quiz theo active child, migration marker/legacy retention, Parent PIN/Email/Phone/Guest không bị ảnh hưởng, child ID an toàn, giới hạn 5 và PWA. Child Settings A–X kiểm tra Guest/Parent UI, namespace riêng cho Bé A/B, time/lesson limit, break, khung giờ thường và qua nửa đêm, âm thanh/đọc câu hỏi theo bé, Parent PIN, offline/local-first, Firestore path/rules, đổi bé, Guest Trial, Cloud/Auth/Phone, responsive layout và PWA shell. Đây là giới hạn học tập trong Học Cùng Bé, không phải parental control cấp thiết bị hoặc cơ chế chống can thiệp tuyệt đối. Cloud Sync kiểm tra merge progress hiện có cùng isolation key theo child. Runner `py __run_browser_tests.py` còn fail nếu có self-test fail, `window.error` hoặc `unhandledrejection`.

### Chính sách quyền riêng tư placeholder

Màn hình **Chính sách quyền riêng tư** trong app là placeholder cần chủ sở hữu rà soát trước khi public chính thức. Tài khoản là của phụ huynh; Firebase có thể xử lý email/tên phục vụ login/xác thực; số điện thoại chỉ được xử lý khi phụ huynh tự liên kết qua Firebase/Google; progress/history/studyTime và cài đặt học của từng bé được lưu local-first và có thể đồng bộ Cloud Firestore khi đăng nhập. Parent PIN, password, OTP, token và guest trial không nằm trong payload cloud. Cần bổ sung đơn vị vận hành, thông tin liên hệ, thời hạn lưu trữ, quyền của người dùng và Điều khoản sử dụng phù hợp trước khi công bố.

## Cài ứng dụng

- **Android / Chrome / Edge trên máy tính:** Khi trình duyệt hỗ trợ, nút **📲 Cài Học Cùng Bé** sẽ xuất hiện ở trang chủ. Chọn nút này rồi xác nhận lời nhắc cài đặt của trình duyệt.
- **iPhone / iPad:** Mở website bằng Safari, nhấn **Chia sẻ** rồi chọn **Thêm vào Màn hình chính**. Website hiển thị hướng dẫn nhỏ một lần và có thể đóng hướng dẫn này.
- Khi đã mở ở chế độ ứng dụng độc lập (standalone), nút cài và hướng dẫn iOS sẽ tự ẩn.
- V35 là bản **quality fixes**: sửa TTS không đọc lộ đáp án ở các câu Tiếng Việt, bổ sung mặt đồng hồ trực quan cho bài nhận biết kim, cân lại vị trí đáp án theo nội dung authored và cải thiện distractor chính tả. Không mở rộng level/câu, không đổi scoring, unlock, progressVersion hay Firestore schema/rules.
- PWA luôn dùng `localStorage` làm nguồn làm việc trực tiếp. Khi phụ huynh đăng nhập và Firestore đã bật, progress/history/study time được hợp nhất lên cloud; cài đặt học và âm thanh được lưu/sync riêng theo đúng child; Parent PIN và guest trial vẫn chỉ nằm local.
## Kiểm chứng V36 local — lịch sử trước phát hành 16/10/2026

Tại thời điểm review, V36 chưa commit/push/deploy. Sau quyết định mới, V36 đã phát hành; xem trạng thái hiện hành dưới đây. Full regression đạt **29 suites / 466 checks**, 0 failure, 0 runtime error, không thiếu suite, exit code 0. Responsive 375x812, 768x1024 và 1280x900 đạt; audit media/PWA/security 85 checks đạt; smoke click vật lý và offline 13 checks đạt.

Đã sửa vòng course-changed/refresh của Home, giữ context topic/level khi đọc gợi ý, nút xác nhận rời quiz và CTA đăng nhập của guest hết lượt. Kiến trúc, progressVersion=2, schema/rules, scoring/unlock và dữ liệu học được giữ nguyên.

Chi tiết, giới hạn và bước tiếp theo: [báo cáo validation](__v36_validation_2026-10-16.md), [Memory hiện hành](PROJECT_MEMORY_CURRENT.md). Chạy lại bằng `py __run_browser_tests.py`, `py __run_english_responsive.py`, `py __audit_english_videos.py`, `py __run_v36_smoke.py`. Kết quả local không thay thế kiểm chứng production.

Review tiếp V36 ngày 16/10/2026 đã sửa việc cập nhật thẻ Học tiếp theo auth, phục hồi marker sau đồng bộ và điều khiển Tab/Shift+Tab/Escape của dialog rời bài. Không đổi Auth/Firestore hoặc dữ liệu học; xem mục review trong báo cáo validation.

Quyết định tiếp theo ngày 16/10/2026: phát hành V36 sau gate local đã đạt, xác minh production rồi triển khai một trò chơi mẫu “Tìm cặp giống nhau”. Các số liệu và điểm dừng trong mục kiểm chứng ở trên mô tả thời điểm review; trạng thái phát hành sẽ được ghi theo SHA/deployment thực tế.


## Trạng thái hiện hành — 16/10/2026

**Production V36 đã phát hành**: `f600cbfb2a1adc5bdf3d28264830bd657c13b7fd`, [Pages thành công](https://github.com/tamanhhuong95/hoc-cung-be/actions/runs/38924257691). Bốn asset production khớp commit; smoke production 13/13, exit 0. Bằng chứng: [production V36](__v36_production_evidence.json).

**Nguyên mẫu V37 chỉ local** trên `codex/thinking-match-pilot`: Lớp 1 → Trò chơi tư duy → Tìm cặp giống nhau. Bốn cặp, tám thẻ, chơi lại, chuột/bàn phím và offline. Ván chỉ lưu trong bộ nhớ, không tạo điểm học/history/quota hoặc dữ liệu sync. Settings kiểm tra khi bắt đầu; thời gian game chưa được ghi hoặc tính vào thời gian học ba môn.

Gate V37: **30 suites/497 checks, fail=0, runtime=0, missing=[], exit=0**. Thao tác game/cập nhật V36/offline 24/24; PWA smoke 13/13; responsive 3 kích thước; audit 85/85. Chưa commit/push/deploy game. [Báo cáo và giới hạn](__v37_validation_2026-10-16.md), [Memory hiện hành](PROJECT_MEMORY_CURRENT.md). Chạy các runner hiện hành tuần tự theo báo cáo; runner V36 là bằng chứng lịch sử, không chạy lên candidate V37.


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
