import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UnauthenticatedError from "../errors/unauthenticated.js";
dotenv.config();

interface JwtPayload {
  userId: string;
  fullName: string;
  email: string;
}

export const checkAuth = async (
  req: Request & { userData?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError(
      "Please provide a valid username and password",
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthenticatedError(
      "Please provide a valid username and password",
    );
  }

  if (process.env.JWT_SECRET === undefined) {
    throw new Error("Please provide a jwt secret in the environment variables");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "fullName" in decoded
    ) {
      req.userData = {
        userId: (decoded as JwtPayload).userId,
        fullName: (decoded as JwtPayload).fullName,
        email: (decoded as JwtPayload).email,
      };
      next();
    } else {
      throw new UnauthenticatedError("Invalid token payload");
    }
  } catch (error) {
    throw new UnauthenticatedError(
      "Please provide a valid username and password",
    );
  }
};
