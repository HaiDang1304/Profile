# HaiDang.dev — Pixel Portfolio

Portfolio React/Vite với giao diện pixel, dashboard quản trị và API Express kết nối MariaDB/MySQL của XAMPP.

## Chạy trên máy

1. Mở XAMPP Control Panel và bật **MySQL**.
2. Mở terminal thứ nhất và chạy `npm run server`.
3. Mở terminal thứ hai và chạy `npm run dev`.
4. Portfolio: `http://localhost:5173`
5. Dashboard: `http://localhost:5173/admin`
6. phpMyAdmin: `http://localhost/phpmyadmin`

Database `haidang_portfolio` cùng các bảng sẽ được tạo tự động ở lần chạy API đầu tiên.

## Tài khoản quản trị local mặc định

- Tài khoản: `admin.dev`
- Mật khẩu: `change-me-now`

Trước khi triển khai, sao chép `server/.env.example` thành `server/.env` và thay mật khẩu, JWT secret cùng thông tin MySQL. Xem thêm [server/README.md](server/README.md).

## Kiểm tra

```bash
npm run lint
npm run build
```
