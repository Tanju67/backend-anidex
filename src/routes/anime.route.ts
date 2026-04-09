import express from "express";

import {
  createAnime,
  getAnime,
  deleteAnime,
} from "../controllers/anime.controller.js";
import { checkAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(checkAuth);

router.post("/", createAnime);
router.get("/", getAnime);
router.delete("/:id", deleteAnime);

export default router;
