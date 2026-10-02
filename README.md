# Học Cùng Bé

Website giáo dục tĩnh bằng HTML, CSS và JavaScript thuần cho học sinh tiểu học.

**Website production:** `https://tamanhhuong95.github.io/hoc-cung-be/`

## Cách chạy

Mở tệp `index.html` bằng trình duyệt web hiện đại (Chrome, Edge, Firefox hoặc Safari). Không cần cài Node.js, npm hay máy chủ backend.

Trong VS Code, có thể nhấp đúp vào `index.html` trong Explorer rồi chọn mở bằng trình duyệt. Nếu đã cài tiện ích Live Server, cũng có thể chọn **Open with Live Server**.

## Phần đã triển khai

- Trang chủ chọn lớp 1 đến lớp 5; lớp 2–5 thông báo sắp ra mắt.
- Lớp 1 gồm Toán, Tiếng Việt, Tiếng Anh và Trò chơi tư duy; chỉ Toán hoạt động.
- Toán lớp 1 có đủ 6 chuyên đề: Số và đếm, So sánh số, Phép cộng, Phép trừ, Điền số và Hình học.
- Hệ thống `TOPICS` và `LEVELS` là dữ liệu cấu hình động: mỗi chuyên đề có thể có số level bất kỳ (0, 4, 6, 8, 20 hoặc nhiều hơn) mà không cần sửa dashboard hay giao diện.
- Các helper `getLevelsByTopic`, `getLevelCountByTopic`, `getLevelIndexInTopic`, `getNextLevelInTopic` và `getTopicProgress` dùng chung cho chọn level, mở khóa, Học tiếp và dashboard.
- Có object library emoji offline `OBJECT_LIBRARY`/`VISUAL_SETS`: con mèo, con chó, con cá, con bướm, quả táo, quả cam, chiếc bóng, cây bút, viên kẹo và ngôi sao. Text câu hỏi, mẹo nhỏ và giọng đọc dùng cùng object nên luôn khớp hình minh họa.
- Câu đếm, cộng bằng hình ảnh và trừ bằng hình ảnh có object lớn, tự xuống hàng; phép cộng hiển thị hai nhóm, phép trừ đánh dấu rõ nhóm bị bớt.
- Mỗi level có 10 câu hỏi và 4 đáp án. Hiện có 6 level Số và đếm, 8 level Phép cộng (bao gồm cộng với 0, trong phạm vi 20, cộng qua 10 và ôn tập), 8 level Phép trừ (bao gồm trừ với 0, trong phạm vi 20, trừ qua 10 và ôn tập); các chuyên đề còn lại có thể tiếp tục mở rộng chỉ bằng dữ liệu level/generator.
- Level đầu tiên mở sẵn. Level kế tiếp mở khi **điểm tốt nhất** của level trước đạt từ 70/100; sau khi đã mở, level luôn giữ trạng thái mở.
- Phép cộng vẫn có các nội dung: cộng trong phạm vi 5, cộng trong phạm vi 10, tìm số còn thiếu và cộng bằng hình ảnh.
- Có sao, điểm, số bài hoàn thành, hiệu ứng trả lời đúng, phản hồi trả lời sai, kết quả tốt nhất từng level và nút Học tiếp/Học lại/Về chủ đề/Về trang chủ.
- Toàn bộ tiến độ được lưu trong `localStorage` của trình duyệt, vẫn dùng `progressVersion: 2`, tự migrate dữ liệu cũ và tự phục hồi nếu dữ liệu bị lỗi. ID của các level cũ được giữ nguyên; khi thêm level, level mới chỉ nhận tiến độ mặc định còn `bestScore`, `bestCorrect`, `bestStars`, `attempts`, `completed`, `unlocked`, `lastPlayedAt`, history và studyTime cũ vẫn được giữ.
- Có nút đọc câu hỏi tiếng Việt và cài đặt bật/tắt âm thanh. Âm thanh đúng/sai/hoàn thành được tạo offline bằng Web Audio API; cài đặt được lưu riêng trong `localStorage`.
- Có mascot 🐻 Bạn Gấu tạo bằng emoji và CSS, với trạng thái chờ, vui mừng khi đúng, khuyến khích khi cần thử lại và ăn mừng khi hoàn thành bài.
- Màn hình hoàn thành hiển thị số câu đúng, điểm trên thang 100, lời khen tích cực và sao xuất hiện tuần tự. Quy tắc sao dùng chung với hệ thống tiến độ: dưới 70 điểm là 0 sao, 70–89 là 1 sao, 90–99 là 2 sao và 100 là 3 sao.
- Animation có hỗ trợ `prefers-reduced-motion` và không tải ảnh, GIF, CDN hay thư viện bên ngoài.
- Có khu vực **Dành cho phụ huynh** với phép tính xác nhận, dashboard tiến độ 6 chuyên đề, chi tiết từng level, gợi ý luyện thêm, lịch sử 50 bài hoàn thành gần nhất và thao tác xóa tiến độ hai bước bằng mã `XOA`.
- Thời gian học chỉ được ghi nhận khi bé ở màn hình làm bài và tab đang hiển thị. `studyTime` và `history` được bổ sung tương thích ngược trong cùng dữ liệu tiến độ `localStorage`, không thay đổi `progressVersion: 2`.
- Website hoạt động như một **Progressive Web App (PWA)**: sau lần truy cập online đầu tiên, giao diện chính, bài Toán lớp 1, mã nguồn, manifest và icon được cache để có thể tiếp tục học và xem tiến độ khi offline. Visual dùng emoji Unicode nội bộ nên không có asset ảnh bên thứ ba hoặc request mạng mới; cache hiện là `hoc-cung-be-v2`.

## Mở rộng level

Thêm một level bằng cách thêm một object vào `LEVELS` trong `script.js`, gồm tối thiểu `id`, `topic`, `title`, `type`, `min`, `max` và `order`. Có thể cấu hình thêm `questionCount`, `unlockScore`, `imageMode`, `visualSet` và `hint`. Không đổi ID của level đã phát hành để giữ tiến độ cũ. Nếu thêm loại `type` mới, bổ sung generator tương ứng trong `generateQuestion()`.

Các kiểm tra không làm thay đổi dữ liệu thật được xuất ra Console qua `window.__hocCungBeDynamicLevelTests` (A–K), cùng các test progress/dashboard/PWA hiện có.

## Cài ứng dụng

- **Android / Chrome / Edge trên máy tính:** Khi trình duyệt hỗ trợ, nút **📲 Cài Học Cùng Bé** sẽ xuất hiện ở trang chủ. Chọn nút này rồi xác nhận lời nhắc cài đặt của trình duyệt.
- **iPhone / iPad:** Mở website bằng Safari, nhấn **Chia sẻ** rồi chọn **Thêm vào Màn hình chính**. Website hiển thị hướng dẫn nhỏ một lần và có thể đóng hướng dẫn này.
- Khi đã mở ở chế độ ứng dụng độc lập (standalone), nút cài và hướng dẫn iOS sẽ tự ẩn.
- PWA không gửi dữ liệu học tập lên máy chủ. Tiến độ, âm thanh, lịch sử và thời gian học vẫn dùng `localStorage` của trình duyệt trên thiết bị đó.