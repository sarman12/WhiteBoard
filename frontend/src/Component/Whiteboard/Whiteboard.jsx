import React, { useRef, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FaCog, FaQuestion, FaShare } from 'react-icons/fa';

const socket = io('http://localhost:5000');

function Whiteboard() {
  const { roomID } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [usersInRoom, setUsersInRoom] = useState([]);

  useEffect(() => {
    if (roomID && name) {
      console.log(`Joining room: ${roomID} as ${name}`);
      socket.emit('joinRoom', { roomID, name });
    }

    socket.on('updateUsers', (users) => {
      console.log('Updated users in room:', users);
      setUsersInRoom(users);
    });

    return () => {
      socket.off('updateUsers');
    };
  }, [roomID, name]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    canvas.style.border = '1px solid black';

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;
  };
  useEffect(() => {
    initializeCanvas();
    if (contextRef.current) {
      contextRef.current.strokeStyle = brushColor;
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushColor, brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    socket.emit('drawing', {
      roomID,
      data: { x: offsetX, y: offsetY, color: brushColor, size: brushSize },
    });
  };

  const clearCanvas = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit('clear', roomID);
  };
  useEffect(() => {
    socket.on('drawing', ({ x, y, color, size }) => {
      const context = contextRef.current;
      context.strokeStyle = color;
      context.lineWidth = size;
      context.lineTo(x, y);
      context.stroke();
    });

    socket.on('clear', () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    });

    return () => {
      socket.off('drawing');
      socket.off('clear');
    };
  }, []);

  return (
    <div className="bg-white flex flex-col items-center">
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
            Session Code: {roomID}
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

      <div className="bg-white">
        <h2 className="text-lg font-bold my-4">Users in Room:</h2>
        <ul className="flex">
          {usersInRoom.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white flex items-center my-4">
        <button onClick={clearCanvas} className="bg-red-500 text-white py-2 px-4 rounded">
          Clear Canvas
        </button>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="ml-4"
        />
        <input
          type="number"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          min="1"
          max="50"
          className="ml-4 p-2"
        />
      </div>

      <canvas
      className='bg-white'
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
    </div>
  );
}

export default Whiteboard;
 