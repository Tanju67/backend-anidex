import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./customError.js";

export default class UnauthenticatedError extends CustomAPIError {
  statusCode = StatusCodes.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
  }
}
