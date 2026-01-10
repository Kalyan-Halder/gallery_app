// router/verify.js
const express = require("express");
const router = express.Router();
const user = require("../utils/user_schema");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const OAUTH_USER = process.env.OAUTH_USER; // the Gmail address that owns the refresh token

// OAuth client (refresh token is enough; googleapis will fetch/refresh access tokens automatically)
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Gmail API client (HTTPS, not SMTP)
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

function base64url(input) {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Send email via Gmail API (NOT nodemailer/SMTP)
async function sendGmailApiEmail(to, subject, html) {
  // Optional: force token fetch now so you fail early with a useful error if creds are wrong
  await oAuth2Client.getAccessToken();

  // RFC 2822 message with CRLF line endings
  const rawMessage =
    `From: ${OAUTH_USER}\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/html; charset="UTF-8"\r\n` +
    `\r\n` +
    `${html}`;

  const raw = base64url(rawMessage);

  const result = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  console.log("Email sent successfully via Gmail API");
  return result.data;
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
        success: false,
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Update user with OTP
    await user.findOneAndUpdate(
      { email: email },
      { otp: otp },
      { new: true } // Return the updated document (not used, but fine)
    );

    // Email HTML
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

    // Send via Gmail API (HTTPS)
    await sendGmailApiEmail(email, "Password Reset Verification Code", emailHtml);

    res.status(200).json({
      message: "Verification email sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
