import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SideBarContainer from "./SideBarContainer";
import ItemList from "./ItemList";
import ArtIcon from "./icons/ArtIcon";
import TechIcon from "./icons/TechIcon";
import UserIcon from "./icons/UserIcon";
import GeneralIcon from "./icons/GeneralIcon";
import { Link } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";

const socket = io("http://localhost:8001");

const Home = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [userList, setUserList] = useState([]);
  const [roomList, setRoomList] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    socket.emit("send-message", chatMessage);

    socket.on("receive-message", (message) => {
      console.log("message from the server:", message);
    });
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connect to the server!!");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/users");
        console.log("res", res);
      } catch (error) {}
    };
    fetch();
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col ">
        <header className="bg-blue shadow-lg ">
          <nav className="mx-4 py-4 flex items-center justify-between">
            <div>
              {true ? <Link to="/login">Login</Link> : <button>Logout</button>}
            </div>

            <div className="flex items-center justify-end gap-2">
              <p>Username</p>
              <button type="button">
                <UserIcon className="size-12" />
              </button>
            </div>
          </nav>
        </header>

        <main className="grid h-full grid-cols-6 ">
          <div className="bg-blue">
            <SideBarContainer title="Chat rooms">
              <ItemList
                text="General"
                icon={<GeneralIcon className="size-8" />}
              />
              <ItemList text="Art" icon={<ArtIcon className="size-8" />} />
              <ItemList
                text="Technology"
                icon={<TechIcon className="size-8" />}
              />
            </SideBarContainer>
          </div>

          <div className="bg-md-light-blue">
            <SideBarContainer title="Direct message">
              {Array.from(
                { length: 5 },
                (_, index) => `User: ${index + 1}`
              ).map((item) => (
                <ItemList
                  key={item}
                  text={item}
                  icon={<UserIcon className="size-8" />}
                />
              ))}
            </SideBarContainer>
          </div>

          <div className="bg-light-blue col-span-4">
            <div className="mx-4 py-4 flex flex-col h-full gap-4">
              <div className=" h-[76vh] overflow-y-auto">
                <ul className="flex flex-col gap-4">
                  {Array.from(
                    { length: 5 },
                    (_, index) => `message ${index + 1}`
                  ).map((item, index) => (
                    <li
                      key={item}
                      className={`bg-green-300 px-4 py-2 ${
                        (index + 1) % 2 === 0
                          ? "rounded-r-lg rounded-tl-lg"
                          : "rounded-l-lg rounded-tr-lg"
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <form className=" flex gap-2" onSubmit={handleSendMessage}>
                <label className="sr-only">Message</label>
                {/* <input
                type="text"
                id="message"
                name="message"
                placeholder="Enter message..."
                className="flex-grow rounded-lg px-4"
              /> */}
                <textarea
                  id="message"
                  name="message"
                  placeholder="Enter message..."
                  className="flex-grow rounded-lg px-4 py-2 resize-none "
                  rows={1}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue rounded-lg py-2 px-4 cursor-pointer"
                >
                  submit
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
