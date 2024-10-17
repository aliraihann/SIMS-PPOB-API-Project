const {
  newTransaction,
  getTransactionDetails,
  getTransactionHistory,
} = require("../models/transactionModels.js");
const { getBalance, updateBalance } = require("../models/balanceModels.js");
const { getUserbyEmail } = require("../models/userModels.js");
const { selectService } = require("../models/serviceModels.js");

const topUp = async (req, res) => {
  const { email } = req;
  const { top_up_amount } = req.body;
  try {
    // check if the balance input value is an integer and <=0
    if (!Number.isInteger(top_up_amount) || top_up_amount <= 0) {
      throw new Error(
        "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
      );
    }
    // get user to get the user id
    const user = await getUserbyEmail(email);
    const user_id = user.user_id;

    // set transaction type and description
    const transaction_type = "TOPUP";
    const description = "Top Up balance";

    // get user existing balance
    const userBalance = await getBalance(user_id);
    const currentBalance = userBalance.balance;

    // calculate new balance
    const balanceAfterTransaction = top_up_amount + currentBalance;

    // Generate a unique invoice number
    const invoiceStr = "INV2024";
    const uniqueNumber = Date.now();
    const invoice_number = invoiceStr.concat("/").concat(uniqueNumber);

    // update balance
    await updateBalance(user_id, balanceAfterTransaction);

    // add new transaction to database
    await newTransaction(
      user_id,
      invoice_number,
      transaction_type,
      description,
      top_up_amount,
      null //because top up don't have service_id
    );
    // get user new balance
    const newBalance = await getBalance(user_id);

    res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        balance: newBalance,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 102,
      message: err.message,
      data: null,
    });
  }
};

const transaction = async (req, res) => {
  const { email } = req;
  const { service_code, description } = req.body;
  try {
    // get user to get the user id
    const user = await getUserbyEmail(email);
    const user_id = user.user_id;

    // get requested service
    const service = await selectService(service_code);
    console.log("ini service yang dipilih", service);

    //check if requested service exist
    if (!service) {
      throw new Error("Service ataus Layanan tidak ditemukan");
    }

    // get requested service id and tariff
    const service_id = service.service_id;
    const tariff = service["service_tariff"];

    // get user existing balance
    const userBalance = await getBalance(user_id);
    const currentBalance = userBalance.balance;

    // check if the user balance is sufficient for the selected service
    const isServiceExpensive = currentBalance < tariff;
    if (isServiceExpensive) {
      throw new Error("Saldo tidak mencukupi");
    }

    // calculate balance
    const balanceAfterTransaction = currentBalance - tariff;

    // set transaction type, description and total amount
    const transaction_type = "PAYMENT";
    const transactionDescription = description || service.service_name; // option if request body have description
    const total_amount = tariff;

    // Generate a unique invoice number
    const invoiceStr = "INV2024";
    const uniqueNumber = Date.now();
    const invoice_number = invoiceStr.concat("/").concat(uniqueNumber);

    // update balance
    await updateBalance(user_id, balanceAfterTransaction);

    // add new transaction to database
    const newTransactionRecord = await newTransaction(
      user_id,
      invoice_number,
      transaction_type,
      transactionDescription,
      total_amount,
      service_id
    );

    // get transaction details
    const result = await getTransactionDetails(
      newTransactionRecord.transaction_id
    );

    res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: result,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 102,
      message: err.message,
      data: null,
    });
  }
};

const transactionHistory = async (req, res) => {
  try {
    const { offset, limit } = req.query;

    // group the filter
    const filter = {};

    // check if offset and limit is integer
    if (limit) {
      const parsedLimit = parseInt(limit);
      if (isNaN(parsedLimit) || parsedLimit < 0) {
        return res.status(400).json({
          status: 102,
          message: "Limit harus sebuah angka positif",
          data: null,
        });
      } else {
        filter.limit = parsedLimit
        filter.offset = 0;

      }
    }
    if (offset) {
      const parsedOffset = parseInt(offset);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return res.status(400).json({
          status: 102,
          message: "Offset harus sebuah angka positif",
          data: null,
        });
      } else {
        filter.offset = parsedOffset;
      }
    }
    const result = await getTransactionHistory(filter);
    res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset: filter.offset || 0,
        limit: filter.limit  || 0,
        records: result,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 108,
      message: "Token tidak tidak valid atau kadaluwarsa",
      data: null,
    });
  }
};
module.exports = { topUp, transaction, transactionHistory };
