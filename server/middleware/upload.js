/**
 * File Upload Middleware
 * Handles photo uploads for water point reports
 */

const multer = require('multer');
const os = require('os');
const path = require('path');
const fs = require('fs');

// On serverless hosts (Vercel) the filesystem is ephemeral, so use /tmp.
const uploadsDir = process.env.VERCEL
    ? path.join(os.tmpdir(), 'uploads')
    : path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-randomstring.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'report-' + uniqueSuffix + ext);
    }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // Default: 5MB
    },
    fileFilter: fileFilter
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'File size is too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    } else if (err) {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
    next();
};

module.exports = {
    upload,
    handleMulterError
};
