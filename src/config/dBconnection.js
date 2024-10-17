const { Pool } = require("pg");
const { config } = require("dotenv");
config();

const databaseName = "Sims_PPOB_Database";

// create database
async function createDatabaseIfNotExists(dBName) {
  const existingPool = new Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "postgres",
    password: process.env.DB_PASSWORD,
  });

  try {
    // check if the database already exist
    const res = await existingPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dBName]
    );
    // check the result of the database checking
    if (res.rowCount === 0) {
      // create new database
      await existingPool.query(`CREATE DATABASE "${dBName}"`);
      console.log(`Database ${dBName} created successfully`);
      return true; // indicate database created
    } else {
      //database is exist
      console.log(`Database ${dBName} already exist`);
      return false; // indicate database has already exist
    }
  } catch (error) {
    // error handling for database creation
    console.error(`Error creating database: ${error.message}`);
    return null; // indicate error
  } finally {
    // ending the existing pool to start new pool from the new database
    await existingPool.end();
  }
}

// check and create new database
(async () => {
  await createDatabaseIfNotExists(databaseName);
})();

// create new pool using the new database
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: `${databaseName}`,
  password: process.env.DB_PASSWORD,
});

// Error handling if the connection error
pool.on("error", (err) => {
  console.error("Unexpected error", err.message);
  process.exit(-1);
});

// initialize user's table in the database
async function createUserTable() {
  try {
    // create new user table
    const userTable = await pool.query(`
          CREATE TABLE IF NOT EXISTS users(
              user_id SERIAL PRIMARY KEY,
              email VARCHAR(100) NOT NULL UNIQUE,
              first_name VARCHAR(100) NOT NULL,
              last_name VARCHAR(100) DEFAULT NULL,
              password TEXT NOT NULL,
              profile_image VARCHAR(255) DEFAULT 'https://yoururlapi.com/profile.jpeg',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`);
    console.log("userTable is created");
    return true; // indicate success
  } catch (err) {
    console.log(`userTable creation failed: ${err.message}`);
    return false; // indicate failure
  }
}

// initialize banner's table in the database
async function createBannerTable() {
  try {
    const bannerTable = await pool.query(`
        CREATE TABLE IF NOT EXISTS banners(
            banner_id SERIAL PRIMARY KEY,
            banner_name VARCHAR(100) UNIQUE NOT NULL,
            banner_image VARCHAR(100) DEFAULT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )        
        `);
    console.log("bannerTable is created");
    return true; // indicate success
  } catch (err) {
    console.log(`bannerTable creation failed: ${err.message}`);
    return false; // indicate failure
  }
}

// Dummy data for banner table
const bannerValues = [
  {
    banner_name: "Banner 1",
    banner_image: "https://nutech-integrasi.app/dummy.jpg",
    description: "Lerem Ipsum Dolor sit amet",
  },
  {
    banner_name: "Banner 2",
    banner_image: "https://nutech-integrasi.app/dummy.jpg",
    description: "Lerem Ipsum Dolor sit amet",
  },
  {
    banner_name: "Banner 3",
    banner_image: "https://nutech-integrasi.app/dummy.jpg",
    description: "Lerem Ipsum Dolor sit amet",
  },
  {
    banner_name: "Banner 4",
    banner_image: "https://nutech-integrasi.app/dummy.jpg",
    description: "Lerem Ipsum Dolor sit amet",
  },
  {
    banner_name: "Banner 5",
    banner_image: "https://nutech-integrasi.app/dummy.jpg",
    description: "Lerem Ipsum Dolor sit amet",
  },
  {
    banner_name: "Banner 6",
    banner_image: "https://nutech-integrasi.app/dummy.jpg",
    description: "Lerem Ipsum Dolor sit amet",
  },
  {
    banner_name: "Banner 7",
    banner_image: "https://nutech-integrasi.app/dummy.jpg",
    description: "Lerem Ipsum Dolor sit amet",
  },
];

// insert banner dummy data
async function insertMultipleBanners(valuesArr) {
  try {
    // check if banner tables already have mulitple values
    for (let i = 0; i < valuesArr.length; i++) {
      const insert = await pool.query(
        `
          
              INSERT INTO banners (banner_name, banner_image, description)
              VALUES ($1,$2,$3)   
              ON CONFLICT (banner_name) DO NOTHING;         
              `,
        [
          valuesArr[i]["banner_name"],
          valuesArr[i]["banner_image"],
          valuesArr[i]["description"],
        ]
      );
    }
    console.log("Multiple Banners successfully added");
    return true; // indicate success
  } catch (err) {
    console.log(`Failed inserting banner data: ${err.message}`);
    return false; // indicate failure
  }
}

