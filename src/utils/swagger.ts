import type { Options } from "swagger-jsdoc";

const authPaths = {
  // Yazım hatası düzeltildi
  "/api/v1/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "user@example.com" },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      responses: { 200: { description: "Success" } },
    },
  },
  "/api/v1/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register user",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["fullName", "email", "password"],
              properties: {
                fullName: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      responses: { 201: { description: "User Created" } },
    },
  },
  "/api/v1/auth/current": {
    get: {
      tags: ["Auth"],
      summary: "Get current logged-in user",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Success" },
        401: { description: "Unauthorized - Token missing or invalid" },
      },
    },
  },
  "/api/v1/auth/google": {
    post: {
      tags: ["Auth"],
      summary: "Google Login/Register",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["idToken"], // Controller ile uyumlu hale getirildi
              properties: {
                idToken: {
                  type: "string",
                  description: "Google OAuth ID Token",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Successfully logged in with Google" },
      },
    },
  },
};

const animePaths = {
  "/api/v1/anime": {
    post: {
      tags: ["Anime"],
      summary: "Add anime to watchlist",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "image", "animeId"],
              properties: {
                title: { type: "string", example: "One Piece" },
                image: { type: "string", example: "https://image.url/op.jpg" },
                animeId: { type: "string", example: "21" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Anime successfully added" },
        400: { description: "Validation Error" },
        401: { description: "Unauthorized" },
      },
    },
    get: {
      tags: ["Anime"],
      summary: "Get all anime in user's watchlist",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 12 },
        },
      ],
      responses: {
        200: { description: "List retrieved successfully" },
      },
    },
  },
  "/api/v1/anime/{id}": {
    get: {
      tags: ["Anime"],
      summary: "Get details of a single anime",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Success" },
        404: { description: "Not Found" },
      },
    },
    delete: {
      tags: ["Anime"],
      summary: "Remove an anime from watchlist",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Successfully removed" },
        404: { description: "Not Found" },
      },
    },
  },
};

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
