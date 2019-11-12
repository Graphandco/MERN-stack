const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true
    });

    console.log("Connecté à MangoDB");
  } catch (err) {
    console.error(err.message);
    //sort du process d'échec
    process.exit(1);
  }
};

module.exports = connectDB;
