const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

 
const post = require("../utils/post_schema");
const user = require("../utils/user_schema");

const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
 
cloudinary.config({
  cloud_name: "dmmimbiq4",
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_API,
});

 
const storage = multer.memoryStorage();
const upload = multer({ storage });
 
const uploadFields = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

router.route("/create_post").post(uploadFields, async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);

    
    const uploadedFile =
      (req.files?.file && req.files.file[0]) ||
      (req.files?.image && req.files.image[0]) ||
      null;
 
    const {
      user_name,
      description,
      location,
      tags,
    } = req.body;

    
 
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }
    const userExist = await user.findOne({token:req.body.token})
    if(!userExist){
      return res.status(400).json({
        success: false,
        message: "Something Went Wrong",
      });
    }

   
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

    
    if (uploadedFile) {
      const fileStr = `data:${uploadedFile.mimetype};base64,${uploadedFile.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: `photo_gallery/${userExist.username}/posts`,
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

    
    const newPost = new post({
      user_id: userExist._id,
      user_name: user_name || "",  
      description: description || "",
      location: location || "",     
      tags: tagsArray,              
      url: imageUrl,               
      created_at: new Date(),
    });
    
    //update the post count for the user and save 
    const updateUser = await user.findOneAndUpdate({_id:userExist._id}, {posts: userExist.posts+1})
    await updateUser.save()
    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        postId: newPost._id,
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
