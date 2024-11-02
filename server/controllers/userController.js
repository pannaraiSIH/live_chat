import User from "../models/User.js";

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const usersObj = users.map((item) => item.toJSON());
    return res.status(200).json({ data: usersObj });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const userController = { getUsers };
export default userController;
