import express from "express";
import http from "http";
import socket from "./socket/socket.js";
import connectDB from "./database/db.js";
import chatRouter from "./routers/chatRouter.js";
import userRouter from "./routers/userRouter.js";
import authRouter from "./routers/authRouter.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);
socket(server);

const port = process.env.PORT || 3000;
const socketPort = Number(process.env.PORT) + 1 || 3001;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/", (req, res) => {
  return res.send("hello world");
});

app.use("/api", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI).then(() => {
      console.info("Connected to database");
    });
    app.listen(port, () => {
      console.info(`Server is running on http://localhost:${port}`);
    });
    server.listen(socketPort, () => {
      console.info(`Socket is running on http://localhost:${socketPort}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

startServer();
