import { User } from "../models/User.js";

export const getUserInfoAndUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
    }

    user.username = username;
    user.email = email;
    user.password = password;
    await user.save();
    res.status(200).json({ itemUpdated: user });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserLikedSongs = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getUserFollowedArtists = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// export const postCreateUser = async (req, res) => {
//   try {
//     // handle duplicate username
//     const existingUser = await User.findOne({ username: req.body.username });

//     if (existingUser) {
//       return res.status(409).json({ message: "Username already exists" });
//     }

//     const user = await User.create(req.body);

//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };
