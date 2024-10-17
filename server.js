const {
  createUserTable,
  createBannerTable,
  insertMultipleBanners,
  createServiceTable,
  insertMultipleServices,
  createTransactionTable,
  createBalanceTable,
  bannerValues,
  serviceValues
} = require("./src/config/dBconnection.js");
const express = require("express");
const userRoutes = require("./src/routes/userRoutes.js");
const bannerRoutes = require("./src/routes/bannerRoutes.js");
const serviceRoutes = require("./src/routes/serviceRoutes.js");
const balanceRoutes = require("./src/routes/balanceRoutes.js");
const transactionRoutes = require("./src/routes/transactionRoutes.js");


const app = express();

const port = process.env.PORT || 4000;
app.use(express.json());

async function init() {
  try {
    // initialize table and table's data
    await createUserTable();
    await createBannerTable();
    await createServiceTable();
    await createBalanceTable();
    await createTransactionTable();
    
    await insertMultipleBanners(bannerValues);
    await insertMultipleServices(serviceValues);

    //attached routes
    app.use('/', userRoutes);
    app.use('/', bannerRoutes);
    app.use('/', serviceRoutes);
    app.use('/', balanceRoutes);
    app.use('/', transactionRoutes);

    //start app after all table initializiation done
    app.listen(port, () => {
      console.log(`Server is now listening at port ${port}`);
    });
  } catch (error) {
    // error handling
    console.error("Failed to initialize application:", error);
  }
}

init();
