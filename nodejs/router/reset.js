// router/verify.js
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const user = require("../utils/user_schema");

const dotenv = require("dotenv")
dotenv.config({path:"./config.env"})
const email_password = process.env.PASSWORD;
const email_address = process.env.EMAIL

router.route("/reset").post(async (req, res) => {
    try {
        const { email} = req.body;
        

        // Find user by email
        const userExist = await user.findOne({ email: email });
        
        if (!userExist) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

            const otp = Math.floor(100000 + Math.random() * 900000);
            const updatedUser = await user.findOneAndUpdate({ email: email },{otp:otp});
            await updatedUser.save();

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
            subject: "Password Verification Code",
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