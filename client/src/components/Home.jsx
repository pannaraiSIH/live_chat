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
import getProfileImage from "../utils/getProfileImage";
import ProfileImageItem from "./ProfileImageItem";
import LineIcon from "./icons/LineIcon";
import MessageIcon from "./icons/MessageIcon";

const socket = io("http://localhost:8001");

const chatRoomList = [
  {
    name: "Direct message",
    value: "private",
    icon: <MessageIcon className="size-8" />,
  },
  {
    name: "General",
    value: "general",
    icon: <GeneralIcon className="size-8" />,
  },
  {
    name: "Art",
    value: "art",
    icon: <ArtIcon className="size-8" />,
  },
  {
    name: "Technology",
    value: "technology",
    icon: <TechIcon className="size-8" />,
  },
  {
    name: "line",
    value: "line",
    icon: <LineIcon className="size-8" />,
  },
];

const Home = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("private");
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const username = localStorage.getItem("username");
  const profileImage = localStorage.getItem("profileImage");

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
        const users = res.data.data;
        setUserList(users);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col ">
        <header className="bg-blue shadow-lg ">
          <nav className="mx-4 py-4 flex items-center justify-between">
            <div className="px-4 py-2 rounded-md bg-light-blue">
              <Link to="/login">Logout</Link>
            </div>

            <div className="flex items-center justify-end gap-2">
              <p>{username}</p>
              <div>
                {profileImage ? (
                  <div className="size-14">
                    <ProfileImageItem
                      image={getProfileImage(profileImage)}
                      alt={`${username} profile image`}
                      className="bg-green-200"
                    />
                  </div>
                ) : (
                  <UserIcon className="size-12" />
                )}
              </div>
            </div>
          </nav>
        </header>

        <main className="flex h-full">
          <div className="bg-blue max-w-60 w-full">
            <SideBarContainer title="">
              {chatRoomList.map((room, index) => (
                <>
                  <ItemList
                    text={room.name}
                    icon={room.icon}
                    className={`${
                      selectedRoom === room.value && "bg-md-light-blue/50"
                    } hover:bg-md-light-blue/50`}
                    onClick={() => setSelectedRoom(room.value)}
                  />
                  {index === 0 && (
                    <p className="font-bold text-xl mt-2">Chat rooms</p>
                  )}
                </>
              ))}
            </SideBarContainer>
          </div>

          {selectedRoom === "private" && (
            <div className="bg-md-light-blue max-w-60 w-full">
              <SideBarContainer title="">
                {userList.map((user) => (
                  <ItemList
                    key={user._id}
                    text={user.username}
                    className="hover:bg-light-blue/30"
                    icon={
                      getProfileImage(user.profileImage) ? (
                        <ProfileImageItem
                          image={getProfileImage(user.profileImage)}
                          alt={`${user.username} profile image`}
                          className={`size-12 bg-red-200`}
                        />
                      ) : (
                        <UserIcon className="size-8" />
                      )
                    }
                  />
                ))}
              </SideBarContainer>
            </div>
          )}

          <div className="bg-light-blue flex-grow">
            <div className="mx-4 py-4 flex flex-col h-full gap-4">
              <div className=" h-[76vh] overflow-y-auto">
                <ul className="flex flex-col gap-4">
                  {messageList.map((item, index) => (
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
