import "express";

declare global {
  namespace Express {
    interface Request {
      userData?: {
        userId: string;
        fullName: string;
        email: string;
      };
    }
  }
}
