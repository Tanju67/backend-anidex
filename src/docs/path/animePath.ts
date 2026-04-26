const animePaths = {
  "/api/v1/anime": {
    // --- POST: Watchlist'e Ekleme ---
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
                image: { type: "string", example: "https://..." },
                animeId: { type: "string", example: "21" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Anime successfully added" },
        400: { description: "Validation Error / Already in watchlist" },
        401: { description: "Unauthorized" },
      },
    },

    // --- GET: Watchlist Listeleme ---
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
        200: {
          description: "List retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          example: "69dc10a287f911fa4447ed38",
                        },
                        title: { type: "string", example: "A Silent Voice" },
                        image: { type: "string", example: "https://..." },
                        animeId: { type: "string", example: "28851" },
                        createdBy: {
                          type: "string",
                          example: "69dc106d87f911fa4447ed34",
                        },
                        createdAt: { type: "string" },
                        updatedAt: { type: "string" },
                        __v: { type: "integer", example: 0 },
                      },
                    },
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      totalAnimes: { type: "integer", example: 3 },
                      numOfPages: { type: "integer", example: 1 },
                      currentPage: { type: "integer", example: 1 },
                      has_next_page: { type: "boolean", example: false },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/api/v1/anime/{id}": {
    // --- GET: Tek Bir Anime Detayı ---
    get: {
      tags: ["Anime"],
      summary: "Get details of a single anime",
      description:
        "Retrieves the full details of a specific anime from the user's watchlist using its database ID.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "The MongoDB _id of the watchlist item",
          schema: { type: "string", example: "69dc109687f911fa4447ed37" },
        },
      ],
      responses: {
        200: {
          description: "Anime details retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "69dc109687f911fa4447ed37",
                      },
                      title: {
                        type: "string",
                        example: "Wandering Witch: The Journey of Elaina",
                      },
                      image: { type: "string", example: "https://..." },
                      animeId: { type: "string", example: "40571" },
                      createdBy: {
                        type: "string",
                        example: "69dc106d87f911fa4447ed34",
                      },
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
        401: { description: "Unauthorized - Invalid or missing token" },
        404: { description: "Not Found - Anime not in user's watchlist" },
      },
    },

    // --- DELETE: Watchlist'ten Kaldırma ---
    delete: {
      tags: ["Anime"],
      summary: "Remove an anime from watchlist",
      description:
        "Permanently deletes a specific anime entry from the authenticated user's watchlist.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "The MongoDB _id of the watchlist item to be removed",
          schema: { type: "string", example: "69dc109687f911fa4447ed37" },
        },
      ],
      responses: {
        200: {
          description: "Successfully removed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Anime removed from watchlist",
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        404: {
          description: "Not Found - Item already removed or doesn't exist",
        },
      },
    },
  },
};

export default animePaths;
