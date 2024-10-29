import { Server } from "socket.io";

const socket = (server) => {
  const io = new Server(server, { cors: "*" });

  io.on("connection", (socket) => {
    console.log("connect to", socket.id);

    socket.on("send-message", (message) => {
      console.log("message", message);
      io.emit("receive-message", message);
    });
  });
};

export default socket;
