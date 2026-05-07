import "dotenv/config";

import type { Request, Response } from "express";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import BadRequest from "../errors/badRequest.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

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

  let email: string;
  let name: string;
  let googleId: string;

  try {
    if (googleToken && googleToken.startsWith("ya29.")) {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`,
      );

      const userData = response.data;
      email = userData.email;
      name = userData.name || "Google User";
      googleId = userData.sub;
    } else {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID!,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new Error("Invalid Google idToken");
      }
      email = payload.email;
      name = payload.name || "Google User";
      googleId = payload.sub;
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName: name,
        email: email,
        googleId: googleId,
        authMethod: "google",
      });
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
      user: { fullName: user.fullName, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Google Auth Error Detail:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};
