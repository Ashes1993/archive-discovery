"use server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your secure credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPoster(formData) {
  try {
    const file = formData.get("file");
    if (!file) throw new Error("No file provided.");

    // Convert the incoming file into a buffer so Cloudinary can stream it
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "archive-discovery-posters" }, // Puts uploads in a neat folder
          (error, result) => {
            if (error) {
              reject({ success: false, error: error.message });
            } else {
              resolve({ success: true, url: result.secure_url });
            }
          },
        )
        .end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return { success: false, error: error.message };
  }
}
