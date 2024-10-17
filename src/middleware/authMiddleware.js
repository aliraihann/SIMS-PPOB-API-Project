const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function authentication(req, res, next) {
  const auth = req.headers.authorization || req.headers.Authorization;
  const token = auth && auth.split(" ")[1];
  const key = process.env.LOGIN_KEY;
  // check if token available
  if (!token) {
    return res.status(400).json({
      status: 102,
      message: "Token tidak ditemukan",
      data: null,
    });
  }
  // verify jwt token
  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      // error handling if token invalid
      return res.status(401).json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null,
      });
    }
    // set the user email from jwt payload
    req.email = decoded.email;
    req.auth = true;
    next();
  });
}

module.exports = authentication;
