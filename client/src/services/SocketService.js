import { io } from "socket.io-client";

export default class SocketService {
  socket;
  messageData = null;
  static socketInstance = null;

  constructor(userId) {
    if (!SocketService.socketInstance) {
      this.socket = io("http://localhost:8001", { query: { userId } });
      SocketService.socketInstance = this;
    }
    return SocketService.socketInstance;
  }

  onConnection() {
    this.socket.on("connect", () => {
      console.log("Connected socket!");
    });
  }

  onCheckOnlineUsers() {
    return this.socket.emit("check-online-users");
  }

  onReceiveOnlineUsers(cb) {
    return this.socket.on("receive-online-users", cb);
  }

  onSendMessage(data) {
    this.messageData = data;
    this.socket.emit("send-message", data);
  }

  onReceiveMessage(cb) {
    return this.socket.on("receive-message", cb);
  }

  disconnect() {
    this.socket.disconnect();
  }

  off(eventName, cb) {
    this.socket.off(eventName, cb);
  }
}
