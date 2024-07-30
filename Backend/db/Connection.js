const mongoose = require("mongoose");

require("dotenv").config();

const url = process.env.DATABASEURL || 3000;

mongoose
  .connect(url)
  .then(() => {
    console.log("database connected succesfuly");
  })
  .catch(() => {
    console.log("Failed to connect database");
  });
