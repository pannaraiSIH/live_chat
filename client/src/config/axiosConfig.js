import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.log("Network error:", error);
    }

    if (error.response && error.response.status === 401) {
      const navigate = useNavigate();
      navigate("/login");
      localStorage.clear();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
