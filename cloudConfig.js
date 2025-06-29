const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    api_key: process.env.CLOUD_API_KEY,
    api_secret:  process.env.CLOUD_API_SECRET,
    cloud_name:  process.env.CLOUD_NAME,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // Resize if image is too large
            { quality: 'auto' },                         // Compress automatically
            { fetch_format: 'auto' }                     // Save in optimal format (WebP/JPEG)
        ],
    },
});

module.exports = {
    storage,
    cloudinary,
};
