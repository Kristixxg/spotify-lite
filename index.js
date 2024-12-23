import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { userRouter } from "./routers/UserRouer.js";
import { songRouter } from "./routers/SongRouter.js";
import { artistRouter } from "./routers/ArtistRouter.js";

export const db = mongoose.connection;
const port = process.env.PORT || 3000;
const app = express();

const { MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/user", userRouter);
app.use("/songs", songRouter);
app.use("/artists", artistRouter);

db.once("open", () => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
