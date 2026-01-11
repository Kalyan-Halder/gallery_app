const express = require("express")
const router = express.Router()
const user = require("../utils/user_schema");
const posts = require("../utils/post_schema")
const mongoose = require("mongoose")


router.route("/profile").post(async (req, res) =>{
    try{
        const {token} = req.body
        if(!token){
            return res.status(400).json({message:"Something Went Worng"})
        }else{
            const userExist = await user.findOne({token})
            if(!userExist){
                res.status(401).json({message:"Something Went Worng"})
            }else{
               const first_name = userExist.first_name
               const last_name = userExist.last_name
               const date_of_birth = userExist.date_of_birth
               const username = userExist.username
               const followers = userExist.followers
               const following = userExist.following
               const posts = userExist.posts
               const bio = userExist.bio
               const address = userExist.address
               const weblink = userExist.weblink
               const coverUrl = userExist.coverUrl || null
               const avatarUrl = userExist.avatarUrl || null

               function formatDhakaOnlyDate(isoString) {
                return new Intl.DateTimeFormat("en-GB", {
                    timeZone: "Asia/Dhaka",
                    day: "numeric",     
                    month: "short",     
                    year: "numeric",    
                }).format(new Date(isoString));
                }

                const dateStr = formatDhakaOnlyDate(userExist.created_at);

               return res.status(200).json({first_name,last_name,date_of_birth, username,followers,following,posts,dateStr,bio,address,weblink,coverUrl, avatarUrl})
            }
        }
        res.status(200).json({message:"hi"})
    }catch(err){
        console.log(err)
    }
})

router.route("/self_post").post(async (req,res)=>{
    try{
        const {token} = req.body
        if(!token){
            return res.status(400).json({message:"Something Went Worng"})
        }else{
            const userExist = await user.findOne({token})
            if(!userExist){
                res.status(401).json({message:"Something Went Worng"})
            }else{
                const post = await posts.find({user_id:userExist._id}).sort({ created_at: -1 });

                //also send the saved post
                const users_saved = await user.findOne({token}).select("savedPost");
                const ids = users_saved.savedPost;
                const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
                const saved_posts = await posts.find({ _id: { $in: objectIds } });
                saved_posts.sort((a, b) => ids.indexOf(String(a._id)) - ids.indexOf(String(b._id)));

                //also send the liked post
                const users_liked = await user.findOne({token}).select("likedPost");
                const idss = users_liked.likedPost;
                const objectIdss = idss.map(id => new mongoose.Types.ObjectId(id));
                const liked_posts = await posts.find({ _id: { $in: objectIdss } });
                liked_posts.sort((a, b) => ids.indexOf(String(a._id)) - ids.indexOf(String(b._id)));
                
                if(!post){
                    return res.status(404).json({message:"No Post Found"})
                }else{
                    return res.status(200).json({post:post,saved_posts,liked_posts})
                }
            }
        }

    }catch(err){
        console.log(err)
    }
})



// Updating Avater and Cover

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
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
  { name: "avatar", maxCount: 1 },
  { name: "cover", maxCount: 1 },
]);

