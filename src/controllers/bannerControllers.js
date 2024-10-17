const getAllBanners = require("../models/bannerModels.js");

const banners = async (req, res) => {
  try {
    let bannersData = await getAllBanners();
    // Check if bannersData is empty
    if (bannersData.length === 0) {
      throw new Error("Tidak ada informasi banner");
    }
    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: bannersData,
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

module.exports = banners;
