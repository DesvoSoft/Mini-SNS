const mongoose = require("mongoose");

const dbURI = "mongodb://localhost:27017/mydb";

async function resetDB() {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");

    // Drop the entire database
    await mongoose.connection.db.dropDatabase();
    console.log("Database dropped successfully.");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

resetDB();
