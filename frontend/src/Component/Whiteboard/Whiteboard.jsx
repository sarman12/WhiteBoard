import React, { useRef, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FaCog, FaQuestion, FaShare, FaCircle, FaTrash, FaPen, FaBrush, FaHighlighter, FaEraser, FaUndo, FaRedo, FaSave } from 'react-icons/fa';
import { MdRectangle } from 'react-icons/md';

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
  const [hostID, setHostID] = useState(null);
  const [showProfile, setShowProfile] = useState(null);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  useEffect(() => {
    if (roomID && name) {
      socket.emit('joinRoom', { roomID, name });
    }

    socket.on('updateUsers', ({ users, host }) => {
      setUsersInRoom(users);
      setHostID(host);
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

    socket.on('drawing', ({ x, y, color, size }) => {
      const context = contextRef.current;
      if (context) {
        context.strokeStyle = color;
        context.lineWidth = size;
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
      }
    });

    socket.on('clear', () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    });

    return () => {
      socket.off('drawing');
      socket.off('clear');
    };
  }, []);

  useEffect(() => {
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

    const canvas = canvasRef.current;
    setDrawingHistory((prev) => [...prev, canvas.toDataURL()]);
    setRedoHistory([]);
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

  const undoLast = () => {
    if (drawingHistory.length === 0) return;
    const previousState = drawingHistory.pop();
    setRedoHistory((prev) => [...prev, previousState]);

    const img = new Image();
    img.src = drawingHistory[drawingHistory.length - 1] || '';
    img.onload = () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      contextRef.current.drawImage(img, 0, 0);
    };
  };

  const redoLast = () => {
    if (redoHistory.length === 0) return;
    const nextState = redoHistory.pop();
    setDrawingHistory((prev) => [...prev, nextState]);

    const img = new Image();
    img.src = nextState;
    img.onload = () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      contextRef.current.drawImage(img, 0, 0);
    };
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const getInitials = (name) =>
    name
      ? name
          .split(' ')
          .map((n) => n.charAt(0).toUpperCase())
          .join('')
      : 'U';

  const handleShowProfile = (user) => {
    setShowProfile(user === showProfile ? null : user);
  };

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

      <div className="flex h-[91vh] flex-row-reverse p-3">
        <div className="bg-white p-4">
          <h2 className="text-lg font-bold mb-4">Users in Room:</h2>
          <ul className="flex flex-wrap gap-4">
            {usersInRoom.map((user) => (
              <li key={user.id} className="relative group">
                <img
                  src={`https://ui-avatars.com/api/?name=${getInitials(user)}&background=random&color=fff`}
                  alt="Avatar"
                  className="rounded-full w-12 h-12 cursor-pointer hover:shadow-lg"
                  onClick={() => handleShowProfile(user)}
                />
                {hostID === user && (
                  <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Leader
                  </span>
                )}
                {showProfile === user && (
                  <div className="absolute top-16 right-0 w-auto bg-white border rounded-lg shadow-2xl p-4">
                    <h3 className="font-bold text-lg mb-2">{user}</h3>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex py-5 px-2">
          <div className="toolbar flex flex-col space-y-3 items-center my-0">
            <button onClick={clearCanvas} className="bg-red-500 text-white py-2 px-4 rounded mx-2">
              <FaTrash />
            </button>
            <button onClick={() => setTool('brush')} className="bg-gray-500 text-white py-2 px-4 rounded mx-2">
              <FaBrush />
            </button>
            <button onClick={() => setTool('eraser')} className="bg-gray-500 text-white py-2 px-4 rounded mx-2">
              <FaEraser />
            </button>
            <button onClick={() => drawShape('rectangle')} className="bg-gray-500 text-white py-2 px-4 rounded mx-2">
              <MdRectangle/>
            </button>
            <button onClick={() => drawShape('circle')} className="bg-gray-500 text-white py-2 px-4 rounded mx-2">
              <FaCircle/>
            </button>
            <button onClick={undoLast} className="bg-gray-500 text-white py-2 px-4 rounded mx-2">
              <FaUndo />
            </button>
            <button onClick={redoLast} className="bg-gray-500 text-white py-2 px-4 rounded mx-2">
              <FaRedo />
            </button>
            <button onClick={saveCanvas} className="bg-green-500 text-white py-2 px-4 rounded mx-2">
              <FaSave />
            </button>
          </div>

          <canvas
          className='bg-white h-[80vh]'
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
          />
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;
