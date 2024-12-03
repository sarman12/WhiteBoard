import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:4000");

const Chat = ({ username, room }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    socket.emit("joinRoom", { roomID: room, name: username });

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user_typing", (data) => {
      if (data.username !== username) {
        setIsTyping(data.typing);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [room, username]);

  const handleSendMessage = () => {
    if (currentMessage.trim() === "") return;

    const messageData = {
      room,
      username,
      text: currentMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setCurrentMessage("");
    setIsTyping(false);
  };

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    socket.emit("typing", { room, username, typing: e.target.value.trim() !== "" });
  };

  const handleEmojiClick = (emojiObject) => {
    setCurrentMessage((prev) => prev + emojiObject.emoji);
    setEmojiPickerVisible(false);
  };

  useEffect(() => {
    messageContainerRef.current?.scrollTo(0, messageContainerRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="p-4 border h-full bg-white text-black space-y-4">
      <div className="h-[70vh] overflow-auto border p-4 bg-gray-900/20" ref={messageContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`my-2 flex items-start ${message.username === username ? "justify-end" : ""}`}>
            <div className={`max-w-xs p-2 rounded-lg ${message.username === username ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              <strong>{message.username}</strong>
              <p>{message.text}</p>
              <span className="text-xs text-gray-500">{message.timestamp}</span>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-sm text-gray-500">Someone is typing...</div>}
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 bg-gray-200 text-gray-600 rounded" onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>
          😊
        </button>
        {emojiPickerVisible && (
          <div className="absolute top-12">
            <EmojiPicker onEmojiClick={(e, emoji) => handleEmojiClick(emoji)} />
          </div>
        )}
        <input
          type="text"
          className="border p-2 flex-grow"
          value={currentMessage}
          onChange={handleTyping}
          placeholder="Type a message"
        />
        <button className="p-2 bg-blue-500 text-white" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
