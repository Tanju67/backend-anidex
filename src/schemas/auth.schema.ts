import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(4, "Name must be at least 4 characters long")
      .max(50, "Full name must be less than 50 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const googleLoginSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, "Google ID Token is required"),
  }),
});
