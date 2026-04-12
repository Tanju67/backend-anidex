import express from "express";
import {
  getCurrentUser,
  login,
  register,
  googleLogin,
} from "../controllers/auth.controller.js";
import { checkAuth } from "../middleware/auth.js";
import validate from "../middleware/validateResource.js";
import {
  googleLoginSchema,
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.get("/current", checkAuth, getCurrentUser);
router.post("/google", validate(googleLoginSchema), googleLogin);

export default router;
