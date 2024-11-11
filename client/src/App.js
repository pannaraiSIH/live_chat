import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import socket from "./socket";
import router from "./router";

function App() {
  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket connected");
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
