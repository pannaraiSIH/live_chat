import React from "react";
import UserIcon from "./icons/UserIcon";
import ProfileImageItem from "./ProfileImageItem";
import getProfileImage from "../utils/getProfileImage";
import formatTime from "../utils/dateTime";

const MessagePanel = ({
  messageList,
  chatMessage,
  setChatMessage,
  handleSendMessage,
}) => {
  const userId = localStorage.getItem("userId");

  const compareDates = (first, second) => {
    if (isNaN(first.getTime()) || isNaN(second.getTime())) return false;
    return (
      first.toISOString().slice(0, 10) === second.toISOString().slice(0, 10)
    );
  };

  return (
    <div className="mx-4 py-4 flex flex-col h-full gap-4">
      <div className=" h-[76vh] overflow-y-auto scrollbar px-2">
        <ul className="flex flex-col gap-4">
          {messageList?.messages?.map((message, index) => (
            <li key={index}>
              {!compareDates(
                new Date(messageList?.messages?.[index - 1]?.created_at),
                new Date(message?.created_at)
              ) && (
                <div className="mb-4 flex justify-center">
                  <p className="text-sm text-center w-fit bg-yellow rounded-full px-4">
                    {new Date(message?.created_at).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
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
                          image={getProfileImage(message?.senderProfileImage)}
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
          className="bg-blue rounded-lg py-2 px-4 cursor-pointer text-white font-bold"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MessagePanel;