// initialize service's table in the database
async function createServiceTable() {
  try {
    const serviceTable = await pool.query(`
        CREATE TABLE IF NOT EXISTS services(
            service_id SERIAL PRIMARY KEY,
            service_code VARCHAR(100) UNIQUE NOT NULL,
            service_name VARCHAR(100) NOT NULL,
            service_icon VARCHAR(100) NOT NULL,
            service_tariff INTEGER NOT NULL
        )        
        `);
    console.log("serviceTable is created");
    return true; // indicate success
  } catch (err) {
    console.log(`serviceTable creation failed: ${err.message}`);
    return false; // indicate failure
  }
}

// Dummy data for service table
const serviceValues = [
  {
    service_code: "PAJAK",
    service_name: "Pajak PBB",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 40000,
  },
  {
    service_code: "PLN",
    service_name: "Listrik",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 10000,
  },
  {
    service_code: "PDAM",
    service_name: "PDAM Berlangganan",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 40000,
  },
  {
    service_code: "PULSA",
    service_name: "Pulsa",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 40000,
  },
  {
    service_code: "PGN",
    service_name: "PGN Berlangganan",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 50000,
  },
  {
    service_code: "MUSIK",
    service_name: "Musik Berlangganan",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 50000,
  },
  {
    service_code: "TV",
    service_name: "TV Berlangganan",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 50000,
  },
  {
    service_code: "PAKET_DATA",
    service_name: "Paket data",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 50000,
  },
  {
    service_code: "VOUCHER_GAME",
    service_name: "Voucher Game",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 100000,
  },
  {
    service_code: "VOUCHER_MAKANAN",
    service_name: "Voucher Makanan",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 100000,
  },
  {
    service_code: "QURBAN",
    service_name: "Qurban",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 200000,
  },
  {
    service_code: "ZAKAT",
    service_name: "Zakat",
    service_icon: "https://nutech-integrasi.app/dummy.jpg",
    service_tariff: 300000,
  },
];

// insert service dummy data
async function insertMultipleServices(valuesArr) {
  try {
    // check if services tables already have mulitple values
    for (let i = 0; i < valuesArr.length; i++) {
      const insert = await pool.query(
        `

              INSERT INTO services (service_code, service_name, service_icon, service_tariff)
              VALUES ($1,$2,$3,$4)       
              ON CONFLICT (service_code) DO NOTHING;         
              `,
        [
          valuesArr[i]["service_code"],
          valuesArr[i]["service_name"],
          valuesArr[i]["service_icon"],
          valuesArr[i]["service_tariff"],
        ]
      );
    }
    console.log("Multiple services successfully added");
    return { success: true, message: "services inserted" };
  } catch (err) {
    console.log(`failed inserting service data: ${err}`);
    return false; // indicate failure
  }
}

// initialize transaction's table in the database
async function createTransactionTable() {
  try {
    const transactionHistoryTable = await pool.query(`
        CREATE TABLE IF NOT EXISTS transaction(
            transaction_id SERIAL PRIMARY KEY,
            user_id INTEGER,
            invoice_number VARCHAR(100) NOT NULL, 
            transaction_type VARCHAR(100) NOT NULL,
            description VARCHAR(100) NOT NULL,
            total_amount INTEGER NOT NULL,
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            service_id INTEGER NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (service_id) REFERENCES services(service_id)
        )        
        `);
    console.log("transactionTable is created");
    return true; // indicate success
  } catch (err) {
    console.log(`transactionTable creation failed: ${err.message}`);
    return false; // indicate failure
  }
}

// initialize balance table in the database
async function createBalanceTable() {
  try {
    const balanceTable = await pool.query(`
        CREATE TABLE IF NOT EXISTS balance(
        balance_id SERIAL PRIMARY KEY ,
        user_id INTEGER UNIQUE,
        current_balance INTEGER DEFAULT 0,
        last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        )        
        `);
    console.log("balanceTable is created");
    return true; // indicate success
  } catch (err) {
    console.log(`balanceTable creation failed: ${err.message}`);
    return false; // indicate failure
  }
}

module.exports = {
  pool,
  createUserTable,
  createBannerTable,
  insertMultipleBanners,
  createServiceTable,
  insertMultipleServices,
  createTransactionTable,
  createBalanceTable,
  bannerValues,
  serviceValues,
};
