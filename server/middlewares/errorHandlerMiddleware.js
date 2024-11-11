import { StatusCodes } from "http-status-codes";

export default function errorHandlerMiddleware(error, req, res, next) {
  console.log("error is here:", error);

  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || "Something went wrong, please try again.",
  };

  if (error.code && error.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `${
      Object.keys(error.errorResponse.keyValue)[0]
    } already taken`;
  }

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
}
