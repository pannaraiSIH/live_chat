import mongoose from "mongoose";
const id = mongoose.Schema.Types.ObjectId;

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: id,
      required: true,
    },
    room: {
      type: String,
      enum: ["general", "art", "technology", "Line", "private"],
      default: "general",
    },
    messages: [
      {
        recipientId: {
          type: id,
          ref: "User",
        },
        recipientName: String,
        message: String,
        file: String,
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true, versionKey: "__v" }
);

export default Chat = mongoose.model("Chat", chatSchema);
