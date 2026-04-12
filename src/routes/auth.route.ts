import express from "express";
import {
  getCurrentUser,
  login,
  register,
  googleLogin,
} from "../controllers/auth.controller.js";
import { checkAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/current", checkAuth, getCurrentUser);
router.post("/google", googleLogin);

export default router;
