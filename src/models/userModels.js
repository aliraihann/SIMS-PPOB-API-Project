const { pool } = require("../config/dBconnection.js");

// register new user
async function registerUser(email, first_name, last_name, password) {
  try {
    const result = await pool.query(
      `
        INSERT INTO users (email, first_name, last_name, password)
        VALUES ($1,$2,$3,$4)
        RETURNING user_id
        `,
      [email, first_name, last_name, password]
    );
    console.log("new user has successfully created");
    return result.rows[0].user_id; // Return the newly created user's ID.
  } catch (err) {
    console.log(`user creation failed: ${err.message}`);
    return {
      message: `${err.message}`,
    };
  }
};

// get user's all data by email
async function getUserbyEmail(email) {
  try {
    const result = await pool.query(
      `
        SELECT * FROM users
        WHERE email = $1
        `,
      [email]
    );
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null; // indicate user do not exist
    }
  } catch (err) {
    console.log(`get user failed: ${err.message}`);
    return {
      message: `${err.message}`,
    };
  }
};

// get user's profile data
async function getUserProfilebyEmail(email) {
  try {
    const result = await pool.query(
      `
        SELECT email, first_name, last_name, profile_image FROM users
        WHERE email = $1
        `,
      [email]
    );
    return result.rows[0]; // return the user profile data
  } catch (err) {
    console.log(`get user failed: ${err.message}`);
    return {
      message: `${err.message}`,
    };
  }
};

// update user's profile data
async function updateUserProfile(changes) {
  try{
    const { email, ...fields } = changes;
    // seperate field's keys and values
    const dataKeys = Object.keys(fields);
    const dataValues = Object.values(fields);
    // set the SET query regarding the object
    const setClause = dataKeys.map((key, index) => `${key} = $${index + 1}`).join(', '); 
    // set the query code to be compiled with setClause
    const queryCode = `
      UPDATE users
      SET ${setClause}
      WHERE email = $${dataKeys.length + 1}`;
    
    // Execute the query with values and the email as the last parameter
    const result = await pool.query(queryCode, [...dataValues, email]);
    console.log(`Profile updated for email: ${email}`);
    return result;
  } catch (error) {
      return({
          "message":`${error.message}`
      });
  }
}
module.exports = { registerUser, getUserbyEmail, getUserProfilebyEmail, updateUserProfile };
