import type { Request, Response } from "express";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import BadRequest from "../errors/badRequest.js";

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

export const login = (req: Request, res: Response) => {};
export const getCurrentUser = (req: Request, res: Response) => {};
