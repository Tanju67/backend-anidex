import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          status: "fail",
          message: "Validation Error",
          errors: e.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      next(e);
    }
  };

export default validate;
