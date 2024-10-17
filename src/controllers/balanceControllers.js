const { getBalance } = require("../models/balanceModels.js");
const { getUserbyEmail } = require("../models/userModels.js");

const balance = async (req, res) => {
  const { email } = req;
  try {
    // get user to get the user id
    const user = await getUserbyEmail(email);
    // get user's balance data
    const userBalance = await getBalance(user.user_id);
    res.status(200).json({
        status: 0,
        message: "Get Balance Berhasil",
        data: userBalance,
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

module.exports = balance;
