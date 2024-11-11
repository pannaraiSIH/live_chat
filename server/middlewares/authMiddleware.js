import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { CustomAPIError } from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";

export default async function authMiddleware(req, res, next) {
  const token = req.signedCookies.accessTokenCookie;
  if (!token) {
    throw new CustomAPIError("Unauthenticated", StatusCodes.UNAUTHORIZED);
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new CustomAPIError("Unauthenticated", StatusCodes.UNAUTHORIZED);
  }
  req.user = payload;
  next();
}
