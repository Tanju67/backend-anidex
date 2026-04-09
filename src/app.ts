import "dotenv/config";
import "express-async-errors";

import cors from "cors";
import express from "express";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFound from "./middleware/not-found.js";
import connectDB from "./utils/connectDB.js";

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(notFound);
app.use(errorHandlerMiddleware);

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
