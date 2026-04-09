import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./customError.js";

export default class BadRequest extends CustomAPIError {
  statusCode: number = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }
}
