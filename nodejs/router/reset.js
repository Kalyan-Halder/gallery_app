// router/verify.js
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const user = require("../utils/user_schema");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID 
const CLIENT_SECRET = process.env.CLIENT_SECRET 
const REDIRECT_URL = process.env.REDIRECT_URL  
const REFRESH_TOKEN = process.env.REFRESH_TOKEN  
const OAUTH_USER = process.env.OAUTH_USER  

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Function to create OAuth2 transporter
async function createTransporter() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: OAUTH_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    return transporter;
  } catch (error) {
    console.error("Error creating OAuth2 transporter:", error);
    throw error;
  }
}

// Function to send email using OAuth2
async function sendOAuthEmail(to, subject, html) {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: OAUTH_USER,
      to: to,
      subject: subject,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via OAuth2");
    return result;
  } catch (error) {
    console.error("Error sending email via OAuth2:", error);
    throw error;
  }
}

router.route("/reset").post(async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Reset password request for:", email);

    // Find user by email
    const userExist = await user.findOne({ email: email });
    
    if (!userExist) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Update user with OTP
    const updatedUser = await user.findOneAndUpdate(
      { email: email },
      { otp: otp },
      { new: true } // Return the updated document
    );
    
    // Send OTP email using OAuth2
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Verification</h2>
        <p>You requested a password reset. Please use the following verification code:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2c3e50; margin: 0; font-size: 36px;">${otp}</h1>
        </div>
        <p>Enter this code in the OTP verification box to proceed with resetting your password.</p>
        <p>This code will expire in 10 minutes.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #777; font-size: 12px;">
          If you didn't request this password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
    `;

    await sendOAuthEmail(
      email,
      "Password Reset Verification Code",
      emailHtml
    );

    res.status(200).json({ 
      message: "Verification email sent successfully",
      success: true 
    });
    
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
});

module.exports = router;