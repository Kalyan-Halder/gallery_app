const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Calling Post Schema
const post = require("../utils/post_schema");

const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dmmimbiq4",
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_API,
});

// Set up multer for memory storage (temporary storage in RAM)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ accept either "file" (your frontend) or "image" (your old code)
const uploadFields = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

router.route("/create_post").post(uploadFields, async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);

    // ✅ read uploaded file (supports both keys)
    const uploadedFile =
      (req.files?.file && req.files.file[0]) ||
      (req.files?.image && req.files.image[0]) ||
      null;

    // ✅ read fields from multipart form
    // frontend sends: user_id, title, description, location, tags(JSON string)
    const {
      user_id,
      user_Id, // backward compatible (if old clients still send this)
      user_name,
      title,
      description,
      location,
      tags,
    } = req.body;

    const finalUserId = user_Id || user_id;

    // ✅ basic validation (keep it minimal)
    if (!finalUserId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "user_id, title, and description are required",
      });
    }

    // ✅ parse tags (frontend sends JSON.stringify([...]))
    let tagsArray = [];
    try {
      if (tags) {
        tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
        if (!Array.isArray(tagsArray)) tagsArray = [];
      }
    } catch (e) {
      tagsArray = [];
    }

    let imageUrl = "";

    // ✅ upload to Cloudinary only if a file exists
    if (uploadedFile) {
      const fileStr = `data:${uploadedFile.mimetype};base64,${uploadedFile.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: "posts",
        public_id: `post_${Date.now()}`,
        transformation: [
          { width: 1000, height: 1000, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      console.log("Cloudinary upload successful:", uploadResponse.secure_url);
      imageUrl = uploadResponse.secure_url;
    }

    // ✅ Create new post document
    // Keep your original fields, but add location + tags if your schema supports them.
    const newPost = new post({
      user_Id: finalUserId,
      user_name: user_name || "", // optional
      title: title,
      description: description || "",
      location: location || "",     // ✅ new
      tags: tagsArray,              // ✅ new
      url: imageUrl,                // "" if no file uploaded
      created_at: new Date(),
    });

    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        postId: newPost._id,
        title: newPost.title,
        imageUrl: newPost.url || null,
        location: newPost.location || "",
        tags: newPost.tags || [],
        createdAt: newPost.created_at,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
});

module.exports = router;
