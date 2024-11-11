import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import isAuthenticated from "./utils/isAuthenticated";
import Home from "./components/Home";
import Login from "./components/Login";

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

export default router;
