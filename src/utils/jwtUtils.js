const jwt = require("jsonwebtoken");
const { getUserbyEmail } = require("../models/userModels.js");
const { config } = require("dotenv");
config();

// generate json web token
const generateToken = async (email) => {
  try {
    const key = process.env.LOGIN_KEY;
    const activeTime = "12h";
    const accessToken = jwt.sign({ email: email }, key, {
      expiresIn: activeTime,
    });
    console.log('Token successfully generated')
    return accessToken;
  } catch (error) {
    console.log(`message: error on generate JWT, ${error.messsage}`);
    return {
      message: error.message,
    };
  }
};

module.exports = generateToken;
