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
const OAUTH_USER = process.env.OAUTH_USER;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Gmail API client (HTTPS)
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

function base64url(input) {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Keeps your existing function name so the rest of your logic stays the same.
// Sends via Gmail API (NOT SMTP).
async function sendOAuthEmail(to, subject, html) {
  try {
    // Optional: forces token fetch now so errors show up here
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

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: base64url(rawMessage) }, // base64url-encoded raw message
    });

    return result.data;
  } catch (error) {
    throw error;
  }
}

router.route("/registration").post(async (req, res) => {
  try {
    const { email } = req.body;
    const user_exist = await user.findOne({ email: req.body.email });

    if (!user_exist) {
      const data = new user(req.body);
      await data.save();

      const otp = Math.floor(100000 + Math.random() * 900000);
      await user.findOneAndUpdate(
        { email: email },
        {
          $set: {
            otp: otp,
            otpCreatedAt: new Date(),
          },
        },
        { new: true }
      );

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Account Verification Code</h2>
          <p>Enter the following code to the OTP box:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="font-size: 34px; font-weight: bold;">${otp}</p>
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `;

      await sendOAuthEmail(email, "One Time Verification Code", emailHtml);

      res.status(200).json({ message: "New user Created" });
    } else {
      res.status(400).json({ message: "User Already Exists" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ messsage: "Page not found" });
  }
});

module.exports = router;
