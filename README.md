# Học Cùng Bé

Website giáo dục tĩnh bằng HTML, CSS và JavaScript thuần cho học sinh tiểu học.

**Website production:** `https://tamanhhuong95.github.io/hoc-cung-be/`

## Cách chạy

Mở tệp `index.html` bằng trình duyệt web hiện đại (Chrome, Edge, Firefox hoặc Safari). Không cần cài Node.js, npm hay máy chủ backend.

Trong VS Code, có thể nhấp đúp vào `index.html` trong Explorer rồi chọn mở bằng trình duyệt. Nếu đã cài tiện ích Live Server, cũng có thể chọn **Open with Live Server**.

## Phần đã triển khai

- Trang chủ chọn lớp 1 đến lớp 5; lớp 2–5 thông báo sắp ra mắt.
- Lớp 1 gồm Toán, Tiếng Việt, Tiếng Anh và Trò chơi tư duy; chỉ Toán hoạt động.
- Toán lớp 1 hiện có 12 chuyên đề và 60 level: Số và đếm, So sánh số, Phép cộng, Phép trừ, Điền số, Hình học, Số đến 20, Số đến 100, Bài toán có lời văn, Xem đồng hồ, Đo độ dài và Tiền Việt Nam.
- Hệ thống `TOPICS` và `LEVELS` là dữ liệu cấu hình động: mỗi chuyên đề có thể có số level bất kỳ (0, 4, 6, 8, 20 hoặc nhiều hơn) mà không cần sửa dashboard hay giao diện.
- Các helper `getLevelsByTopic`, `getLevelCountByTopic`, `getLevelIndexInTopic`, `getNextLevelInTopic` và `getTopicProgress` dùng chung cho chọn level, mở khóa, Học tiếp và dashboard.
- Có object library emoji offline `OBJECT_LIBRARY`/`VISUAL_SETS`: con mèo, con chó, con cá, con bướm, quả táo, quả cam, chiếc bóng, cây bút, viên kẹo, bông hoa và ngôi sao. Text câu hỏi, mẹo nhỏ và giọng đọc dùng cùng object nên luôn khớp hình minh họa.
- Câu đếm, cộng bằng hình ảnh và trừ bằng hình ảnh có object lớn, tự xuống hàng; phép cộng hiển thị hai nhóm, phép trừ đánh dấu rõ nhóm bị bớt.
- Mỗi level có 10 câu hỏi và 4 đáp án. Nội dung mới có 6 level Số đến 20; 7 level Số đến 100; 4 level bài toán lời văn; 3 level xem đồng hồ; 3 level đo độ dài; và 3 level tiền Việt Nam. Bài lời văn dùng emoji theo đúng đồ vật trong câu; đồng hồ, thanh độ dài và thẻ tiền học tập đều được vẽ offline bằng HTML/CSS.
- Level đầu tiên mở sẵn. Level kế tiếp mở khi **điểm tốt nhất** của level trước đạt từ 70/100; sau khi đã mở, level luôn giữ trạng thái mở.
- **Guest Trial Mode:** người chưa đăng nhập vẫn xem được trang chủ, Lớp 1, Toán, toàn bộ chuyên đề và danh sách level. Hai level thử là `counting-1` và `counting-2`; mọi level khác hiển thị khóa tài khoản `🔐 Đăng nhập để học tiếp` và mở hộp đăng nhập/đăng ký khi được chọn.
- Auth gate và khóa tiến độ là hai trạng thái riêng: guest ở level ngoài trial nhận khóa tài khoản; user Firebase đã đăng nhập nhưng chưa đạt điều kiện 70% vẫn nhận khóa tiến độ `🔒 Hoàn thành level trước ≥ 70%`. `startQuiz()` cũng kiểm tra helper `canAccessLevel()` nên không thể bỏ qua gate chỉ bằng cách gọi trực tiếp.
- Sau khi guest hoàn thành `counting-1`, nút **Học tiếp** mở `counting-2`. Sau khi hoàn thành `counting-2`, kết quả, điểm, sao, mascot và lời khen vẫn hiển thị, nhưng luồng tiếp theo yêu cầu đăng nhập hoặc đăng ký tài khoản phụ huynh.
- Phép cộng vẫn có các nội dung: cộng trong phạm vi 5, cộng trong phạm vi 10, tìm số còn thiếu và cộng bằng hình ảnh.
- Có sao, điểm, số bài hoàn thành, hiệu ứng trả lời đúng, phản hồi trả lời sai, kết quả tốt nhất từng level và nút Học tiếp/Học lại/Về chủ đề/Về trang chủ.
- Toàn bộ tiến độ được lưu trong `localStorage` của trình duyệt, vẫn dùng `progressVersion: 2`, tự migrate dữ liệu cũ và tự phục hồi nếu dữ liệu bị lỗi. ID của các level cũ được giữ nguyên; khi thêm level, level mới chỉ nhận tiến độ mặc định còn `bestScore`, `bestCorrect`, `bestStars`, `attempts`, `completed`, `unlocked`, `lastPlayedAt`, history và studyTime cũ vẫn được giữ.
- Có nút đọc câu hỏi tiếng Việt và cài đặt bật/tắt âm thanh. SpeechSynthesis đọc số đến 100, tiền theo dạng “một nghìn đồng” và thời gian theo dạng “hai giờ ba mươi phút”; âm thanh đúng/sai/hoàn thành được tạo offline bằng Web Audio API; cài đặt được lưu riêng trong `localStorage`.
- Có mascot 🐻 Bạn Gấu tạo bằng emoji và CSS, với trạng thái chờ, vui mừng khi đúng, khuyến khích khi cần thử lại và ăn mừng khi hoàn thành bài.
- Màn hình hoàn thành hiển thị số câu đúng, điểm trên thang 100, lời khen tích cực và sao xuất hiện tuần tự. Quy tắc sao dùng chung với hệ thống tiến độ: dưới 70 điểm là 0 sao, 70–89 là 1 sao, 90–99 là 2 sao và 100 là 3 sao.
- Animation có hỗ trợ `prefers-reduced-motion` và không tải ảnh, GIF, CDN hay thư viện bên ngoài.
- Có khu vực **Dành cho phụ huynh** được khóa bằng Parent PIN 4–6 chữ số do phụ huynh tự đặt trên từng thiết bị. Dashboard vẫn tự nhận đủ 12 chuyên đề và mọi level mới, chi tiết từng level, gợi ý luyện thêm, lịch sử 50 bài hoàn thành gần nhất và thao tác xóa tiến độ hai bước bằng mã `XOA`.
- Thời gian học chỉ được ghi nhận khi bé ở màn hình làm bài và tab đang hiển thị. `studyTime` và `history` được bổ sung tương thích ngược trong cùng dữ liệu tiến độ `localStorage`, không thay đổi `progressVersion: 2`.
- Website hoạt động như một **Progressive Web App (PWA)**: sau lần truy cập online đầu tiên, giao diện chính, bài Toán lớp 1, mã nguồn, manifest và icon được cache để có thể tiếp tục học và xem tiến độ khi offline. Visual dùng emoji Unicode nội bộ nên không có asset ảnh bên thứ ba hoặc request mạng mới; cache hiện là `hoc-cung-be-v8`.
- Có khu vực gọn **👤 Tài khoản phụ huynh**. Firebase `onAuthStateChanged()` là nguồn sự thật cho Guest Trial Mode/Full Learning Mode; ứng dụng không tự đánh dấu login trong localStorage. Parent Dashboard vẫn chỉ cần Parent PIN đúng và không phụ thuộc Firebase login.
- Bản hiện tại **chưa đồng bộ cloud**. Sau đăng nhập, progress, `bestScore`, sao, attempts, history và studyTime vẫn tiếp tục dùng cùng dữ liệu localStorage trên thiết bị; đăng nhập hoặc đăng xuất không xóa tiến độ học thử hay Parent PIN. Thông điệp sản phẩm chỉ nói đăng nhập để mở toàn bộ bài học và chuẩn bị đồng bộ giữa các thiết bị.
- Form phụ huynh có đăng ký/đăng nhập Email + Mật khẩu, quên mật khẩu, email verification, đổi mật khẩu có re-authentication, hiển thị trạng thái email và liên kết số điện thoại Việt Nam vào chính Firebase user hiện có bằng Phone Auth + invisible reCAPTCHA. Mật khẩu, OTP và reset token không được ứng dụng lưu trong localStorage.
- Firebase Authentication dùng Firebase Web config trong `firebase-config.js`. SDK browser được phép khởi tạo để Firebase Auth phục hồi persistence nếu tài nguyên SDK sẵn có; nếu không có mạng/tài nguyên SDK, app vẫn ở Guest Trial Mode và hai level thử vẫn dùng được từ app shell. Service worker cache app shell hiện là `hoc-cung-be-v8` và không xử lý/cache Firebase Auth, Google API, Firebase CDN hoặc reCAPTCHA request.

