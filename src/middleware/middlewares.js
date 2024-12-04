const { upload, uploadToCloudinary } = require('./cloudinary/upload');

const uploadImageMiddleware = [upload, uploadToCloudinary];

module.exports = uploadImageMiddleware;
