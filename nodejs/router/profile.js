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

               function formatDhakaOnlyDate(isoString) {
                return new Intl.DateTimeFormat("en-GB", {
                    timeZone: "Asia/Dhaka",
                    day: "numeric",     
                    month: "short",     
                    year: "numeric",    
                }).format(new Date(isoString));
                }

                const dateStr = formatDhakaOnlyDate(userExist.created_at);

               return res.status(200).json({first_name,last_name,date_of_birth, username,followers,following,posts,dateStr,bio,address,weblink})
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

module.exports = router