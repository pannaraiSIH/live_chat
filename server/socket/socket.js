import { Server } from "socket.io";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

export default function socket(server) {
  const io = new Server(server, { cors: "*" });

  let onlineUsers = [];

  io.on("connection", async (socket) => {
    console.log("connect to", socket.id);
    const userId = socket.handshake.query.userId;

    // check if user already online
    const isUserOnline = onlineUsers.some(
      (user) => user?._id?.toString() === userId
    );

    if (!isUserOnline) {
      // update user's online status
      try {
        const updateUser = await User.findByIdAndUpdate(
          userId,
          { onlineStatus: true },
          { new: true }
        );
        onlineUsers.push({
          ...updateUser._doc,
          socketId: socket.id,
          isMessageUnread: false,
        });
      } catch (error) {
        console.error(error);
      }
    }

    io.emit("online-users", onlineUsers);

    socket.on("send-message", async (data) => {
      const { senderId, recipientId, room, message } = data;
      const query =
        room === "private"
          ? {
              room,
              users: {
                $all: [{ userId: senderId }, { userId: recipientId }],
              },
            }
          : { room: room };
      const chat = await Chat.findOne(query);
      let newMessage = null;

      if (chat) {
        // update
        newMessage = await Chat.findOneAndUpdate(
          {
            users: { $all: [{ userId: senderId, userId: recipientId }] },
          },
          { $push: { messages: { senderId, message } } },
          { new: true }
        );
        console.log("updateChat", newMessage);
      } else {
        // create
        newMessage = await Chat.create({
          room,
          users: [{ userId: senderId }, { userId: recipientId }],
          messages: [{ senderId, message }],
        });
        console.log("newChat", newMessage);
      }

      const foundRecipient = onlineUsers.find(
        (user) => user._id.toString() === recipientId
      );
      if (foundRecipient) {
        io.to(foundRecipient.socketId).emit("receive-message", newMessage);
      } else {
        // do something
      }
    });

    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(userId, { onlineStatus: false });
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("online-users", onlineUsers);
    });
  });
}
