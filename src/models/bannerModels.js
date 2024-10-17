const { pool } = require("../config/dBconnection.js");

async function getAllBanners() {
    try {
        const result = await pool.query(`
        SELECT banner_name, banner_image, description
        FROM banners  
    `);
    return result.rows; // return the banners data;
    } catch (err) {
        console.log(`get all banners data failed: ${err.message}`);
        return {
          message: `${err.message}`,
        };
    }
};

module.exports = getAllBanners;