import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
function connDB() {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("connected to db server...");
  } catch (error) {
    console.log("error in connecting to db server", error);
  }
}
export default connDB;
