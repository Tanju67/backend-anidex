import { z } from "zod";

export const addAnimeSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    image: z.string().url("Invalid image URL"),
    animeId: z.string().min(1, "Anime ID is required"),
  }),
});

// ID ile silme veya güncelleme işlemleri için parametre şeması
export const animeIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
