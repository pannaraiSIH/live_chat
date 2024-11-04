import React, { useEffect } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SocketService from "./services/SocketService";
import isAuthenticated from "./utils/isAuthenticated";

function App() {
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    const socketService = new SocketService(userId);
    socketService.onConnection();
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
