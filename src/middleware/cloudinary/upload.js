require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Khởi tạo multer
const storage = multer.memoryStorage(); //Sử dụng memoryStorage để lưu trữ tạm thời file

//Middleware upload
const upload = multer({ storage }).single('file'); // Cấu hình nhận 1 file tại 1 thời điểm

// Tải lên cloudinary
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) {
    return res.status(404).send('No file uploaded');
  }

  let folder = req.body.folder || 'bookbusticket/images';
  const allowedFormats = ['jpg', 'png'];

  //Kiểm tra định dạng file
  const fileException = req.file.originalname.split('.').pop();
  if (!allowedFormats.includes(fileException)) {
    return res.status(400).send('Invalid file format. Only jpg and png are allowed');
  }

  // Tạo stream để upload ảnh từ memoryStorage lên cloudinary
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: folder,
      allowed_formats: allowedFormats,
    },
    (error, result) => {
      if (error) {
        return res.status(500).send('Cloudinary upload failed: ', error.message);
      }

      //Lưu URL từ cloudinary vào req.file
      req.file.cloudinaryURL = result.secure_url;
      next();
    }
  );

  // Stream file lên cloudinary
  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

module.exports = { upload, uploadToCloudinary };