## Mở rộng level

Thêm một level bằng cách thêm một object vào `LEVELS` trong `script.js`, gồm tối thiểu `id`, `topic`, `title`, `type`, `min`, `max` và `order`. Có thể cấu hình thêm `questionCount`, `unlockScore`, `imageMode`, `visualSet` và `hint`. Không đổi ID của level đã phát hành để giữ tiến độ cũ. Nếu thêm loại `type` mới, bổ sung generator tương ứng trong `generateQuestion()`.

Các kiểm tra không làm thay đổi dữ liệu thật được xuất ra Console qua `window.__hocCungBeGuestTrialTests` (A–N), `window.__hocCungBeDynamicLevelTests` (A–L), `window.__hocCungBeParentAuthTests` (A–N), `window.__hocCungBeParentPinFeedbackTests` (A–L) và các test progress/dashboard/PWA hiện có.

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
5. Commit/push `firebase-config.js` chỉ sau khi kiểm tra nó đúng là **Web config**. Firebase Web config được dùng ở client theo kiến trúc Firebase Web; quyền truy cập dữ liệu cloud trong tương lai vẫn phải được bảo vệ bằng Security Rules. Project hiện chưa dùng Firestore/Realtime Database.

### 3. Bật Email/Password

1. Trong Firebase Console, vào **Build → Authentication** rồi chọn **Get started** nếu đây là lần đầu.
2. Mở tab **Sign-in method**.
3. Chọn **Email/Password**, bật tùy chọn **Email/Password**, sau đó nhấn **Save**.
4. Trong **Authentication → Settings**, rà soát phần email/action URLs và tính năng bảo vệ email enumeration nếu Firebase Console hiển thị chúng.
5. Sau khi deploy config thật, đăng ký bằng form **Đăng ký tài khoản phụ huynh**. Ứng dụng gọi Firebase `createUserWithEmailAndPassword`, cập nhật họ tên, sau đó gọi `sendEmailVerification`.
6. Phụ huynh chưa xác minh email vẫn có thể cho bé học. Nút **Gửi lại email xác minh** nằm trong **Tài khoản của tôi**.

