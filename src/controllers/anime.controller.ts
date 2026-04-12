import type { Request, Response } from "express";
import BadRequest from "../errors/badRequest.js";
import Anime from "../models/Anime.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/notFound.js";
import mongoose, { Types } from "mongoose";

export const createAnime = async (req: Request, res: Response) => {
  const { userId } = req.userData!;

  const { title, image, animeId } = req.body;

  const isAlreadyAdded = await Anime.findOne({ animeId, createdBy: userId });

  if (isAlreadyAdded) {
    throw new BadRequest("This anime is already in your watchlist");
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

  const [userAnime, totalAnimes] = await Promise.all([
    Anime.find({ createdBy: userId })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit),
    Anime.countDocuments({ createdBy: userId }),
  ]);

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

export const getSingleAnime = async (req: Request, res: Response) => {
  const { userId } = req.userData!;
  const { id: animeId } = req.params as { id: string };

  const anime = await Anime.findOne({
    animeId: animeId,
    createdBy: new Types.ObjectId(userId),
  });

  if (!anime) {
    return res.status(StatusCodes.OK).json({ data: null });
  }

  res.status(StatusCodes.OK).json({ data: anime });
};

export const deleteAnime = async (req: Request, res: Response) => {
  const { userId } = req.userData!;
  const { id: animeId } = req.params as { id: string };

  const anime = await Anime.findOneAndDelete({
    animeId: animeId,
    createdBy: new Types.ObjectId(userId),
  });

  if (!anime) {
    throw new NotFoundError(`No anime found with id: ${animeId} in your list`);
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Anime removed from your list successfully" });
};
