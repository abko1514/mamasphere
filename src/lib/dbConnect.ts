import mongoose from "mongoose";

let isConnected = false;

export const dbConnect = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("Connected to database");
  } catch (e) {
    console.error("Error connecting to database", e);
    throw e;
  }
};