### 4. Authorized domains cho GitHub Pages và local

1. Trong **Build → Authentication → Settings**, tìm mục **Authorized domains**.
2. Thêm chính xác domain production: `tamanhhuong95.github.io`.
3. Khi test local, kiểm tra `localhost` đã có trong danh sách; nếu chưa, thêm `localhost` theo hướng dẫn trong Firebase Console. Không nhập đường dẫn `/hoc-cung-be/` vào ô domain.
4. Deploy lên GitHub Pages, mở `https://tamanhhuong95.github.io/hoc-cung-be/` khi online để service worker `hoc-cung-be-v8` cập nhật app shell.

### 5. Quên/đổi mật khẩu

- Form **Quên mật khẩu** gọi Firebase `sendPasswordResetEmail()`. Dù Firebase trả kết quả gì, UI trả lời theo hướng không tiết lộ tài khoản: “Nếu email này đã được đăng ký, hướng dẫn đặt lại mật khẩu sẽ được gửi tới hộp thư.”
- Form **Đổi mật khẩu** yêu cầu phụ huynh nhập mật khẩu hiện tại, gọi Firebase `reauthenticateWithCredential()` rồi `updatePassword()`. Điều này xử lý yêu cầu recent login của Firebase mà không lưu mật khẩu vào localStorage.

### 6. Bật Phone provider và kiểm thử bằng test phone number (không gửi SMS thật)

