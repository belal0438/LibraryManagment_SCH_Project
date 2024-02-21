const mongoose = require("mongoose");
const DB_NAME = "schProject";

connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME,
    });

    console.log(
      `\n MongoDB connected !! DB Host: ${connectionInstance.connection.host} `
    );
  } catch (error) {
    console.log("MONGODB CONNECTION FAILD>>>", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
