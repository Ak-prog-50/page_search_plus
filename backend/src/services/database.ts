import mongoose from "mongoose";
import { GET_DB_URL } from "../config";

mongoose.connection.once("open", () => {
  console.info("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

async function dbConnect() {
  await mongoose.connect(GET_DB_URL());
}

async function dbDisconnect() {
  await mongoose.disconnect();
}

export { dbConnect, dbDisconnect };
