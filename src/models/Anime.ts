import mongoose, { Document, Model, Types } from "mongoose";

export interface IAnime extends Document {
  title: string;
  image: string;
  animeId: string;
  createdBy: Types.ObjectId;
}

const animeSchema = new mongoose.Schema<IAnime>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    animeId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

animeSchema.index({ animeId: 1, createdBy: 1 }, { unique: true });

const Anime: Model<IAnime> = mongoose.model<IAnime>("Anime", animeSchema);

export default Anime;
