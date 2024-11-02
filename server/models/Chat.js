import mongoose from "mongoose";
const id = mongoose.Schema.Types.ObjectId;

const chatSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      enum: ["general", "art", "technology", "Line", "private"],
      default: "general",
    },
    users: [
      {
        userId: {
          type: id,
          required: true,
          ref: "User",
        },
      },
    ],
    messages: [
      {
        senderId: {
          type: id,
          ref: "User",
        },
        messageType: {
          type: String,
          enum: ["text", "file", "image"],
          default: "text",
        },
        message: String,
        file: {
          type: String,
          default: null,
        },
        image: {
          type: String,
          default: null,
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true, versionKey: "__v" }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
