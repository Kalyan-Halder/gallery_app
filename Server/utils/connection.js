const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config({path:"./config.env"})
const URL = process.env.DB;
 

const serverCreate = async () => {
  try {
    await mongoose.connect(URL);
    console.log("MongoDB Connected with Mongoose!");
  } catch (error) {
    console.log("Server Unable to connect:", error.message);
  }
};

serverCreate();
