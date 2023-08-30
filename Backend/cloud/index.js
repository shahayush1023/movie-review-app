const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloudname = process.env.CLOUD_NAME;
const cloudkey =  process.env.CLOUD_API_KEY;
const cloudsecret = process.env.CLOUD_API_SECRET; 

cloudinary.config({
  cloud_name:cloudname,
  api_key: cloudkey,
  api_secret:cloudsecret,
  secure: true,
});

module.exports = cloudinary;
