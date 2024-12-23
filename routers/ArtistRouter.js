import Router from "express";
import { getUserandFollowArtist } from "../controllers/ArtistController.js";

export const artistRouter = Router();

artistRouter.post("/:id", getUserandFollowArtist);
