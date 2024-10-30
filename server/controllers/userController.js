import User from "../models/User.js";

const getUsers = async (req, res, next) => {
  try {
    const userData = req.user;
    const users = await User.find({ _id: { $ne: userData.userId } });
    const usersObj = users.map((item) => item.toJSON());
    return res.status(200).json({ data: usersObj });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const userController = { getUsers };
export default userController;
