const { getAllServices } = require("../models/serviceModels.js");

const services = async (req, res) => {
  try {
    const services = await getAllServices();
    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: services,
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

module.exports = services;
