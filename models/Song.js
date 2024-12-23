import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SongSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  { collection: "songs" }
);

export const Song = mongoose.model("Song", SongSchema);
