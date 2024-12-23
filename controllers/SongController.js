import { Song } from "../models/Song.js";

export const getAllsongsInDB = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: `Cannot get songs, error: ${error}` });
  }
};
