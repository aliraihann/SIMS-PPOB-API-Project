const { pool } = require("../config/dBconnection.js");

// create a new transaction
async function newTransaction(
  user_id,
  invoice_number,
  transaction_type,
  description,
  total_amount,
  service_id
) {
  try {
    const result = await pool.query(
      `
        INSERT INTO transaction(user_id, invoice_number, transaction_type, description, total_amount, service_id)
        VALUES ($1,$2,$3,$4,$5,$6)     
        RETURNING * 
        `,
      [
        user_id,
        invoice_number,
        transaction_type,
        description,
        total_amount,
        service_id,
      ]
    );

    // Check if the transaction was successfully inserted
    if (result.rowCount === 0) {
      throw new Error("User not found or transaction not updated.");
    }
    console.log("transaction successful for user:", user_id);
    return result.rows[0];
  } catch (err) {
    console.log(`transaction failed to add new record: ${err.message}`);
  }
}

// creating select transaction detail
async function getTransactionDetails(transaction_id) {
  try {
    const result = await pool.query(
      `
        SELECT 
          t.invoice_number, 
          s.service_code, 
          s.service_name, 
          t.transaction_type, 
          t.total_amount, 
          t.created_on 
        FROM transaction t
        JOIN services s ON t.service_id = s.service_id
        WHERE t.transaction_id = $1
      `,
      [transaction_id]
    );
    console.log("get transaction detail successful");
    return result.rows[0];
  } catch (err) {
    console.log(`get transaction detail failed: ${err.message}`);
  }
}

async function getTransactionHistory(filter) {
  try {
    let queryDefault = `
    SELECT invoice_number, transaction_type, description, total_amount, created_on
    FROM transaction 
    ORDER BY created_on DESC
  `;

    // check if limit and offset is available
    if (filter.limit) {
      queryDefault += ` OFFSET $1 LIMIT $2`;
      const transactionHistory = await pool.query(queryDefault, [
        filter.offset,
        filter.limit,
      ]);
      return transactionHistory.rows;
    } else if (filter.offset) {
      queryDefault += ` OFFSET $1`;
      const transactionHistory = await pool.query(queryDefault, [
        filter.offset
      ]);
      return transactionHistory.rows;
    }
    // no filter needed
    const transactionHistory = await pool.query(queryDefault);

    return transactionHistory.rows;
  } catch (err) {
    return {
      message: "Unable to get transaction history",
      error: err.message,
    };
  }
}

module.exports = {
  newTransaction,
  getTransactionDetails,
  getTransactionHistory,
};
