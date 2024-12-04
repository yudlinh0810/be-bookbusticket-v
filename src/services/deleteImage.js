const cloudinary = require('cloudinary').v2;

const deleteImageOld = async (imgOld) => {
  try {
    const result = await cloudinary.uploader.destroy(imgOld);
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

module.exports = deleteImageOld;
