# NPS UI Development Guide 💻

Tài liệu này hướng dẫn chi tiết cách phát triển, kiểm thử và đóng góp mã nguồn cho thư viện component **NPS UI** dành cho lập trình viên mới.

---

## 🛠️ Yêu cầu & Thiết lập nhanh

- **Môi trường yêu cầu**: Node.js `v20.12.0+` (hoặc `v22+`), npm `v9+`.
- **Thiết lập nhanh**:

  ```bash
  # 1. Cài đặt các dependencies ở thư mục gốc (monorepo)
  npm install

  # 2. Khởi chạy website tài liệu tại http://localhost:3000 để hiển thị demo & test trực tiếp
  npm run dev:docs
  ```

> [!TIP]
> **Không cần build lại thư viện khi phát triển**: Nhờ cấu hình alias thông minh trong [apps/docs/vite.config.ts](file:///Users/lyquocvan/Documents/NamPhuongSo/nps-ui/apps/docs/vite.config.ts), website tài liệu sẽ liên kết trực tiếp tới file TypeScript gốc trong `packages/ui/src`. Mọi chỉnh sửa mã nguồn của bạn ở UI package sẽ lập tức phản ánh lên giao diện mà không cần chạy lệnh `npm run build:ui`.

---

## 🧩 Quy trình phát triển Component mới

Để thuận tiện và tối ưu hóa thời gian phát triển, dự án cung cấp bộ công cụ tự động sinh cấu trúc tệp và đăng ký component mới.

### Cách 1: Sử dụng Script tự động (Khuyên dùng)

Chạy lệnh dưới đây từ thư mục gốc của monorepo:

```bash
npm run gen:component <TênComponent>
```

**Ví dụ:**

```bash
npm run gen:component InputNumber
```

Script sẽ tự động thực hiện các công việc sau:

1. **Tạo thư mục & tệp nguồn**: Tạo thư mục `packages/ui/src/components/input-number/` chứa các tệp sườn `NpsInputNumber.tsx`, `types.ts`, `index.ts` và tệp kiểm thử `NpsInputNumber.test.tsx`.
2. **Đăng ký thư viện**: Tự động thêm dòng export component mới vào [packages/ui/src/index.ts](file:///Users/lyquocvan/Documents/NamPhuongSo/nps-ui/packages/ui/src/index.ts).
3. **Tạo trang tài liệu**: Tạo thư mục chứa tệp demo `index.tsx` và cấu hình đa ngôn ngữ `locales.ts` tại `apps/docs/src/pages/components/input-number/`.
4. **Đăng ký định tuyến (Routing)**: Tự động khai báo trang component mới này vào [apps/docs/src/App.tsx](file:///Users/lyquocvan/Documents/NamPhuongSo/nps-ui/apps/docs/src/App.tsx).
5. **Đăng ký thanh điều hướng (Sidebar)**: Thêm liên kết vào [apps/docs/src/config/navigation.ts](file:///Users/lyquocvan/Documents/NamPhuongSo/nps-ui/apps/docs/src/config/navigation.ts).
6. **Đăng ký đa ngôn ngữ (i18n)**: Khai báo tài nguyên ngôn ngữ mới vào tệp cấu hình i18n chính [apps/docs/src/i18n/index.ts](file:///Users/lyquocvan/Documents/NamPhuongSo/nps-ui/apps/docs/src/i18n/index.ts).

Sau khi chạy lệnh, bạn chỉ cần mở các tệp tin mới được tạo ra và tập trung phát triển logic!

---

### Cách 2: Thực hiện thủ công

Nếu muốn thiết lập thủ công, hãy thực hiện đầy đủ **5 bước** sau:

### Bước 1: Phát triển mã nguồn Component

1. Tạo thư mục mới tại `packages/ui/src/components/table/`.
2. Tạo các tệp cần thiết:
   - `types.ts`: Định nghĩa các TypeScript interfaces (kế thừa các props mặc định từ Ant Design nếu cần).
   - `Table.tsx`: Viết code logic cho React component (sử dụng Tailwind classes để định kiểu dáng bổ sung).
   - `Table.test.tsx`: Viết unit tests kiểm thử các sự kiện click, hiển thị, trạng thái disabled...
   - `index.ts`: Export component và các kiểu dữ liệu của nó:
     ```typescript
     export * from "./Table";
     export * from "./types";
     ```

### Bước 2: Đăng ký Export trong thư viện

Khai báo dòng export component mới trong tệp chính [packages/ui/src/index.ts](file:///Users/lyquocvan/Documents/NamPhuongSo/nps-ui/packages/ui/src/index.ts) để các dự án bên ngoài có thể import được:

```typescript
export * from "./components/table";
```

### Bước 3: Viết tài liệu hướng dẫn sử dụng (Docs)

1. Tạo thư mục demo tại `apps/docs/src/pages/components/table/`.
2. Tạo các tệp:
   - `locales.ts`: Định nghĩa nội dung mô tả tiếng Anh (`en`) và tiếng Việt (`vi`) cho component.
   - `index.tsx`: Thiết kế trang tài liệu hướng dẫn, bao gồm ví dụ thực tế sử dụng component và API table.
3. Đăng ký trang mới này vào hệ thống Router tĩnh trong [apps/docs/src/App.tsx](file:///Users/lyquocvan/Documents/NamPhuongSo/nps-ui/apps/docs/src/App.tsx).

### Bước 4: Đăng ký dịch đa ngôn ngữ (i18n)

Nhập và khai báo tệp dịch locales của component vào tệp cấu hình i18n chính [apps/docs/src/i18n/index.ts](file:///Users/lyquocvan/Documents/NamPhuongSo/nps-ui/apps/docs/src/i18n/index.ts) để trang tài liệu hiển thị được ngôn ngữ đã chọn:

```typescript
import { tableLocales } from "../pages/components/table/locales";

// Trong cấu hình resources.en
en: {
  // ...
  table: tableLocales.en,
}

// Trong cấu hình resources.vi
vi: {
  // ...
  table: tableLocales.vi,
}
```

### Bước 5: Kiểm tra trước khi commit

Trước khi tạo Pull Request, bắt buộc chạy chuỗi lệnh sau để đảm bảo chất lượng code và tránh lỗi build trên CI/CD:

```bash
npm run format && npm run lint && npm run test
```

---

## 🎨 Tiêu chuẩn Coding & Styling

- **Tailwind CSS**: Tất cả mã styling tùy biến phải sử dụng Tailwind classes. Đảm bảo các component con kế thừa `className` và kết hợp thông qua `twMerge`.
- **Ant Design Tokens**: Tận dụng tối đa `NpsConfigProvider` và hệ thống token từ Ant Design. Tránh hardcode mã màu hoặc kích thước.
- **Tách biệt Logic & Giao diện**: Giữ component tinh gọn bằng cách tách hook hoặc helpers nếu logic phức tạp.

---

## 🚀 Quy trình Phát hành (Release Process)

Dự án sử dụng **Changesets** kết hợp **GitHub Actions** để tự động phát hành lên NPM.

### 1. Ghi nhận Thay đổi (Local)

Khi hoàn thành tính năng, hãy tạo changeset file bằng cách chạy:

```bash
# Sử dụng script trợ lý tiếng Việt
npm run change
```

Lựa chọn loại cập nhật (`patch`/`minor`/`major`) và viết một câu mô tả ngắn gọn. Lưu ý commit file `.changeset/*.md` này lên cùng với code của bạn.

### 2. Pipeline tự động trên GitHub

- Khi code được merge vào nhánh `main`, hệ thống sẽ chạy kiểm thử và tự động sinh ra một PR mang tên **"Version Packages"**.
- Khi Admin merge PR **"Version Packages"** này:
  1. Thư viện sẽ tự động chạy lệnh build.
  2. Code mới tự động phát hành lên NPM.
  3. GitHub Release & Changelog tự động được cập nhật.
