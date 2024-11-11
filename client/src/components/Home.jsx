import React, { useEffect, useState } from "react";
import SideBarContainer from "./SideBarContainer";
import ItemList from "./ItemList";
import ArtIcon from "./icons/ArtIcon";
import TechIcon from "./icons/TechIcon";
import UserIcon from "./icons/UserIcon";
import GeneralIcon from "./icons/GeneralIcon";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import getProfileImage from "../utils/getProfileImage";
import ProfileImageItem from "./ProfileImageItem";
import MessageIcon from "./icons/MessageIcon";
import handleLocalStorage from "../utils/handleLocalStorage";
import MessagePanel from "./MessagePanel";
import socket from "../socket";

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
  // {
  //   name: "line",
  //   value: "line",
  //   icon: <LineIcon className="size-8" />,
  // },
];

const Home = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [messageList, setMessageList] = useState({});
  const [userList, setUserList] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("private");
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [unreadMessageIdList, setUnreadMessageIdList] = useState([]); //id of sender
  const { userId, username, profileImage } = handleLocalStorage("get", {
    userId: "userId",
    username: "username",
    profileImage: "profileImage",
    role: "role",
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
    socket.disconnect();
    localStorage.clear();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if ((selectedRoom === "private" && !selectedRecipient) || !chatMessage)
      return;

    const data = {
      senderId: userId,
      senderProfileImage: profileImage,
      senderUsername: username,
      recipientId: selectedRoom === "private" ? selectedRecipient._id : null,
      message: chatMessage,
      room: selectedRoom,
    };
    socket.emit("send-message", data);
    setChatMessage("");
  };

  const handleGetOnlineStatus = (userId) => {
    const foundUser = onlineUsers.find((user) => user._id === userId);
    return foundUser ? foundUser.onlineStatus : false;
  };

  const handleSelectChatRoom = async (room, recipientData) => {
    if (room !== "private") {
      socket.emit("join-room", room);
    }

    setUnreadMessageIdList((prev) =>
      prev.filter((id) =>
        recipientData ? id !== recipientData?._id : id !== room
      )
    );
    setSelectedRecipient(recipientData);
    setSelectedRoom(room);
  };

  useEffect(() => {
    if (userId) {
      socket.io.opts.query = { userId };
    }

    if (!socket.connected) {
      socket.connect();
    }

    const handleReceiveMessage = (data) => {
      if (data) {
        setMessageList(data);
      }
    };

    const handleReceiveOnlineUsers = (users) => {
      console.log("New online user", users);
      setOnlineUsers(users);
    };

    const handleUnreadMessage = (senderId) => {
      setUnreadMessageIdList((prev) => [...prev, senderId]);
    };

    socket.on("online-users", handleReceiveOnlineUsers);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("unread-message", handleUnreadMessage);

    return () => {
      socket.off("online-users", handleReceiveOnlineUsers);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("unread-message", handleUnreadMessage);
    };
  }, [userId, navigate]);

  useEffect(() => {
    axiosInstance
      .get("/users")
      .then((res) => {
        let users = res.data.data.filter((user) => user._id !== userId);
        users = users.map((user) => ({ ...user, hasUnreadMessage: false }));
        setUserList(users);
      })
      .catch((error) => console.error(error));
  }, [userId]);

  useEffect(() => {
    if (!selectedRoom || (selectedRoom === "private" && !selectedRecipient)) {
      setMessageList({});
      return;
    }

    const controller = new AbortController();

    axiosInstance
      .get("/chats", {
        params: {
          userId,
          recipientId:
            selectedRoom === "private" ? selectedRecipient._id : null,
          room: selectedRoom,
        },
        signal: controller.signal,
      })
      .then((res) => setMessageList(res.data.data || {}))
      .catch((error) => console.error("error", error));

    return () => {
      controller.abort();
    };
  }, [selectedRecipient, selectedRoom, userId]);

  return (
    <>
      <div className="h-screen flex flex-col ">
        <header className="bg-blue shadow-lg ">
          <nav className="mx-4 py-4 flex items-center justify-between">
            <div className="px-4 py-2 rounded-md bg-white text-blue font-bold">
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
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
                      status={handleGetOnlineStatus(userId)}
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
          <div className="bg-blue/70 max-w-60 w-full">
            <SideBarContainer>
              {chatRoomList.map((room, index) => (
                <div key={room.name}>
                  <ItemList
                    text={room.name}
                    icon={room.icon}
                    className={`${
                      selectedRoom === room.value && "bg-blue/60"
                    } hover:bg-blue/60`}
                    onClick={() => handleSelectChatRoom(room.value, null)}
                    unread={unreadMessageIdList.includes(room.value)}
                  />
                  {index === 0 && (
                    <p className="font-bold text-xl mt-2">Chat rooms</p>
                  )}
                </div>
              ))}
            </SideBarContainer>
          </div>

          {selectedRoom === "private" && (
            <div className="bg-light-blue max-w-60 w-full">
              <SideBarContainer title="">
                {userList.map((user) => (
                  <ItemList
                    key={user._id}
                    text={user.username}
                    className={`${
                      selectedRecipient?._id === user._id && "bg-blue/30"
                    } hover:bg-blue/30`}
                    icon={
                      getProfileImage(user.profileImage) ? (
                        <ProfileImageItem
                          image={getProfileImage(user.profileImage)}
                          alt={`${user.username} profile image`}
                          className={`size-12 bg-red-200`}
                          status={handleGetOnlineStatus(user._id)}
                        />
                      ) : (
                        <UserIcon className="size-8" />
                      )
                    }
                    onClick={() => handleSelectChatRoom("private", user)}
                    unread={unreadMessageIdList.includes(user._id)}
                  />
                ))}
              </SideBarContainer>
            </div>
          )}

          <div className="bg-cream flex-grow">
            <MessagePanel
              messageList={messageList}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
