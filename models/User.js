import mongoose from "mongoose";
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    likedSongs: [
      {
        type: refType,
        ref: "Song",
      },
    ],
  },
  { collection: "users" }
);

export const User = mongoose.model("User", UserSchema);
