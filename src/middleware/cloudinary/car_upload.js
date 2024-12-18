require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const deleteImageOld = require('../../services/deleteImage');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Khởi tạo multer
const storage = multer.memoryStorage(); //Sử dụng memoryStorage để lưu trữ tạm thời file

//Middleware upload
const carUpload = multer({ storage }).single('file'); // Cấu hình nhận 1 file tại 1 thời điểm
// Tải lên cloudinary
const carUploadToCloudinary = async (req, res, next) => {
  const id = JSON.parse(req.body.data).id || 'bookbusticket/images/car';
  console.log('id', id);
  if (!req.file) {
    return next();
  }
  if (!req.file.buffer) {
    return res.status(400).send('Invalid file upload');
  }

  const allowedFormats = ['jpg', 'png', 'jpeg'];

  //Kiểm tra định dạng file
  const fileException = req.file.originalname.split('.').pop();
  if (!allowedFormats.includes(fileException)) {
    return res.status(400).send('Invalid file format. Only jpg and png are allowed');
  }
  if (req.file !== null) {
    const public_img_id = JSON.parse(req.body.data).public_img_id;
    console.log('public_img', public_img_id);
    // Tạo stream để upload ảnh từ memoryStorage lên cloudinary
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `bookbusticket/images/car/${id}`,
        allowed_formats: allowedFormats,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).send(`Cloudinary upload failed: ${error.message}`);
        }
        if (public_img_id) {
          deleteImageOld(public_img_id);
        }
        req.file.cloudinaryPublic = result.public_id || null;
        req.file.cloudinaryURL = result.secure_url || null;
        console.log('public', req.file.cloudinaryPublic);
        console.log('url', req.file.cloudinaryURL);
        next();
      }
    );

    // Stream file lên cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  }
};

module.exports = { carUpload, carUploadToCloudinary };
