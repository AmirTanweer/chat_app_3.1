const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User=require('../models/User.model')
dotenv.config();

const Authentication =async (req, res, next) => {
  try {
    // ✅ Extract token correctly from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized Access: No token provided" });
    }

    // ✅ Get the actual token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const validToken = jwt.verify(token, process.env.SECRET);
    if (!validToken) {
      return res.status(401).json({ error: "Unauthorized Access: Invalid token" });
    }

    // ✅ Attach user details to request for future use
    req.user = await User.findById(validToken.userId).select("-password");

    
    
     
    next(); // ✅ Move to the next middleware
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized Access: Invalid token" });
  }
};

module.exports = Authentication;
