import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./customError.js";

export default class NotFoundError extends CustomAPIError {
  statusCode: number = StatusCodes.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}
