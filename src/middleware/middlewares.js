const { upload, uploadToCloudinary } = require('./cloudinary/upload');
const { carUpload, carUploadToCloudinary } = require('./cloudinary/car_upload');

const uploadImageMiddleware = [upload, uploadToCloudinary];
const carUploadImageMiddleware = [carUpload, carUploadToCloudinary];

module.exports = { uploadImageMiddleware, carUploadImageMiddleware };
