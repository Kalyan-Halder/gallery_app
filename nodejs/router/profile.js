const express = require("express")
const router = express.Router()
const user = require("../utils/user_schema");
const posts = require("../utils/post_schema")


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
                const post = await posts.find({user_id:userExist._id})
                if(!post){
                    return res.status(404).json({message:"No Post Found"})
                }else{
                    return res.status(200).json({post})
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


module.exports = router