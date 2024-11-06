import { io } from "socket.io-client";

const url =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:8001";
const socket = io(url, {
  autoConnect: false,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
});

export default socket;
