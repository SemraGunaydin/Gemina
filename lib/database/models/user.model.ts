import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    photo: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    planId: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
    creditBalance: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  { timestamps: true }
);

const User = models?.User || model("User", UserSchema);

export default User;
