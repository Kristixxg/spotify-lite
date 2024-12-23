import Router from "express";
import {
  getAllsongsInDB,
  getUserandAddLikedSong,
} from "../controllers/SongController.js";

export const songRouter = Router();

songRouter.get("/", getAllsongsInDB);
songRouter.post("/:id", getUserandAddLikedSong);
