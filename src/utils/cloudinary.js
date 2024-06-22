import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// console.log("Cloudinary Config:", {
//   cloud_name: process.env.cloudinary_cloud_name,
//   api_key: process.env.cloudinary_api_key,
//   api_secret: process.env.cloudinary_api_secret,
// });

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.cloudinary_cloud_name,
      api_key: process.env.cloudinary_api_key,
      api_secret: process.env.cloudinary_api_secret,
    });

    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "/portfolio",
    });
    //file has been successfully
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temp file
    console.log("Coudinay error", error);
    return null;
  }
};

const unLinkFileOnCloudinary = async (localFilePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.cloudinary_cloud_name,
      api_key: process.env.cloudinary_api_key,
      api_secret: process.env.cloudinary_api_secret,
    });

    if (!localFilePath) return null;
    const res = await cloudinary.uploader.destroy(localFilePath);
    return res;
  } catch (error) {
    console.log("Coudinay error", error);
    return null;
  }
};

export { uploadOnCloudinary, unLinkFileOnCloudinary };
