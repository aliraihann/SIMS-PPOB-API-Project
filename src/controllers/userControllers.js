const {
  registerUser,
  getUserbyEmail,
  getUserProfilebyEmail,
  updateUserProfile,
} = require("../models/userModels.js");
const { initiateNewBalance } = require("../models/balanceModels.js");
const { hash } = require("bcrypt");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/jwtUtils.js");

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const register = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  // test email pattern
  const isEmailValid = emailPattern.test(email);
  try {
    // check minimum password length
    if (password.length < 8) {
      throw new Error("Password minimal berjumlah 8 karakter");
    }
    // check if the email pattern is correct
    if (!isEmailValid) {
      throw new Error("Parameter email tidak sesuai format");
    }
    // check if the user already exist or not by email
    const isEmailExist = await getUserbyEmail(email);
    if (isEmailExist) {
      throw new Error("Email telah digunakan");
    }
    // hashing password for security
    const hashPassword = await hash(password, 10);
    // register user into database
    const newUserId = await registerUser(
      email,
      first_name,
      last_name,
      hashPassword
    );
    // initiate new balance new user
    const userBalance = await initiateNewBalance(newUserId);
    if (!userBalance) {
      throw new Error("Gagal membuat balance untuk user");
    }

    res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 102,
      message: `${error.message}`,
      data: null,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const customError = {
    status: 0,
    message: "",
    resStatus: 0,
  };
  try {
    // test email pattern
    const isEmailValid = emailPattern.test(email);
    // check if the email pattern is correct
    if (!isEmailValid) {
      customError.status = 102;
      customError.message = "Parameter email tidak sesuai format";
      customError.resStatus = 400;
      const error = new Error("expected");
      error.customError = customError;
      throw error;
    }
    // check if the user already exist or not by email
    const user = await getUserbyEmail(email);
    console.log(user);
    if (!user) {
      customError.status = 103;
      customError.message = "Username atau password salah";
      customError.resStatus = 400;
      const error = new Error("expected");
      error.customError = customError;
      throw error;
    }
    // check if the user's password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      customError.status = 103;
      customError.message = "Username atau password salah";
      customError.resStatus = 400;
      const error = new Error("expected");
      error.customError = customError;
      throw error;
    }
    // generate json web token
    const token = await generateToken(email);
    res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: {
        token: token,
      },
    });
  } catch (error) {
    if (error.message === "expected") {
      // handle expected error
      res.status(error.customError.resStatus).json({
        status: error.customError.status,
        message: error.customError.message,
        data: null,
      });
    } else {
      // handle unexpected errors
      console.error("Unexpected error:", error);
      res.status(500).json({
        status: 103,
        message: "Internal server error",
        data: null,
      });
    }
  }
};

const profile = async (req, res) => {
  const { email } = req;
  try {
    // check if the user already exist or not by email
    const user = await getUserProfilebyEmail(email);
    res.status(200).json({
      status: 0,
      message: "sukses",
      data: user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 108,
      message: err.message,
      data: null,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    const { email } = req;
    // set the update's data
    const changes = {
      email,
      first_name,
      last_name,
    };
    // update the user profile
    const updateResult = await updateUserProfile(changes);
    // check if the update is success
    if (updateResult.rowCount === 0) {
      throw new Error("Gagal update profile");
    }
    // get user's profile with the new updated information
    const user = await getUserProfilebyEmail(email);

    res.status(200).json({
      status: 0,
      message: "Update Profile berhasil",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: 108,
      message: error.message,
      data: null,
    });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const { email } = req;

    // Check if file is uploaded
    if (!req.file) {
      throw new Error("Gagal upload file");
    }

    // Extract the filename of the uploaded file for dev with multer disk storage
    let profileImage = `uploads/${req.file.filename}`;
    if (profileImage.includes("undefined")) {
      // for production purpose using multer memory storage
      profileImage = `memorystorage/uploads/${req.file.originalname}`;
    }

    // set the update's data
    const changes = {
      email,
      profile_image: profileImage,
    };
    // update the user profile
    const updateResult = await updateUserProfile(changes);
    // check if the update is success
    if (updateResult.rowCount === 0) {
      throw new Error("Gagal update profile");
    }
    // get user's profile with the new updated information
    const user = await getUserProfilebyEmail(email);

    res.status(200).json({
      status: 0,
      message: "Update Profile berhasil",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};

module.exports = {
  register,
  login,
  profile,
  updateProfile,
  updateProfileImage,
};
