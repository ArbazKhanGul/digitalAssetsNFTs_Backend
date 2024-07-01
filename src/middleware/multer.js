// 

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images', // Folder where the images will be stored in Cloudinary
    format: async (req, file) => 'jpg', // supports promises as well
    public_id: (req, file) => file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9),
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
