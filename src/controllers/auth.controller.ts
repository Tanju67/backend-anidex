import type { Request, Response } from "express";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import BadRequest from "../errors/badRequest.js";
import UnauthenticatedError from "../errors/unauthenticated.js";

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new BadRequest("Please provide all values");
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

  if (!email || !password) {
    throw new BadRequest("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
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
