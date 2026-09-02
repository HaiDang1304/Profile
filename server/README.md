# Portfolio API — XAMPP MySQL

Backend Express lưu hồ sơ, dự án, bài viết và tin nhắn liên hệ trong MariaDB/MySQL của XAMPP.

1. Mở XAMPP Control Panel và bật **MySQL**.
2. Sao chép `.env.example` thành `.env`, sau đó đổi `JWT_SECRET` và `ADMIN_PASSWORD`.
3. Chạy `npm install` và `npm run dev` trong thư mục `server`.

Database `haidang_portfolio` và các bảng được tạo tự động. Xem dữ liệu tại `http://localhost/phpmyadmin`.

Tài khoản mặc định khi chưa có `.env`: `admin.dev` / `change-me-now`. Hãy thay đổi trước khi triển khai.