async function uploadToCloudinary(file, { folder, publicId }) {
  const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const uploadResponse = await cloudinary.uploader.upload(fileStr, {
    folder,
    public_id: publicId,
    transformation: [
      { width: 1000, height: 1000, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });

  return uploadResponse.secure_url;
}





router.route("/edit_profile").post(uploadFields, async (req, res) => {
  try {
    const userExist = await user.findOne({ token: req.body.token });
    if (!userExist) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const avatarFile = req.files?.avatar?.[0] || null;
    const coverFile = req.files?.cover?.[0] || null;

    if (!avatarFile && !coverFile) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    let avatarUrl = userExist.avatarUrl || "";
    let coverUrl = userExist.coverUrl || "";

    // upload avatar if present
    if (avatarFile) {
      avatarUrl = await uploadToCloudinary(avatarFile, {
        folder: `photo_gallery/${userExist.username}/profile/avatar`,
        publicId: `avatar_${Date.now()}`,
      });
    }

    // upload cover if present
    if (coverFile) {
      coverUrl = await uploadToCloudinary(coverFile, {
        folder: `photo_gallery/${userExist.username}/profile/cover`,
        publicId: `cover_${Date.now()}`,
      });
    }

    // save to DB (change field names to match your schema)
    await user.updateOne(
      { _id: userExist._id },
      { $set: { avatarUrl, coverUrl } }
    );

    return res.json({
      success: true,
      message: "Profile updated!",
      avatarUrl,
      coverUrl,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.route("/delete_post").post(async (req,res)=>{
  try{
    
    const {token,post_id} = req.body;
    console.log(req.body)
    const post = await posts.findOne({_id:post_id})
    const userExist = await user.findOne({token})
    if(!post || (post.user_id != userExist._id)){
      return res.status(400).json({message:"Post Does Not Exist or can not be deleted"})
    }else{
      const user_id = post.user_id;
      
      //delete the post
      const userExist = await user.findOne({_id:user_id})
      await user.findOneAndUpdate({_id:user_id}, {posts: userExist.posts-1})
      await posts.findOneAndDelete({_id:post_id})
    }
    console.log(post) 
  }catch(err){
    console.log(err)
  }
})

router.route("/save_post").post(async (req, res) => {
  try {
    const { post_id, token } = req.body;

    if (!post_id || !token) {
      return res.status(400).json({ message: "post_id and token are required" });
    }

    const userExist = await user.findOne({ token });
    const postExist = await posts.findById(post_id);


    if (!userExist || !postExist) {
      return res.status(400).json({ message: "something went wrong" });
    }

    const alreadySaved = (userExist.savedPost || []).some(
      (id) => id.toString() === post_id.toString()
    );

    if (alreadySaved) {
      await user.updateOne(
        { _id: userExist._id },
        { $pull: { savedPost: post_id } }
      );
      return res.status(201).json({ message: "Post removed from saved", saved: false });
    } else {
      await user.updateOne(
        { _id: userExist._id },
        { $addToSet: { savedPost: post_id } } // avoids duplicates
      );
  
      const user_with_updated_saved_post = await user.findOne({token})
      return res.status(200).json({ saved_posts:user_with_updated_saved_post.savedPost,message: "Post saved", saved: true });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.route("/like_post").post(async (req, res) => {
  try {
    const { post_id, token } = req.body;
    console.log(req.body);
    
    if (!post_id || !token) {
      return res.status(400).json({ message: "post_id and token are required" });
    }

    const userExist = await user.findOne({ token });
    const postExist = await posts.findById(post_id);

    if (!userExist || !postExist) {
      return res.status(400).json({ message: "something went wrong" });
    }

    const alreadyLiked = (userExist.likedPost || []).some(
      (id) => id.toString() === post_id.toString()
    );

    if (alreadyLiked) {
      // Unlike: Remove from user's liked posts and decrement post likes
      await Promise.all([
        user.updateOne(
          { _id: userExist._id },
          { $pull: { likedPost: post_id } }
        ),
        posts.updateOne(
          { _id: post_id },
          { $inc: { likes: -1 } }
        )
      ]);
      
      // Fetch updated post to get current like count
      const updatedPost = await posts.findById(post_id);
      const user_with_updated_liked_post = await user.findOne({ token });
      
      return res.status(201).json({ 
        liked_posts: user_with_updated_liked_post.likedPost,
        updatedLikes: updatedPost.likes,
        message: "Post removed from liked", 
        liked: false 
      });
    } else {
      // Like: Add to user's liked posts and increment post likes
      await Promise.all([
        user.updateOne(
          { _id: userExist._id },
          { $addToSet: { likedPost: post_id } }
        ),
        posts.updateOne(
          { _id: post_id },
          { $inc: { likes: 1 } }
        )
      ]);
      
      // Fetch updated post to get current like count
      const updatedPost = await posts.findById(post_id);
      const user_with_updated_liked_post = await user.findOne({ token });
      
      return res.status(200).json({ 
        liked_posts: user_with_updated_liked_post.likedPost,
        updatedLikes: updatedPost.likes,
        message: "Post liked", 
        liked: true 
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});



module.exports = router