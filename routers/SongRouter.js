import Router from "express";
import { getAllsongsInDB } from "../controllers/SongController.js";

export const songRouter = Router();

songRouter.get("/", getAllsongsInDB);
