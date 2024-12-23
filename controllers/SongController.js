import { Song } from "../models/Song.js";
import { User } from "../models/User.js";

export const getAllsongsInDB = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: `Cannot get songs, error: ${error}` });
  }
};

export const getUserandAddLikedSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const alreadyLiked = user.likedSongs.some(
      (likedSong) => likedSong._id.toString() === songId
    );
    if (alreadyLiked) {
      return res.status(400).json({ message: "Song already liked" });
    }

    user.likedSongs.push(song);
    await user.save();

    res.status(200).json({
      message: "Song added to liked songs",
      likedSongs: user.likedSongs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
