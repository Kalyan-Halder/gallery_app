const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer");
// Calling User Schema to create user
const user = require("../utils/user_schema"); 

const dotenv = require("dotenv")

dotenv.config({path:"./config.env"})
const email_password = process.env.PASSWORD;
const email_address = process.env.EMAIL

router.route("/registration").post(async(req,res)=>{
   
    try{
         const { email } = req.body; 
         const user_exist = await user.findOne({email:req.body.email})
         if(!user_exist){
            const data = new user(req.body)
            await data.save();

            const otp = Math.floor(100000 + Math.random() * 900000);
            const updatedUser = await user.findOneAndUpdate(
            { email: email },
            { 
                $set: { 
                otp: otp,
                 otpCreatedAt: new Date() // Optional: add timestamp for OTP creation
                 }
                },
                { new: true } // Returns the updated document
                );

                // Send password reset email
            const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth: {
                    user: email_address,
                    pass: email_password,
            },
            });

            const mailOptions = {
            from: email_address,
            to: email,
            subject: "One Time Verificaion Code",
            html: `<p>Enter the following code to the OTP box:</p>
                       <p style="font-size: 34px; font-weight: bold;">${otp}</p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                    console.log("Error sending email:", error);
                    res.status(500).json({ message: "Error sending email" });
            } else {
                    console.log("Email sent for Verification:", info.response);
                    res
                    .status(200)
                    .json({ message: "Verification email sent successfully" });
            }
            });
            // Creates user but verification is required
            res.status(200).json({message:"New user Created"})

         }else{
            res.status(400).json({message:"User Already Existsssss"})
         }
    }catch(err){
        console.log(err)
        res.status(400).json({messsage:"Page not found"})
    }
})

module.exports  = router;

