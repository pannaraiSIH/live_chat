import { io } from "socket.io-client";

const url =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:8001";
const socket = io(url, {
  autoConnect: false,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  timeout: 10000,
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("disconnection", (reason) => {
  console.log("Socket disconnected:", reason);
});

export default socket;
