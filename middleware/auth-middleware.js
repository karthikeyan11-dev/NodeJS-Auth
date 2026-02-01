const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token Provided",
    });
  }

  try {
    const decodedinfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedinfo);

    req.userInfo = decodedinfo;

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Token Invalid",
    });
  }
};

module.exports = authMiddleware;
