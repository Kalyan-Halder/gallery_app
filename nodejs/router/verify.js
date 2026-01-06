// router/verify.js
const express = require("express");
const router = express.Router();
const user = require("../utils/user_schema");
const bcrypt = require('bcrypt');
const saltRounds = 10;
router.route("/verify").post(async (req, res) => {
    try {
         var { email, otp , password , conpassword } = req.body;
        // Find user by email
        const userExist = await user.findOne({ email: email });
        
        if (!userExist) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check if OTP matches
        if (userExist.otp !== parseInt(otp)) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false
            });
        }else{
           const updatedUser = await user.findOneAndUpdate({ email: email,},{ authentication: true });
           await updatedUser.save();
              
           if(password && conpassword){
                password = await bcrypt.hash(password, saltRounds);
                conpassword = await bcrypt.hash(conpassword, saltRounds);

                const updatedUser = await user.findOneAndUpdate({ email: email },{password},{conpassword});
                await updatedUser.save();

                return res.status(201).json({message:"Password Has been updated successfully"})
           }

        if(updatedUser){
            return res.status(200).send({message:"User Authenticated"})
        }
        }
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
});

module.exports = router;