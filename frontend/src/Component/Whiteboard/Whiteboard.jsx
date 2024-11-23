import React, { useState } from "react";
import { Tldraw } from "@tldraw/tldraw";
import 'tldraw/tldraw.css'

import {
  FaCog,
  FaQuestion,
  FaShare,
} from "react-icons/fa";
import "../../index.css";

const Whiteboard = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [whiteboardKey, setWhiteboardKey] = useState(0); 

  const handleSendMessage = () => {
    if (currentMessage.trim() === "") return;
    setMessages((prev) => [...prev, { text: currentMessage, sender: "You" }]);
    setCurrentMessage("");
  };


  return (
    <div className="w-[100vw] h-[100vh] flex flex-col">
      <nav className="p-2 px-5 bg-slate-200 w-full flex justify-between">
        <div>
          <img
            src="https://via.placeholder.com/50"
            alt="Logo"
            className="w-12 h-12 rounded-full border border-white"
          />
        </div>
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold">CollabPad</h1>
        </div>
        <ul className="flex space-x-6 items-center">
          <li className="cursor-pointer hover:text-gray-400 transition">
            <FaCog className="text-2xl" title="Settings" />
          </li>
          <li className="cursor-pointer hover:text-gray-400 transition">
            <FaQuestion className="text-2xl" title="Help" />
          </li>
          <li className="cursor-pointer hover:text-gray-400 transition">
            <FaShare className="text-2xl" title="Share" />
          </li>
        </ul>
      </nav>

      <div className="flex flex-grow">
        <div className="flex-1 bg-white">
          <Tldraw key={whiteboardKey} />
        </div>

        <div className="w-1/3 p-4 border-l border-gray-300 space-y-4">
          <div className="h-[70vh] overflow-auto border p-4">
            {messages.map((message, index) => (
              <div key={index} className="my-2">
                <strong>{message.sender}</strong>: {message.text}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              className="border p-2 flex-grow"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button
              className="p-2 bg-blue-500 text-white ml-2"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
