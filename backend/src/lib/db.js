import mongoose from "mongoose";
import "dotenv/config";

const url = process.env.MONGO_URI;

export const connectdb = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected with database");
  } catch (error) {
    console.log(err);
    process.exit(1); // Exit app if DB connection fails
  }
};
