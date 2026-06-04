const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// Helper: Upload buffer lên Cloudinary
const uploadToCloudinary = (buffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const cloudinary = require('../config/cloudinary');
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder: 'thuyrmart-products',
                resource_type: 'image',
                transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
};

// Helper: lấy URL từ file (local disk)
const getLocalUrl = (file) => `/uploads/${file.filename}`;

// POST /api/upload - Upload 1 ảnh
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Không tìm thấy file tải lên' });
        }
        
        let fileUrl;
        if (upload._useCloudinary) {
            // Dùng Cloudinary: upload buffer lên cloud
            fileUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
        } else {
            // Local disk
            fileUrl = getLocalUrl(req.file);
        }
        
        res.status(200).json({ 
            success: true, 
            url: fileUrl 
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/upload/multiple - Upload nhiều ảnh
router.post('/multiple', upload.array('images', 4), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Không tìm thấy file tải lên' });
        }
        
        let fileUrls;
        if (upload._useCloudinary) {
            // Upload tất cả lên Cloudinary
            fileUrls = await Promise.all(
                req.files.map(file => uploadToCloudinary(file.buffer, file.mimetype))
            );
        } else {
            // Local disk
            fileUrls = req.files.map(file => getLocalUrl(file));
        }
        
        res.status(200).json({ 
            success: true, 
            urls: fileUrls 
        });
    } catch (error) {
        console.error('Upload multiple error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


