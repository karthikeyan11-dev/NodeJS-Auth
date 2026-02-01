const express = require("express");
const authMiddleware = require('../middleware/auth-middleware.js')
const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {

    const{username, role, userId} = req.userInfo;
  res.json({
    message: "Welcome to the Home page",
    User : {
        _id : userId,
        username,
        role
    }
  });
});

module.exports = router;