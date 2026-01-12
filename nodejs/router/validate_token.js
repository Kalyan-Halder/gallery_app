const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../utils/user_schema"); // ✅ model
const router = express.Router();

router.post("/validate_token", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ valid: false, message: "Token missing" });
    }

    // ✅ MUST match whatever you used in /signin (SECTETKEY in your case)
    const decoded = jwt.verify(token, process.env.SECTETKEY);

    // Your /signin signs: jwt.sign({ _id: user_exist._id }, ...)
    const userId = decoded._id; // ✅ simplest
    if (!userId) {
      return res.status(401).json({ valid: false, message: "Invalid token payload" });
    }

    const foundUser = await User.findById(userId)
      .select("_id username first_name last_name email")
      .lean();

    if (!foundUser) {
      return res.status(401).json({ valid: false, message: "User not found" });
    }

    return res.json({ valid: true, user: foundUser });
  } catch (err) {
    return res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
});

module.exports = router;
