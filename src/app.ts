import "dotenv/config";
import "express-async-errors";

import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFound from "./middleware/not-found.js";
import connectDB from "./utils/connectDB.js";
import authRouter from "./routes/auth.route.js";
import animeRouter from "./routes/anime.route.js";
import { swaggerOptions } from "./docs/swagger.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/anime", animeRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    await connectDB(process.env.MONGO_URI);
    console.log("Connected DB!");
    app.listen(port, () => console.log("Server is listening on port: " + port));
  } catch (error) {
    console.log(error);
  }
};

start();
