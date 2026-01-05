const express = require("express")
const router = express.Router()

// Calling User Schema to create user
const user = require("../utils/user_schema"); 

router.route("/registration").post(async(req,res)=>{
    console.log(req.body)
    try{
         
         const user_exist = await user.findOne({email:req.body.email})
         if(!user_exist){
            const data = new user(req.body)
            await data.save();
            res.status(200).json({message:"New user Created"})
         }else{
            res.status(400).json({message:"User Already Existsssss"})
         }
    }catch(err){
        console.log(err.name)
        res.status(400).json({messsage:"Page not found"})
    }
})

module.exports  = router;

