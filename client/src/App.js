import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SocketService from "./services/SocketService";

function App() {
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const socketService = new SocketService(userId);
    socketService.onConnection();

    return () => {};
  }, [userId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