1. Trong **Build → Authentication → Sign-in method**, chọn **Phone** và bật provider nếu Firebase Console cho phép.
2. Trước khi dùng số thật, mở khu vực **Phone numbers for testing** / **Test phone numbers** trong phần Phone provider.
3. Nhấn **Add phone number**, nhập số test ở định dạng quốc tế, ví dụ `+84912345678`, và tự chọn mã test 6 chữ số, ví dụ `123456`.
4. Nhấn **Save**. Không dùng số này cho một tài khoản Firebase khác.
5. Trên website: đăng nhập tài khoản email của phụ huynh → **Tài khoản của tôi** → **Liên kết số điện thoại** → nhập `0912345678` → **Gửi mã OTP** → nhập `123456` (mã test đã tự đặt) → **Xác minh và liên kết**.
6. Code chuẩn hóa `0912345678` thành `+84912345678`, tạo `RecaptchaVerifier` invisible theo yêu cầu Firebase Web, lấy credential từ OTP và gọi `linkWithCredential()` cho user đang đăng nhập. Kết quả là một Firebase user có cả email/password và phone number, không phải hai tài khoản riêng.
7. OTP chỉ tồn tại trong Firebase/browser flow trong lúc xác minh; ứng dụng không ghi OTP vào localStorage.

### 7. SMS production và billing

- Không tự bật gửi SMS production và không tự thay đổi billing. Phone Auth/SMS có thể yêu cầu kích hoạt billing hoặc chịu hạn mức/quota tùy Firebase project, quốc gia và chính sách Firebase tại thời điểm cấu hình.
- Chỉ dùng **test phone numbers** ở bước hiện tại để không phát sinh SMS thật. Trước khi bật production, chủ dự án cần tự rà soát pricing, quota, reCAPTCHA và yêu cầu billing ngay trong Firebase Console.

### 8. Kiểm tra sau khi cấu hình

1. Mở trang production khi có Internet và hard reload một lần sau deploy.
2. Mở DevTools Console và chạy `window.__hocCungBeParentAuthTests`; xác nhận A–N đều `passed: true`. Bộ test không tạo account, không gửi email, không gửi SMS.
3. Thử đăng ký test, đăng nhập, quên mật khẩu, gửi xác minh email và liên kết **test phone number**.
4. Reload/PWA mở lại để kiểm tra `onAuthStateChanged()` tự cập nhật UI.
5. Tắt Internet sau lần tải online: bài học, localStorage progress, history, studyTime, dashboard và app shell vẫn hoạt động; Auth phải hiển thị thông báo cần Internet thay vì làm ứng dụng lỗi.

### Chính sách quyền riêng tư placeholder

Màn hình **Chính sách quyền riêng tư** trong app là placeholder cần chủ sở hữu rà soát trước khi public chính thức. Nó mô tả đúng phạm vi hiện tại: tài khoản là của phụ huynh; Firebase có thể xử lý email/tên phục vụ login/xác thực; số điện thoại chỉ được xử lý khi phụ huynh tự liên kết qua Firebase/Google; progress/history/studyTime vẫn chỉ lưu cục bộ. Cần bổ sung đơn vị vận hành, thông tin liên hệ, thời hạn lưu trữ, quyền của người dùng và Điều khoản sử dụng phù hợp trước khi công bố.

## Cài ứng dụng

- **Android / Chrome / Edge trên máy tính:** Khi trình duyệt hỗ trợ, nút **📲 Cài Học Cùng Bé** sẽ xuất hiện ở trang chủ. Chọn nút này rồi xác nhận lời nhắc cài đặt của trình duyệt.
- **iPhone / iPad:** Mở website bằng Safari, nhấn **Chia sẻ** rồi chọn **Thêm vào Màn hình chính**. Website hiển thị hướng dẫn nhỏ một lần và có thể đóng hướng dẫn này.
- Khi đã mở ở chế độ ứng dụng độc lập (standalone), nút cài và hướng dẫn iOS sẽ tự ẩn.
- PWA không gửi dữ liệu học tập lên máy chủ. Tiến độ, âm thanh, lịch sử và thời gian học vẫn dùng `localStorage` của trình duyệt trên thiết bị đó.