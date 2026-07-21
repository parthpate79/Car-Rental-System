const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function connectDB() {
  try {
    const mongoUrl = process.env.MONGO_URL;

console.log("Mongo URL starts with:", mongoUrl?.substring(0, 20));

    if (!mongoUrl) {
      throw new Error("MONGO_URL is missing in environment variables");
    }

    await mongoose.connect(mongoUrl);

    console.log("MongoDB Connection Successful");
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error.message);

    process.exit(1);
  }
}

connectDB();

module.exports = mongoose;