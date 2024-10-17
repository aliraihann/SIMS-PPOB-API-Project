const { pool } = require("../config/dBconnection.js");

async function initiateNewBalance(user_id) {
  try {
    const result = await pool.query(
      `
        INSERT INTO balance (user_id)
        VALUES ($1)
        `,
      [user_id]
    );
    console.log("initiate balance for new user success");
    return true; // indicate successfully initiate balance
  } catch (err) {
    console.log(`initiate balance failed: ${err.message}`);
    return {
      message: `${err.message}`,
    };
  }
};

async function getBalance(user_id) {
  try {
    const result = await pool.query(
      `
        SELECT b.current_balance AS balance
        FROM balance b
        JOIN users u on u.user_id = b.user_id
        WHERE b.user_id = $1
        `,
      [user_id]
    );
    return result.rows[0]; // return the user's balance data
  } catch (err) {
    console.log(`get balance data failed: ${err.message}`);
    return {
      message: `${err.message}`,
    };
  }
};

async function updateBalance(user_id, balanceAfterTransaction) {
  try {
    const result = await pool.query(
      `
      UPDATE balance
      SET current_balance = $2 
      WHERE user_id = $1  
      RETURNING *    
      `,
      [user_id, balanceAfterTransaction]
    );

    // Check if any rows were updated
    if (result.rowCount === 0) {
      throw new Error("User not found or balance not updated.");
    }
    console.log("Update balance successful for user_id:", user_id);
    return result.rows[0];
  } catch (err) {
    console.log(`Update balance failed: ${err.message}`);
    return {
      message: `${err.message}`,
    };
  }
}

module.exports = { initiateNewBalance, getBalance, updateBalance };
