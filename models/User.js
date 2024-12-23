import mongoose from "mongoose";
const Schema = mongoose.Schema;

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
        title: { type: String, required: true },
        genre: { type: String, required: true },
        artist: { type: String, required: true },
        language: { type: String, required: true },
      },
    ],
    followedArtists: [{ type: String }],
  },
  { collection: "users" }
);

export const User = mongoose.model("User", UserSchema);
