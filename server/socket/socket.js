import { Server } from "socket.io";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

export default function socket(server) {
  const io = new Server(server, { cors: "*" });

  let onlineUsers = [];

  io.on("connection", async (socket) => {
    try {
      const userId = socket.handshake.query.userId;

      // check if user already online
      const isUserOnline = onlineUsers?.some(
        (user) => user?._id?.toString() === userId
      );

      console.log(
        "User connected to server:",
        userId,
        ", Online status:",
        isUserOnline
      );

      if (!isUserOnline) {
        // update user's online status
        const updateUser = await User.findOneAndUpdate(
          { _id: userId },
          { onlineStatus: true },
          { new: true }
        );
        onlineUsers.push({
          ...updateUser._doc,
          socketId: socket.id,
        });
      }

      socket.emit("receive-online-users", onlineUsers);

      socket.on("send-message", async (data) => {
        const {
          senderId,
          senderProfileImage,
          senderUsername,
          recipientId,
          room,
          message,
        } = data;
        const query =
          room === "private"
            ? {
                room,
                users: {
                  $all: [userId, recipientId],
                },
              }
            : { room };
        const chat = await Chat.findOne(query);
        let newMessage = null;

        if (chat) {
          // update existing chat
          const query =
            room === "private"
              ? { users: { $all: [senderId, recipientId] } }
              : { room };

          const updateData =
            room === "private"
              ? {
                  $push: {
                    messages: {
                      senderId,
                      senderUsername,
                      senderProfileImage,
                      message,
                    },
                  },
                }
              : {
                  $push: {
                    messages: {
                      senderId,
                      senderUsername,
                      senderProfileImage,
                      message,
                    },
                  },
                  $addToSet: { users: senderId },
                };

          newMessage = await Chat.findOneAndUpdate(query, updateData, {
            new: true,
          });
        } else {
          // create a new chat
          const createData = {
            room,
            users: room === "private" ? [senderId, recipientId] : [senderId],
            messages: [
              { senderId, senderUsername, senderProfileImage, message },
            ],
          };

          newMessage = await Chat.create(createData);
        }

        const foundRecipient = onlineUsers.find(
          (user) => user?._id?.toString() === recipientId
        );
        const foundSender = onlineUsers.find(
          (user) => user?._id?.toString() === senderId
        );
        if (foundRecipient) {
          io.to(foundRecipient.socketId).emit("receive-message", newMessage);
        }
        io.to(foundSender.socketId).emit("receive-message", newMessage);
      });

      socket.on("disconnect", async () => {
        await User.findByIdAndUpdate(userId, { onlineStatus: false });
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("online-users", onlineUsers);
      });
    } catch (error) {
      console.error("error", error);
    }
  });
}
