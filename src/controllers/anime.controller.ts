import type { Request, Response } from "express";
import BadRequest from "../errors/badRequest.js";
import Anime from "../models/Anime.js";
import { StatusCodes } from "http-status-codes";

export const createAnime = async (req: Request, res: Response) => {
  const { userId } = req.userData!;

  const { title, image, animeId, createdBy } = req.body;

  if (!title || !image || !animeId || !createdBy) {
    throw new BadRequest("Please provide all values");
  }

  const anime = await Anime.create({
    title,
    image,
    animeId,
    createdBy: userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ data: anime, message: "Anime created successfully" });
};

export const getAnime = async (req: Request, res: Response) => {
  const { userId } = req.userData!;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const userAnime = await Anime.find({ createdBy: userId })
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  const totalAnimes = await Anime.countDocuments({ createdBy: userId });

  const numOfPages = Math.ceil(totalAnimes / limit);

  res.status(StatusCodes.OK).json({
    data: userAnime,
    pagination: {
      totalAnimes,
      numOfPages,
      currentPage: page,
      has_next_page: page < numOfPages,
    },
  });
};

export const deleteAnime = async (req: Request, res: Response) => {};
