const authPaths = {
  "/api/v1/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "test@mail.com" },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User logged in successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User logged in successfully",
                  },
                  token: { type: "string", example: "eyJhbGciOiJIUzI1..." },
                  data: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "69dc106d87f..." },
                      fullName: { type: "string", example: "Test User" },
                      email: { type: "string", example: "test@mail.com" },
                      authMethod: { type: "string", example: "local" },
                      createdAt: { type: "string" },
                      updatedAt: { type: "string" },
                      __v: { type: "integer", example: 0 },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: "Bad Request - Missing email or password" },
        401: { description: "Unauthorized - Invalid credentials" },
        500: { description: "Internal Server Error" },
      },
    },
  },
  "/api/v1/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register user",
      requestBody: {
        required: true,
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
      responses: {
        201: {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User created successfully",
                  },
                  token: { type: "string", example: "eyJhbGciOiJIUzI1..." },
                  data: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "69edd83f03274..." },
                      fullName: { type: "string", example: "John Doe" },
                      email: { type: "string", example: "john@example.com" },
                      authMethod: { type: "string", example: "local" },
                      createdAt: { type: "string" },
                      updatedAt: { type: "string" },
                      __v: { type: "integer", example: 0 },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request - Validation failed or user already exists",
        },
        500: { description: "Internal Server Error" },
      },
    },
  },
  "/api/v1/auth/current": {
    get: {
      tags: ["Auth"],
      summary: "Get current logged-in user",
      description:
        "Retrieves the profile information of the currently authenticated user using the JWT token.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "User profile retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "69edd83f03274..." },
                      fullName: { type: "string", example: "John Doe" },
                      email: { type: "string", example: "john@example.com" },
                      authMethod: { type: "string", example: "local" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                      __v: { type: "integer", example: 0 },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description:
            "Unauthorized - Token is either missing, expired, or invalid",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/api/v1/auth/google": {
    post: {
      tags: ["Auth"],
      summary: "Google Login/Register",
      description:
        "Authenticates a user via Google OAuth ID Token. If the user doesn't exist, a new account is created.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["idToken"],
              properties: {
                idToken: {
                  type: "string",
                  description: "The ID Token received from Google Frontend SDK",
                  example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYy...",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successfully authenticated with Google",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Successfully logged in with Google",
                  },
                  token: { type: "string", example: "eyJhbGciOiJIUzI1..." },
                  data: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "69edd83f03274..." },
                      fullName: { type: "string", example: "John Doe" },
                      email: { type: "string", example: "john@example.com" },
                      authMethod: { type: "string", example: "google" }, // Burada 'google' yazdığından emin olmalısın
                      createdAt: { type: "string" },
                      updatedAt: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: "Bad Request - Invalid or expired Google Token" },
        500: {
          description: "Internal Server Error during Google Authentication",
        },
      },
    },
  },
};

export default authPaths;
