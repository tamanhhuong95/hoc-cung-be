# Học Cùng Bé

Website giáo dục tĩnh bằng HTML, CSS và JavaScript thuần cho học sinh tiểu học.

**Website production:** `https://tamanhhuong95.github.io/hoc-cung-be/`

## Cách chạy

Mở tệp `index.html` bằng trình duyệt web hiện đại (Chrome, Edge, Firefox hoặc Safari). Không cần cài Node.js, npm hay máy chủ backend.

Trong VS Code, có thể nhấp đúp vào `index.html` trong Explorer rồi chọn mở bằng trình duyệt. Nếu đã cài tiện ích Live Server, cũng có thể chọn **Open with Live Server**.

## Phần đã triển khai

- Trang chủ chọn lớp 1 đến lớp 5; lớp 2–5 thông báo sắp ra mắt.
- Lớp 1 gồm Toán, Tiếng Việt, Tiếng Anh và Trò chơi tư duy; chỉ Toán hoạt động.
- Toán lớp 1 hiện có 12 chuyên đề và 109 level: Số và đếm, So sánh số, Phép cộng, Phép trừ, Điền số, Hình học, Số đến 20, Số đến 100, Bài toán có lời văn, Xem đồng hồ, Đo độ dài và Tiền Việt Nam.
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
- Animation có hỗ trợ `prefers-reduced-motion`; bộ nhận diện thương hiệu và app icon được phục vụ nội bộ, không dùng CDN hay thư viện ảnh bên ngoài.
- Có khu vực **Dành cho phụ huynh** được khóa bằng Parent PIN 4–6 chữ số do phụ huynh tự đặt trên từng thiết bị. Dashboard vẫn tự nhận đủ 12 chuyên đề và mọi level mới, chi tiết từng level, gợi ý luyện thêm, lịch sử 50 bài hoàn thành gần nhất và thao tác xóa tiến độ hai bước bằng mã `XOA`.
- Thời gian học chỉ được ghi nhận khi bé ở màn hình làm bài và tab đang hiển thị. `studyTime` và `history` được bổ sung tương thích ngược trong cùng dữ liệu tiến độ `localStorage`, không thay đổi `progressVersion: 2`.
- Website hoạt động như một **Progressive Web App (PWA)**: sau lần truy cập online đầu tiên, giao diện chính, bài Toán và Tiếng Việt lớp 1, mã nguồn, manifest, logo và icon nội bộ được cache để có thể tiếp tục học và xem tiến độ khi offline; cache hiện là `hoc-cung-be-v21`.
- Bộ nhận diện dùng master logo đầy đủ tại `assets/branding/logo-hoc-cung-be.png`, master app icon không chữ tại `assets/branding/app-icon-hoc-cung-be.png` và bản logo web tối ưu tại `assets/branding/logo-hoc-cung-be-web.png`. Icon PWA/favicons/Apple touch/maskable được sinh từ app icon không chữ trong `assets/icons/`.
- Guest Home chỉ hiển thị logo, “Học vui mỗi ngày”, Đăng nhập/Đăng ký và Học thử. Firebase `onAuthStateChanged()` là nguồn sự thật; khu **Dành cho phụ huynh** chỉ xuất hiện sau đăng nhập và Parent PIN tiếp tục bảo vệ khu này trên thiết bị.
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
- Firebase Authentication và Cloud Firestore dùng Firebase Web config trong `firebase-config.js`. Nếu không có mạng/tài nguyên SDK hoặc Firestore chưa bật, app vẫn học local/Guest Trial bình thường. Service worker cache app shell hiện là `hoc-cung-be-v21` và không xử lý/cache Firebase Auth, Firestore API, Google API, Google Identity, Firebase CDN hoặc reCAPTCHA request.

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
4. Deploy lên GitHub Pages, mở `https://tamanhhuong95.github.io/hoc-cung-be/` khi online để service worker `hoc-cung-be-v21` cập nhật app shell.
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

Code Firestore đã được scaffold an toàn nhưng **không thể tự bật database trong Firebase project**. Kiểm tra endpoint ngày **2 tháng 10 năm 2026** trả `SERVICE_DISABLED` cho `firestore.googleapis.com`, nên Cloud Firestore/API của project `hoc-cung-be-71920` hiện chưa được bật. Chủ dự án cần thực hiện các bước sau trong Firebase Console trước khi test production thật.

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

Rules chỉ cho chủ tài khoản quản lý profile, children, progress `math-grade-1` và document cài đặt `settings/learning` của chính mình, đồng thời whitelist field/schema mà ứng dụng đang ghi. Không có public read/write, UID khác bị chặn, child/settings document không được delete và mọi document hoặc field ngoài cấu trúc đó bị từ chối mặc định. Đường dẫn progress legacy chỉ còn quyền đọc để migration/rollback; ứng dụng mới không ghi hoặc xóa document legacy.

### 3. Cấu trúc collection/document

- `users/{uid}`: `uid`, `displayName`, `email`, `emailVerified`, `createdAt`, `updatedAt`; có thể có `childrenMigrationVersion` và `childrenMigrationChildId`. Không có password hoặc full child objects.
- `users/{uid}/children/{childId}`: `childVersion: 1`, `name`, `grade: "grade-1"`, `birthYear`, `avatar`, `createdAt`, `updatedAt`. `childId` do Firestore tạo tự động, không dùng tên bé.
- `users/{uid}/children/{childId}/progress/math-grade-1`: progress Toán lớp 1 riêng của một bé, history tối đa 50 record, study time và metadata đồng bộ.
- `users/{uid}/children/{childId}/settings/learning`: `{ settingsVersion: 1, dailyTimeLimitMinutes, dailyLessonLimit, breakEnabled, breakAfterMinutes, breakDurationMinutes, allowedTimeEnabled, allowedStartTime, allowedEndTime, soundEnabled, speechEnabled, updatedAt }`. Đây là cài đặt local-first riêng theo `childId`; khi offline app vẫn áp dụng bản local và đồng bộ lại khi có mạng. `allowedStartTime`/`allowedEndTime` có dạng `HH:mm`; nếu giờ bắt đầu lớn hơn giờ kết thúc, khung giờ được hiểu là đi qua nửa đêm (ví dụ `22:00` đến `06:00`).
- Document ID môn học/lớp học độc lập để sau này thêm `math-grade-2`, `vietnamese-grade-1`, `english-grade-1` mà không đổi cây user.

Trong tab **Data**, đăng nhập một account test rồi kiểm tra đúng UID tại `users/{uid}`, child tại `users/{uid}/children/{childId}`, progress tại `users/{uid}/children/{childId}/progress/math-grade-1` và cài đặt tại `users/{uid}/children/{childId}/settings/learning`. Không được thấy Parent PIN, PIN attempts, password, OTP, token, guest trial hoặc feedback draft. Cài đặt âm thanh chỉ có trong document `settings/learning` của đúng bé.

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
- **PWA còn code cũ**: mở online, hard reload và kiểm tra service worker/cache đã lên `hoc-cung-be-v21`.
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
- PWA luôn dùng `localStorage` làm nguồn làm việc trực tiếp. Khi phụ huynh đăng nhập và Firestore đã bật, progress/history/study time được hợp nhất lên cloud; cài đặt học và âm thanh được lưu/sync riêng theo đúng child; Parent PIN và guest trial vẫn chỉ nằm local.