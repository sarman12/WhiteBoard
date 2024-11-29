import React, { useRef, useState, useEffect } from "react";
import { useParams,useLocation } from "react-router-dom";
import { FaCog, FaQuestion, FaShare } from "react-icons/fa";
import ChatInterface from "./ChatInterface";
import "../../index.css";
import io from 'socket.io-client';

const Whiteboard = () => {
  const location = useLocation();
  const { sessionCode, leader, participant } = location.state || {}; 

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [whiteboardData, setWhiteboardData] = useState(null);
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    newSocket.emit("joinSession", { sessionCode, user: { name: participant?.name || "Anonymous", id: Date.now() } });

    newSocket.on("whiteboard-update", (data) => {
      setWhiteboardData(data);
    });

    newSocket.on("userJoined", (user) => {
      setParticipants((prev) => [...prev, user]);
    });

    newSocket.on("userLeft", (userId) => {
      setParticipants((prev) => prev.filter((user) => user.id !== userId));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [sessionCode]);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/join-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionCode }),
        });

        const data = await response.json();
        if (response.ok) {
          // setLeader(data.leader); // Set the leader's details
          // setParticipants([data.leader]); // Initialize participants with the leader
        } else {
          console.error("Error fetching session:", data.message);
        }
      } catch (error) {
        console.error("Error connecting to the server:", error);
      }
    };

    fetchSessionDetails();
  }, [sessionCode]);

  const handleWhiteboardChange = (data) => {
    setWhiteboardData(data);
    if (socket) {
      socket.emit("whiteboard-update", { sessionCode, data }); 
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;
  }, [color, lineWidth]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };


  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Emit drawing changes to other users
    if (socket) {
      socket.emit("whiteboard-update", { sessionCode, data: { offsetX, offsetY, tool, color, lineWidth } });
    }
  };


  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    // Emit clear canvas action to others
    if (socket) {
      socket.emit("clear-whiteboard", { sessionCode });
    }
  };

  const handleToolChange = (tool) => {
    setTool(tool);
    if (tool === "eraser") {
      contextRef.current.strokeStyle = "#FFFFFF";
      setLineWidth(10);
    } else {
      contextRef.current.strokeStyle = color;
      setLineWidth(tool === "highlighter" ? 10 : 2);
    }
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
          <span className="bg-blue-500 text-white px-3 py-1 rounded">
            Session Code: {sessionCode}
          </span>
        </div>

        <div className="flex items-center space-x-4">
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
        {/* Whiteboard Section */}
        <div className="flex-[3] bg-white relative flex flex-col">
          <div className="absolute top-4 left-4 z-10 flex space-x-3">
            <button
              onClick={() => handleToolChange("pencil")}
              className={`px-3 py-1 rounded ${tool === "pencil" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Pencil
            </button>
            <button
              onClick={() => handleToolChange("pen")}
              className={`px-3 py-1 rounded ${tool === "pen" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Pen
            </button>
            <button
              onClick={() => handleToolChange("highlighter")}
              className={`px-3 py-1 rounded ${tool === "highlighter" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Highlighter
            </button>
            <button
              onClick={() => handleToolChange("eraser")}
              className={`px-3 py-1 rounded ${tool === "eraser" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Eraser
            </button>
            <button onClick={clearCanvas} className="px-3 py-1 bg-red-500 text-white rounded">
              Clear
            </button>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 border-none cursor-pointer"
            />
          </div>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="flex-1"
          />
        </div>

        <ChatInterface />
      </div>
    </div>
  );
};

export default Whiteboard;
