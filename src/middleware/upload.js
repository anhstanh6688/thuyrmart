const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary is configured (production)
const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

let upload;

if (isCloudinaryConfigured) {
    // ====== PRODUCTION: Upload lên Cloudinary via memory buffer ======
    // Dùng memory storage, sau đó stream lên Cloudinary trong route handler
    upload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (req, file, cb) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Chỉ chấp nhận định dạng ảnh (JPEG, PNG, GIF, WEBP)'), false);
            }
        }
    });
    // Mark that we're using Cloudinary for upload route to handle
    upload._useCloudinary = true;

} else {
    // ====== DEVELOPMENT: Upload local disk ======
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận định dạng ảnh (JPEG, PNG, GIF, WEBP)'), false);
        }
    };

    upload = multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: fileFilter
    });
    upload._useCloudinary = false;
}

module.exports = upload;


