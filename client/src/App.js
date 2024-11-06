import React, { useEffect, useState } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import isAuthenticated from "./utils/isAuthenticated";
import socket from "./socket";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    window.addEventListener("storage", () => {
      const id = localStorage.getItem("userId");
      setUserId(id);
    });
  }, []);

  useEffect(() => {
    if (userId) {
      socket.io.opts.query = { userId };
      socket.connect();
      socket.on("connect", () => {
        console.log("Socket is connected!!");
      });
    }
  }, [userId]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          index
          element={<Home />}
          loader={async () => await isAuthenticated()}
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
