import Router from "express";
import {
  postUserSignup,
  postUserSignin,
  postUserlogout,
  getUserInfoAndUpdate,
  getUserLikedSongs,
  getUserFollowedArtists,
} from "../controllers/UserController.js";

export const userRouter = Router();

userRouter.post("/signup", postUserSignup);
userRouter.post("/signin", postUserSignin);
userRouter.post("/logout", postUserlogout);
userRouter.get("/songs/:id", getUserLikedSongs);
userRouter.put("/info/:id", getUserInfoAndUpdate);
userRouter.get("/artists/:id", getUserFollowedArtists);
