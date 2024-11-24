import React, { useState } from "react";
import { Tldraw } from "@tldraw/tldraw";
import "tldraw/tldraw.css";
import ChatInterface from "./ChatInterface";
import { FaCog, FaQuestion, FaShare } from "react-icons/fa";
import "../../index.css";

const Whiteboard = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [whiteboardKey, setWhiteboardKey] = useState(0);
  const [participants, setParticipants] = useState([
    { id: 1, name: "Alice", avatar: "https://via.placeholder.com/40?text=A" },
  ]);

  const handleSendMessage = () => {
    if (currentMessage.trim() === "") return;
    setMessages((prev) => [...prev, { text: currentMessage, sender: "You" }]);
    setCurrentMessage("");
  };

  const addParticipant = (newParticipant) => {
    setParticipants((prev) => [...prev, newParticipant]);
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col">
      <nav className="p-2 px-5 bg-slate-200 w-full flex justify-between items-center">
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

        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {participants.map((participant) => (
              <img
                key={participant.id}
                src={participant.avatar}
                alt={participant.name}
                className="w-10 h-10 rounded-full border border-white"
                title={participant.name}
              />
            ))}
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
        </div>
      </nav>

      <div className="flex flex-grow">
        <div className="flex-1 bg-white">
          <Tldraw key={whiteboardKey} />
        </div>

        <ChatInterface />
      </div>
    </div>
  );
};

export default Whiteboard;
