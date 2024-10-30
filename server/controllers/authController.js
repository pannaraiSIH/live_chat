import User from "../models/User.js";

const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = await user.generateAccessToken();
    res.cookie("accessTokenCookie", token, {
      maxAge: process.env.COOKIE_MAXAGE,
      httpOnly: true,
      signed: true,
    });
    return res.status(201).json({ message: "Success", accessToken: token });
  } catch (error) {
    console.log("error:", error);
    // next();
    return res.status(400).json({ message: "Error" });
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Username or password is invalid");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new Error("Username or password is invalid");
    }

    const token = await user.generateAccessToken();
    res.cookie("accessTokenCookie", token, {
      maxAge: process.env.COOKIE_MAXAGE,
      httpOnly: true,
      signed: true,
    });
    return res.status(200).json({ message: "Success", accessToken: token });
  } catch (error) {
    console.log("error:", error);
    return res.status(401).json({ message: "Error" });
    // next();
  }
};

const authController = { register, login };
export default authController;
