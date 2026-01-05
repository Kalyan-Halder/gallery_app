const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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
const upload = multer({ storage: storage });



// POST route - now with file upload handling
router.route('/create_post').post(upload.single('image'), async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received file:", req.file);

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file"
      });
    }

    // Get text data from request body
    const { user_Id, user_name, title, description } = req.body;

     

    // Convert file buffer to base64 for Cloudinary
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "posts",
      public_id: `post_${Date.now()}`,
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    console.log("Cloudinary upload successful:", uploadResponse.secure_url);

    // Create new post document with Cloudinary URL
    const newPost = new post({
      user_Id: user_Id,
      user_name: user_name,
      title: title,
      description: description || "",
      url: uploadResponse.secure_url, 
      created_at: new Date()
    });

    // Save to database
    await newPost.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        postId: newPost._id,
        title: newPost.title,
        imageUrl: newPost.url,
        createdAt: newPost.created_at
      }
    });

  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message
    });
  }
});

module.exports = router;