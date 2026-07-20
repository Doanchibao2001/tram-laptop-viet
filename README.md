# Website Trạm Laptop Việt

Dự án website giới thiệu dịch vụ sửa chữa, nâng cấp và bảo hành laptop của **Trạm Laptop Việt**. Giao diện được tối ưu cho máy tính và điện thoại, có CTA gọi điện/Zalo, popup tư vấn, trang tin tức và cấu hình SEO kỹ thuật.

## Chức năng chính

- Giao diện responsive, tự co giãn theo nhiều kích thước màn hình.
- Giao diện mobile Premium Minimalism với màu Crimson matte, font Be Vietnam Pro, thẻ bo góc và khoảng thở rộng.
- Hệ màu chuyển đổi: Crimson sâu `#9E0A16` cho thương hiệu, đỏ tươi `#C81020` cho CTA và xanh `#0068FF` cho Zalo.
- Bottom Navigation hiệu ứng kính mờ, icon Lucide nét mảnh và biểu tượng Zalo chuẩn.
- Hotline hiển thị: `0343.323.865`.
- CTA gọi điện, đặt lịch và Zalo trên máy tính lẫn điện thoại.
- CTA Zalo nổi giữa thanh mobile, tự mở rộng theo chu kỳ và hiển thị trạng thái kỹ thuật viên online.
- Bottom Sheet chốt khách tự mở một lần sau 12 giây hoặc khi người dùng cuộn 45% trang.
- Menu thu gọn gồm Dịch vụ, Sản phẩm, Quy trình sửa chữa, Hệ thống cửa hàng, Liên hệ và Tin tức.
- Trang tin tức riêng, không hiển thị thành một khối trên trang chủ.
- Metadata, canonical URL, Open Graph, JSON-LD, `robots.txt` và `sitemap.xml` phục vụ SEO.
- Nội dung và hình ảnh mang thương hiệu Trạm Laptop Việt.

## Yêu cầu hệ thống

- Node.js `>= 22.13.0`
- pnpm (khuyến nghị) hoặc npm

## Cài đặt và chạy local

Giải nén dự án, mở Terminal tại thư mục `tram-laptop-viet`, sau đó chạy:

```bash
pnpm install
pnpm dev
```

Mở trên máy tính:

```text
http://localhost:3001
```

Để xem trên điện thoại cùng mạng Wi-Fi, chạy `ipconfig` trên Windows, lấy địa chỉ IPv4 của máy tính rồi mở:

```text
http://DIA_CHI_IPV4:3001
```

Ví dụ: `http://192.168.1.13:3001`. Nếu điện thoại không truy cập được, hãy cho phép Node.js/cổng 3001 qua Windows Firewall và bảo đảm hai thiết bị dùng cùng mạng.

Nếu dùng npm:

```bash
npm install
npm run dev
```

## Cấu hình môi trường và tên miền

Sao chép `.env.example` thành `.env.local` rồi sửa:

```env
NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban.vn
GOOGLE_SITE_VERIFICATION=ma-xac-minh-google-search-console
```

- `NEXT_PUBLIC_SITE_URL`: tên miền chính thức, dùng để tạo canonical URL, sitemap và dữ liệu có cấu trúc.
- `GOOGLE_SITE_VERIFICATION`: mã xác minh của Google Search Console; có thể để trống khi chạy local.

Sau khi đưa website lên tên miền thật, khai báo sitemap trong Google Search Console:

```text
https://ten-mien-cua-ban.vn/sitemap.xml
```

## Kiểm tra và chạy bản production

```bash
pnpm build
pnpm start
```

Build phải hoàn tất trước khi bàn giao lên hosting. Tùy nhà cung cấp hosting, cần cấu hình biến môi trường giống phần trên.

## Triển khai trên Vercel

Kết nối repository GitHub với Vercel và giữ Framework Preset là `Next.js`. Dự án dùng các thiết lập mặc định sau:

- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Output Directory: để trống để Vercel tự nhận `.next`

Trong phần Environment Variables của Vercel, đặt `NEXT_PUBLIC_SITE_URL` thành tên miền chính thức. Có thể thêm `GOOGLE_SITE_VERIFICATION` sau khi xác minh Google Search Console.

## Cấu trúc quan trọng

```text
app/
  page.tsx                 Trang chủ và CTA
  globals.css              Toàn bộ giao diện responsive
  layout.tsx               Metadata và cấu hình SEO toàn site
  robots.ts                Quy tắc cho công cụ tìm kiếm
  sitemap.ts               Chỉ mục URL cho Google
  tin-tuc/                 Trang danh sách và bài viết SEO
public/tram-laptop-viet/    Logo, banner và ảnh cửa hàng
tailwind.config.ts          Màu thương hiệu và font dùng chung
worker/                     Điểm chạy ứng dụng khi triển khai
build/                      Cấu hình build Sites/vinext
.openai/hosting.json        Cấu hình dự án hosting
```

## Chỉnh sửa nội dung

- Nội dung trang chủ, địa chỉ, hotline và liên kết CTA: `app/page.tsx`.
- CSS, màu sắc, font chữ và responsive: `app/globals.css`.
- Hotline trong phần tin tức: `app/tin-tuc/NewsChrome.tsx` và `app/tin-tuc/NewsArticlePage.tsx`.
- Danh sách/nội dung bài viết: `app/tin-tuc/news-data.ts`.
- Hình ảnh thương hiệu: `public/tram-laptop-viet/`.

Khi đổi hotline, giữ hai dạng:

- Dạng máy gọi/Zalo: chỉ có số, ví dụ `0343323865`.
- Dạng hiển thị: có dấu chấm, ví dụ `0343.323.865`.

## Các URL hiện có

- `/` — trang chủ
- `/tin-tuc` — chỉ mục tin tức
- `/tin-tuc/laptop-khong-len-nguon-nguyen-nhan-cach-xu-ly`
- `/tin-tuc/nang-cap-ssd-ram-cho-laptop`
- `/tin-tuc/cach-bao-quan-pin-laptop-ben-hon`
- `/robots.txt`
- `/sitemap.xml`

## Lưu ý bàn giao

Thư mục `node_modules`, file build tạm và cache không nằm trong gói source để giảm dung lượng. Chạy `pnpm install` sau khi giải nén để cài đúng phiên bản thư viện từ `pnpm-lock.yaml`.
