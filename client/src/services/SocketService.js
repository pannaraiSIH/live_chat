import { io } from "socket.io-client";

export default class SocketService {
  static socketInstance = null;
  socket;

  constructor(userId) {
    if (!SocketService.socketInstance) {
      this.socket = io("http://localhost:8001", { query: { userId } });
      SocketService.socketInstance = this;
    }
    return SocketService.socketInstance;
  }
}
