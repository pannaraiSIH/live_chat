import React, { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../config/axiosConfig";
import bear from "../assets/images/bear.png";
import dinosaur from "../assets/images/dinosaur.png";
import dragonfly from "../assets/images/dragonfly.png";
import ladybug from "../assets/images/ladybug.png";
import { useNavigate } from "react-router-dom";

const imageList = [
  { name: "dinosaur", image: dinosaur },
  { name: "bear", image: bear },
  { name: "dragonfly", image: dragonfly },
  { name: "ladybug", image: ladybug },
];

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    profileImage: "",
  });
  const navigate = useNavigate();

  const handleChangeIsLogin = () => {
    setIsLogin((prev) => !prev);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    if (name === "profileImage" && formData.profileImage === value) {
      setFormData((prev) => ({ ...prev, profileImage: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      isLogin
        ? await axiosInstance.post("/login", formData)
        : await axiosInstance.post("/register", formData);
      Swal.fire({
        title: "Success",
        text: "Login successfully!!",
        icon: "success",
        // showConfirmButton: false,
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `Failed to ${isLogin ? "login" : "register"}, please try again`,
        icon: "error",
      });
    }
  };

  return (
    <main className="bg-blue h-screen flex justify-center items-center">
      <div className="bg-light-blue p-8 rounded-md max-w-[30rem] w-full">
        <div className="space-y-4 mb-6">
          <h1 className="text-center font-bold text-2xl">
            {isLogin ? "Login" : "Sign up"}
          </h1>
          <form
            action=""
            className="space-y-4 flex flex-col"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username..."
                className="p-2 rounded-md"
                required
                onChange={handleChangeInput}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password..."
                className="p-2 rounded-md"
                required
                onChange={handleChangeInput}
              />
            </div>
            {!isLogin && (
              <div>
                <p className="mb-2">Profile image:</p>
                <div className="flex gap-4">
                  {imageList.map((item) => (
                    <div key={item.name}>
                      <label htmlFor={item.name} className="cursor-pointer ">
                        <div
                          className={`size-20 border rounded-full ${
                            formData.profileImage === item.name
                              ? "bg-orange-200"
                              : "bg-red-200"
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="hover:scale-105"
                          />
                        </div>
                      </label>
                      <input
                        type="radio"
                        id={item.name}
                        name="profileImage"
                        value={item.name}
                        className="hidden"
                        onClick={handleChangeInput}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mx-auto">
              <button
                type="submit"
                className="text-center bg-blue px-4 py-2 rounded-md text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-sm">
          {isLogin ? (
            <>
              <p>Don't have an account yet?</p>
              <button
                type="button"
                onClick={handleChangeIsLogin}
                className="underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <p>Already have an account?</p>
              <button
                type="button"
                onClick={handleChangeIsLogin}
                className="underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;
