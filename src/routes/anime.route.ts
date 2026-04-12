import express from "express";

import {
  createAnime,
  getAnime,
  deleteAnime,
  getSingleAnime,
} from "../controllers/anime.controller.js";
import { checkAuth } from "../middleware/auth.js";
import validate from "../middleware/validateResource.js";
import { addAnimeSchema, animeIdParamSchema } from "../schemas/anime.schema.js";

const router = express.Router();

router.use(checkAuth);

router.post("/", validate(addAnimeSchema), createAnime);
router.get("/:id", validate(animeIdParamSchema), getSingleAnime);
router.get("/", getAnime);
router.delete("/:id", validate(animeIdParamSchema), deleteAnime);

export default router;
