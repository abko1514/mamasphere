// models/user.ts

import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    age: {
      type: Number,
      required: false,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["female", "male", "non-binary", "prefer-not-to-say"],
      required: false,
    },
    occupation: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
      required: false,
    },
    resetToken: {
      type: String,
      required: false,
    },
    resetTokenExpiry: {
      type: Date,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: false,
    },
    verificationTokenExpiry: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Users || mongoose.model("Users", userSchema);