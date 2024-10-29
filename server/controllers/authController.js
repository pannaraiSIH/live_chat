import User from "../models/User.js";

const register = async (req, res, next) => {
  try {
    await User.create(req.body);
    return res
      .status(201)
      .json({ message: "Success", data: "Register successfully" });
  } catch (error) {
    console.log("error:", error);
    // next();
    return res.status(400).json({ message: "Error", data: null });
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

    return res.status(200).json({ data: "Login successfully" });
  } catch (error) {
    console.log("error:", error);
    return res.status(401).json({ message: "Error", data: null });
    // next();
  }
};

const authController = { register, login };
export default authController;
