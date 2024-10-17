const {pool} = require("../config/dBconnection.js")

async function getAllServices() {
  try {
    const result = await pool.query(`
            SELECT service_code, service_name, service_icon, service_tariff
            FROM services
        `);
    return result.rows; // return the services data;
  } catch (err) {
    console.log(`get all services data failed: ${err.message}`);
    return {
      message: `${err.message}`,
    };
  }
}

async function selectService(service_code) {
  try {
    const result = await pool.query(
      `
            SELECT service_id, service_code, service_name, service_icon, service_tariff
            FROM services
            WHERE service_code = $1
        `,
      [service_code]
    );
    return result.rows[0]; // return the services data;
  } catch (err) {
    console.log(`get services data failed: ${err.message}`);
    return {
      message: `${err.message}`,
    };
  }
}

module.exports = { getAllServices, selectService };
