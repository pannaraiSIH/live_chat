import Chat from "../models/Chat.js";

const getChats = async (req, res) => {
  const { userId, recipientId, room } = req.query;
  const query =
    room === "private"
      ? {
          room,
          users: { $all: [userId, recipientId] },
        }
      : {
          room,
        };
  const chat = await Chat.findOne(query);
  return res.status(200).json({ message: "Success", data: chat });
};

const chatController = { getChats };
export default chatController;
