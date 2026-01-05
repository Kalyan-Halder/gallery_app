const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Dot env setup
const dotenv = require("dotenv")
dotenv.config({path:"../config.env"})
const SECTETKEY = process.env.SECTETKEY;

// Calling User Schema
const user = require("../utils/user_schema");

router.route("/signin").post( async(req,res)=>{
    try{
        const {username, email, password} = req.body
        const user_exist = await user.findOne({email:email,username:username})
        
        if(user_exist){
             
             //check if the password matched
             const isPassword = await bcrypt.compare(password,user_exist.password)
             if(isPassword){

                //signing the token with expire date
                const  user_token =  jwt.sign({_id:user_exist._id},SECTETKEY,{expiresIn:"15d"})

                const update_token = await user.findByIdAndUpdate({_id:user_exist._id},{token:user_token})
                await update_token.save()
                console.log("I am success")
                res.status(200).json({token : user_token})
             }else{
                res.status(400).json({message:"Incorrect Username/Email/Password"})
             }
        }else{
            res.status(400).json({message:"Wrong Username Or password"})
        }
        
    }catch(err){
        console.log(err)
        res.status(400).send("Page not found")
    }
})

module.exports  = router;