<div align="center">

<img src="https://res.cloudinary.com/dvxpkaf65/image/upload/v1/thuyrmart-products" alt="ThuyR Mart Logo" width="80" height="80" style="border-radius:50%">

# 🛒 ThuyR Mart

**Hệ thống quản lý bán hàng & thương mại điện tử tích hợp**

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Cloud-3448C5?style=flat&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat)](LICENSE)

[🌐 Live Demo](https://thuyrmart.onrender.com) · [📋 Admin Panel](https://thuyrmart.onrender.com/admin) · [🐛 Report Bug](https://github.com/anhstanh6688/thuyrmart/issues)

</div>

---

## 📸 Giao diện

| Trang khách hàng | Admin Dashboard |
|:---:|:---:|
| Trang chủ hiện đại với dark mode | Quản lý toàn diện với biểu đồ |

---

## ✨ Tính năng

### 🏪 Phía khách hàng (Customer Portal)
- **Trang chủ** - Giới thiệu sản phẩm nổi bật, banner động
- **Danh mục sản phẩm** - Tìm kiếm, lọc, phân trang
- **Chi tiết sản phẩm** - Gallery ảnh, video, đánh giá sao, zoom
- **Giỏ hàng** - Thêm/xóa, cập nhật số lượng, tính tổng
- **Checkout** - Form đặt hàng, nhiều phương thức thanh toán
- **Tài khoản** - Lịch sử đơn hàng, địa chỉ, wishlist, avatar
- **AI Chatbot** - Trợ lý ảo Gemini AI hỗ trợ 24/7
- **Đánh giá** - Viết, sửa, xóa review + rating sao

### 🔧 Phía quản trị (Admin Panel)
- **Dashboard** - Thống kê doanh thu, đơn hàng, khách hàng theo thời gian thực
- **POS (Point of Sale)** - Giao diện bán hàng trực tiếp tại quầy
- **Quản lý sản phẩm** - CRUD đầy đủ, upload nhiều ảnh + video
- **Quản lý danh mục** - Phân loại sản phẩm
- **Nhập hàng** - Tạo phiếu nhập, quản lý nhà cung cấp
- **Kho hàng** - Nhật ký xuất nhập, điều chỉnh tồn kho
- **Khách hàng** - Quản lý công nợ, lịch sử mua hàng
- **Nhân viên** - Phân quyền admin/staff
- **Báo cáo** - Biểu đồ doanh thu, lợi nhuận, export Excel
- **AI Query** - Hỏi AI về doanh thu, tồn kho, hàng bán chạy

---

## 🛠 Công nghệ sử dụng

| Hạng mục | Công nghệ |
|---|---|
| **Backend** | Node.js 22, Express.js 5 |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Image Storage** | Cloudinary (25GB free) |
| **AI** | Google Gemini 2.5 Flash API |
| **Frontend** | Vanilla HTML/CSS/JavaScript |
| **Icons** | Lucide Icons, Font Awesome |
| **Charts** | Chart.js |
| **Export** | SheetJS (xlsx) |
| **Auth** | bcryptjs, localStorage |
| **Upload** | Multer + Cloudinary Stream |
| **Deploy** | Render.com |

---

## 🚀 Cài đặt & Chạy local

### Yêu cầu
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB Atlas account (free)

### Bước 1: Clone repository
```bash
git clone https://github.com/anhstanh6688/thuyrmart.git
cd thuyrmart
```

### Bước 2: Cài dependencies
```bash
npm install
```

### Bước 3: Cấu hình môi trường
```bash
# Copy file mẫu
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/web_ban_hang

JWT_SECRET=<chuỗi ngẫu nhiên 64 ký tự>

GEMINI_API_KEY=<your_gemini_api_key>

# Cloudinary (không bắt buộc khi dev - sẽ dùng local uploads/)
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

> **Tạo JWT_SECRET ngẫu nhiên:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Bước 4: Chạy server
```bash
npm start
# hoặc để dev:
npm run dev
```

### Bước 5: Truy cập
- **Trang khách hàng**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin
- **API**: http://localhost:3000/api/products

---

## 🗂 Cấu trúc dự án

```
thuyrmart/
├── server.js                  # Entry point - Express server
├── package.json
├── .env.example               # Template biến môi trường
├── .gitignore
│
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary config
│   │
│   ├── models/                # Mongoose models
│   │   ├── User.js            # Admin/Staff accounts
│   │   ├── Customer.js        # Customer accounts
│   │   ├── Product.js         # Products
│   │   ├── Category.js        # Categories
│   │   ├── Sale.js            # Sales orders
│   │   ├── Purchase.js        # Purchase orders
│   │   ├── Supplier.js        # Suppliers
│   │   ├── SupplierPayment.js # Supplier debt payments
│   │   ├── InventoryLog.js    # Stock movement logs
│   │   └── Review.js          # Product reviews
│   │
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── customerController.js
│   │   ├── saleController.js
│   │   ├── purchaseController.js
│   │   ├── supplierController.js
│   │   ├── supplierPaymentController.js
│   │   ├── categoryController.js
│   │   ├── inventoryController.js
│   │   ├── reportController.js
│   │   ├── userController.js
│   │   └── aiController.js
│   │
│   ├── routes/                # API route definitions
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── saleRoutes.js
│   │   ├── purchaseRoutes.js
│   │   ├── supplierRoutes.js
│   │   ├── supplierPaymentRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── userRoutes.js
│   │   ├── aiRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── middleware/
│   │   ├── checkStatus.js     # Auth & account status check
│   │   └── upload.js          # Multer + Cloudinary upload
│   │
│   └── views/
│       ├── admin/
│       │   └── index.html     # Admin SPA
│       └── customer/
│           ├── index.html
│           ├── products.html
│           ├── product-detail.html
│           ├── cart.html
│           ├── checkout.html
│           ├── account.html
│           ├── account-orders.html
│           ├── account-addresses.html
│           ├── account-wishlist.html
│           ├── order-success.html
│           ├── customer-login.html
│           ├── register.html
│           ├── about.html
│           └── contact.html
│
├── public/
│   ├── css/                   # Stylesheets
│   ├── js/
│   │   ├── app.js             # Admin panel logic (~3000 lines)
│   │   ├── customer.js        # Customer portal logic
│   │   ├── ai-chatbox.js      # AI chatbot widget
│   │   └── pagination.js      # Pagination utility
│   └── img/                   # Static images
│
└── uploads/                   # Local uploads (dev only)
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/login` | Đăng nhập (Admin/Staff/Customer) |

### Products
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/products` | Danh sách sản phẩm |
| GET | `/api/products/:id` | Chi tiết sản phẩm |
| GET | `/api/products/search?q=` | Tìm kiếm |
| POST | `/api/products` | Tạo sản phẩm mới |
| PUT | `/api/products/:id` | Cập nhật sản phẩm |
| DELETE | `/api/products/:id` | Xóa sản phẩm (Admin) |

### Sales (Bán hàng)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/sales` | Danh sách hóa đơn |
| POST | `/api/sales/checkout` | Tạo đơn hàng |
| PUT | `/api/sales/:id/status` | Cập nhật trạng thái |
| PUT | `/api/sales/:id/cancel` | Hủy đơn |
| PUT | `/api/sales/:id/pay` | Thanh toán |

### Customers
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/customers` | Danh sách khách hàng |
| POST | `/api/customers` | Thêm khách hàng / Đăng ký |
| PUT | `/api/customers/:id` | Cập nhật thông tin |
| DELETE | `/api/customers/:id` | Xóa (Admin) |

### Uploads
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/upload` | Upload 1 ảnh |
| POST | `/api/upload/multiple` | Upload nhiều ảnh (tối đa 4) |

### Reports
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/reports/dashboard` | Dashboard stats + biểu đồ |

### AI
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/ai/query` | Hỏi AI về doanh thu/tồn kho |

> Xem đầy đủ API tại [src/routes/](src/routes/)

---

## 🌐 Deploy lên Render.com (Miễn phí)

### Yêu cầu
- GitHub account
- Render.com account (đăng ký free)
- Cloudinary account (đăng ký free)

### Các bước

1. **Fork/Clone** repository này
2. **Đăng nhập Render.com** → New → Web Service → Connect GitHub
3. **Cấu hình**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Region: Singapore
4. **Set Environment Variables** trên Render:
   ```
   NODE_ENV=production
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<64_char_random_string>
   GEMINI_API_KEY=<your_gemini_key>
   CLOUDINARY_CLOUD_NAME=<your_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   PAYMENT_WEBHOOK_TOKEN=<chuỗi_bảo_mật_tùy_chọn>
   ```
5. **Deploy!** → Render tự động build và deploy

> ⚠️ **Lưu ý**: Free tier sẽ sleep sau 15 phút idle. Dùng [UptimeRobot](https://uptimerobot.com) để ping mỗi 10 phút.

---

## 💳 Cấu hình nhận diện chuyển khoản tự động

Hệ thống hỗ trợ tự động nhận diện giao dịch chuyển tiền qua Webhook từ cổng **SePay.vn** hoặc **Casso.vn** đến tài khoản ngân hàng của bạn.

### Các bước cấu hình:
1. Đăng ký tài khoản miễn phí trên **SePay.vn** hoặc **Casso.vn**.
2. Liên kết tài khoản ngân hàng nhận tiền của bạn.
3. Tạo một Webhook mới trên dashboard của dịch vụ đó:
   - **URL Webhook**: `https://<ten-app-cua-ban>.onrender.com/api/sales/webhook`
   - **Kiểu Request**: `POST`
   - **Authorization** (Header): Điền token bảo mật khớp với biến `PAYMENT_WEBHOOK_TOKEN` trong biến môi trường Render (nếu có sử dụng).
4. Thực hiện thử một giao dịch chuyển khoản với nội dung chuyển tiền chứa mã đơn hàng (được hiển thị tự động dạng VietQR khi thanh toán). Hệ thống sẽ tự động đối soát và cập nhật trạng thái "Đã thanh toán" trong vòng 3 giây!

---

## 🔐 Tài khoản mặc định

| Vai trò | Tên đăng nhập | Mật khẩu |
|---|---|---|
| Admin | `admin` | *(xem trong MongoDB hoặc chạy reset_admin.js)* |

> **Đổi mật khẩu ngay** sau lần đăng nhập đầu tiên!

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón!

1. Fork project
2. Tạo branch (`git checkout -b feature/TinhNangMoi`)
3. Commit (`git commit -m 'Thêm tính năng mới'`)
4. Push (`git push origin feature/TinhNangMoi`)
5. Tạo Pull Request

---

## 📝 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 📞 Liên hệ

**ThuyR Mart** - [@anhstanh6688](https://github.com/anhstanh6688)

Project Link: [https://github.com/anhstanh6688/thuyrmart](https://github.com/anhstanh6688/thuyrmart)

---

<div align="center">

Made with ❤️ by ThuyR Mart Team  
⭐ Nếu project hữu ích, hãy cho một Star nhé!

</div>
