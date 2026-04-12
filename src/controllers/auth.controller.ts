import "dotenv/config";

import type { Request, Response } from "express";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import BadRequest from "../errors/badRequest.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import { OAuth2Client } from "google-auth-library";

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.authMethod === "google") {
      throw new BadRequest(
        "This account was created with Google. Please log in with Google.",
      );
    }
    throw new BadRequest("Email already exists");
  }

  const user = await User.create({ fullName, email, password });

  const userObject = user.toObject();
  const { password: pass, ...info } = userObject;

  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    data: info,
    token,
    message: "User created successfully",
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  if (user.authMethod === "google") {
    throw new BadRequest(
      "Bu hesap Google ile oluşturulmuş. Lütfen Google ile giriş yapın.",
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const userObject = user.toObject();
  const { password: pass, ...info } = userObject;

  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ data: info, token, message: "User logged in successfully" });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.userData!.userId).select("-password");

  if (!user) {
    throw new UnauthenticatedError("User not found");
  }
  const userObject = user.toObject();

  res.status(StatusCodes.OK).json({ data: userObject });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// /api/v1/auth/google
export const googleLogin = async (req: Request, res: Response) => {
  const { idToken: googleToken } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: googleToken!,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new BadRequest("Invalid Google token");
  }

  if (!payload.email) {
    throw new BadRequest("Google account must have an email associated.");
  }

  const email: string = payload.email;
  const name = payload.name || "Google User";
  const googleId = payload.sub;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      fullName: name,
      email: email,
      googleId: googleId,
      authMethod: "google",
    });
  } else if (user.authMethod !== "google") {
    throw new BadRequest(
      "This email is already registered with a password. Please login normally.",
    );
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: { fullName: user.fullName, email: user.email },
    token,
  });
};
