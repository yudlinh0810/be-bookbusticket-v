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
const upload = multer({ storage }).single('file'); // Cấu hình nhận 1 file tại 1 thời điểm

// Tải lên cloudinary
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).send('File upload is required');
  }
  let folder = 'bookbusticket/images';
  const id = JSON.parse(req.body.data).id.slice(0, 3);
  if (id === 'CTM') {
    folder = `${folder}/customer/avatar/${JSON.parse(req.body.data).id}`;
  } else if (id === 'STF') {
    folder = `${folder}/staff/avatar/${JSON.parse(req.body.data).id}`;
  } else if (id === 'DRV') {
    folder = `${folder}/staff/avatar/${JSON.parse(req.body.data).id}`;
  } else {
    return res.status(400).send('The user not exist');
  }
  const allowedFormats = ['jpg', 'png', 'jpeg'];

  //Kiểm tra định dạng file
  const fileException = req.file.originalname.split('.').pop();
  if (!allowedFormats.includes(fileException)) {
    return res.status(400).send('Invalid file format. Only jpg and png are allowed');
  }
  const public_img_id = JSON.parse(req.body.data).public_img_id;
  console.log('public_img', public_img_id);
  // Tạo stream để upload ảnh từ memoryStorage lên cloudinary
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: folder,
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
      req.file.cloudinaryPublic = result.public_id;
      req.file.cloudinaryURL = result.secure_url;
      next();
    }
  );

  // Stream file lên cloudinary
  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

module.exports = { upload, uploadToCloudinary };
