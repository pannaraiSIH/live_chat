import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { CustomAPIError } from "../errors/customError.js";

const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = await user.generateAccessToken();
  const userObj = user.toJSON();
  res.cookie("accessTokenCookie", token, {
    maxAge: process.env.COOKIE_MAXAGE,
    httpOnly: true,
    signed: true,
  });
  return res.status(201).json({ message: "Success", data: userObj });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    throw new CustomAPIError(
      "Username or password is invalid",
      StatusCodes.BAD_REQUEST
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomAPIError(
      "Username or password is invalid",
      StatusCodes.BAD_REQUEST
    );
  }

  const userObj = user.toJSON();
  const token = await user.generateAccessToken();
  res.cookie("accessTokenCookie", token, {
    maxAge: process.env.COOKIE_MAXAGE,
    httpOnly: true,
    signed: true,
  });
  return res.status(200).json({ message: "Success", data: userObj });
};

const authController = { register, login };
export default authController;
