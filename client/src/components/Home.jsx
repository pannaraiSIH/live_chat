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
import LineIcon from "./icons/LineIcon";
import MessageIcon from "./icons/MessageIcon";
import SocketService from "../services/SocketService";
import formatTime from "../utils/dateTime";
import Swal from "sweetalert2";

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
  const [messageList, setMessageList] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const profileImage = localStorage.getItem("profileImage");
  const [unreadMessageList, setUnreadMessageList] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
    localStorage.clear();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    const socketService = new SocketService(userId);

    if (selectedRoom === "private" && !selectedRecipient) return;

    const data = {
      senderId: userId,
      senderProfileImage: profileImage,
      senderUsername: username,
      recipientId: selectedRoom === "private" ? selectedRecipient._id : null,
      message: chatMessage,
      room: selectedRoom,
    };
    socketService.onSendMessage(data);
    setChatMessage("");
  };

  const handleGetOnlineStatus = (userId) => {
    const foundUser = onlineUsers.find((user) => user._id === userId);
    return foundUser ? foundUser.onlineStatus : false;
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const socketService = new SocketService(userId);

    const handleReceiveMessage = (data) => {
      if (data) {
        if (
          !selectedRoom ||
          (selectedRoom === "private" &&
            data?.users?.every((id) => id !== selectedRecipient))
        ) {
          setUnreadMessageList((prev) => [...prev, data]);
        } else {
          setMessageList(data);
        }
      }
    };

    const handleReceiveOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socketService.onReceiveOnlineUsers(handleReceiveOnlineUsers);
    socketService.onReceiveMessage(handleReceiveMessage);

    return () => {
      socketService.off("receive-online-users");
      socketService.off("receive-message", handleReceiveMessage);
    };
  }, [userId, navigate, selectedRecipient, selectedRoom]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const res = await axiosInstance.get("/users");
        let users = res.data.data.filter((user) => user._id !== userId);
        users = users.map((user) => ({ ...user, hasUnreadMessage: false }));
        setUserList(users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserList();
  }, [userId]);

  useEffect(() => {
    if (!selectedRoom || (selectedRoom === "private" && !selectedRecipient)) {
      setMessageList({});
      return;
    }

    const fetchChatHistory = async () => {
      try {
        Swal.fire({
          title: "Please wait !",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
        const response = await axiosInstance.get("/chats", {
          params: {
            userId,
            recipientId:
              selectedRoom === "private" ? selectedRecipient._id : null,
            room: selectedRoom,
          },
        });
        Swal.close();
        setMessageList(response.data.data || {});
      } catch (error) {
        Swal.close();
        console.error("error", error);
      }
    };
    fetchChatHistory();

    // update unread status
    if (unreadMessageList.length > 0) {
      const usersToCheck = [userId, selectedRecipient?._id];

      const foundChat = unreadMessageList?.find(
        (message) =>
          message.room === selectedRoom &&
          usersToCheck.every((id) =>
            message?.users?.some((userId) => userId === id)
          )
      );

      console.log("foundChat", foundChat);
      if (foundChat) {
        const updateUnreadMessageList = unreadMessageList.filter(
          (unread) => unread?._id !== foundChat._id
        );
        const updateUserList = userList.map((user) => {
          if (user._id === selectedRecipient?._id) {
            return { ...user, hasUnreadMessage: false };
          }
          return user;
        });
        setUnreadMessageList(updateUnreadMessageList);
        setUserList(updateUserList);
      }
    }
    // eslint-disable-next-line
  }, [selectedRecipient, selectedRoom, userId, unreadMessageList]);

  useEffect(() => {
    if (unreadMessageList.length > 0) {
      const updateUserList = userList.map((user) => {
        const hasUnreadMessage = unreadMessageList.some(
          (unread) =>
            unread.room === "private" && unread.users.includes(user._id)
        );
        return hasUnreadMessage ? { ...user, hasUnreadMessage: true } : user;
      });

      if (JSON.stringify(updateUserList) !== JSON.stringify(userList)) {
        setUserList(updateUserList);
      }
    }
  }, [unreadMessageList, userList]);

  useEffect(() => {
    console.log("OnlineUsers updated:", onlineUsers);
  }, [onlineUsers]);

  return (
    <>
      <div className="h-screen flex flex-col ">
        <header className="bg-blue shadow-lg ">
          <nav className="mx-4 py-4 flex items-center justify-between">
            <div className="px-4 py-2 rounded-md bg-light-blue">
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
          <div className="bg-blue max-w-60 w-full">
            <SideBarContainer title="">
              {chatRoomList.map((room, index) => (
                <div key={room.name}>
                  <ItemList
                    text={room.name}
                    icon={room.icon}
                    className={`${
                      selectedRoom === room.value && "bg-md-light-blue/50"
                    } hover:bg-md-light-blue/50`}
                    onClick={() => {
                      if (room.value !== "private") {
                        setSelectedRecipient(null);
                      }
                      setSelectedRoom(room.value);
                    }}
                  />
                  {index === 0 && (
                    <p className="font-bold text-xl mt-2">Chat rooms</p>
                  )}
                </div>
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
                    className={`${
                      selectedRecipient?._id === user._id && "bg-light-blue/30"
                    } hover:bg-light-blue/30`}
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
                    onClick={() => setSelectedRecipient(user)}
                    unread={user.hasUnreadMessage}
                  />
                ))}
              </SideBarContainer>
            </div>
          )}

          <div className="bg-light-blue flex-grow">
            <div className="mx-4 py-4 flex flex-col h-full gap-4">
              <div className=" h-[76vh] overflow-y-auto">
                <ul className="flex flex-col gap-4">
                  {messageList?.messages?.map((message, index) => (
                    <li key={index}>
                      <div
                        className={`flex gap-1 items-end ${
                          message?.senderId === userId && "flex-row-reverse"
                        }`}
                      >
                        {message?.senderId !== userId && (
                          <div>
                            <p className="text-sm text-center">
                              {message?.senderUsername}
                            </p>
                            {getProfileImage(message?.senderProfileImage) ? (
                              <div className="size-12">
                                <ProfileImageItem
                                  image={getProfileImage(
                                    message?.senderProfileImage
                                  )}
                                  className="bg-red-200"
                                />
                              </div>
                            ) : (
                              <UserIcon />
                            )}
                          </div>
                        )}
                        <p
                          className={`px-4 py-2 max-w-sm flex-grow ${
                            message?.senderId === userId
                              ? "rounded-l-full rounded-tr-full bg-white "
                              : "rounded-r-full rounded-tl-full bg-green-300"
                          }`}
                        >
                          {message?.message}
                        </p>
                        <p className="text-[0.7rem] self-end">
                          {formatTime(message?.created_at)}
                        </p>
                      </div>
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
                  value={chatMessage}
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
