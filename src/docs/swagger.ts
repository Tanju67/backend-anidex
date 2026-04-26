import type { Options } from "swagger-jsdoc";
import authPaths from "./path/authPath.js";
import animePaths from "./path/animePath.js";

export const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Anidex Backend API",
      version: "1.0.0",
      description: "Anime Watchlist App API Documentation",
    },
    servers: [
      {
        url: `http://localhost:5000`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      ...authPaths,
      ...animePaths,
    },
  },
  apis: [],
};
