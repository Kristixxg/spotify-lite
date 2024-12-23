import { User } from "../models/User.js";

export const getUserandFollowArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { artist } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.followedArtists.includes(artist)) {
      return res.status(400).json({ message: "Artist already followed" });
    }

    user.followedArtists.push(artist);
    await user.save();

    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
