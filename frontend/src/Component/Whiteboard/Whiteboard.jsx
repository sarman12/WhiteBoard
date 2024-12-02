import React, { useRef, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FaTrash, FaBrush, FaEraser, FaDownload } from 'react-icons/fa';

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
  const [isErasing, setIsErasing] = useState(false);
  const [shape, setShape] = useState('free');
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [hostName, setHostName] = useState(null);
  const [startPos, setStartPos] = useState(null);

  useEffect(() => {
    if (roomID && name) {
      socket.emit('joinRoom', { roomID, name });
    }

    socket.on('updateUsers', ({ users, host }) => {
      setUsersInRoom(users);
      setHostName(host);
    });

    return () => {
      socket.off('updateUsers');
    };
  }, [roomID, name]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight * 0.77;
    canvas.style.backgroundColor = '#f0f0f0';
    canvas.style.borderRadius='20px'
    canvas.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';


    context.lineCap = 'round';
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;

    contextRef.current = context;
  };

  useEffect(() => {
    initializeCanvas();

    socket.on('drawing', ({ x, y, color, size, tool }) => {
      const context = contextRef.current;
      if (context) {
        if (tool === 'eraser') {
          context.globalCompositeOperation = 'destination-out';
          context.strokeStyle = 'rgba(0,0,0,1)';
        } else {
          context.globalCompositeOperation = 'source-over';
          context.strokeStyle = color;
        }
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

    socket.on('notAuthorized', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off('drawing');
      socket.off('clear');
      socket.off('notAuthorized');
    };
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = brushColor;
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushColor, brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    if (name !== hostName) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setStartPos({ x: offsetX, y: offsetY });
    setIsDrawing(true);
  };

  const stopDrawing = ({ nativeEvent }) => {
    if (!isDrawing) return;
    if (shape !== 'free') {
      const { offsetX, offsetY } = nativeEvent;
      const context = contextRef.current;
      if (shape === 'rectangle') {
        context.strokeRect(startPos.x, startPos.y, offsetX - startPos.x, offsetY - startPos.y);
      } else if (shape === 'circle') {
        const radius = Math.sqrt(Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2));
        context.beginPath();
        context.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        context.stroke();
      }
    }
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
  if (!isDrawing || shape !== 'free') return;

  const { offsetX, offsetY } = nativeEvent;
  const context = contextRef.current;

  context.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
  context.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : brushColor;
  context.lineWidth = brushSize;

  context.lineTo(offsetX, offsetY);
  context.stroke();

  socket.emit('drawing', {
    roomID,
    data: { x: offsetX, y: offsetY, color: brushColor, size: brushSize, tool: isErasing ? 'eraser' : 'brush' },
  });
};

  const clearCanvas = () => {
    if (name !== hostName) {
      alert('Only the host can clear the canvas.');
      return;
    }
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit('clear', roomID);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'collabpad.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="fixed top-0 bottom-0 w-full bg-white flex flex-col items-center">
      <nav className="p-2 px-5 bg-slate-200 w-full flex justify-between items-center">
        <h1 className="text-xl font-bold">CollabPad</h1>
        <span className="bg-blue-500 text-white px-3 py-1 rounded">
          Session Code: {roomID}
        </span>
        <div>

        </div>
      </nav>

      <div className="flex h-[95vh] flex-row-reverse p-3">
        <div className="bg-white p-4">
          <h2 className="text-lg font-bold mb-2">Users in Room:</h2>
          <ul className="flex flex-col flex-wrap gap-2">
            {usersInRoom.map((user) => (
              <li key={user}>
                <span>
                  {user} {user === hostName && <span className="ml-2 text-green-500">(Host)</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col-reverse border-2 rounded-2xl  shadow-2xl  py-5 px-2">
          <div className="shadow-xl border-2 mx-auto mb-[-10px] bg-gray-100 p-2 flex space-x-4 items-center rounded-lg">
  <button
    onClick={clearCanvas}
    disabled={name !== hostName}
    className={`p-3 rounded-full ${
      name === hostName
        ? 'bg-red-500 hover:bg-red-600 text-white transition duration-200'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }`}
    title="Clear Canvas"
  >
    <FaTrash className="text-lg" />
  </button>

  <button
    onClick={() => setIsErasing(false)}
    className={`p-3 rounded-full ${
      !isErasing
        ? 'bg-green-500 text-white hover:bg-green-600'
        : 'bg-gray-500 text-white hover:bg-gray-600'
    } transition duration-200`}
    title="Brush"
  >
    <FaBrush className="text-lg" />
  </button>

  <button
    onClick={() => setIsErasing(true)}
    className={`p-3 rounded-full ${
      isErasing
        ? 'bg-gray-700 text-white hover:bg-gray-800'
        : 'bg-gray-500 text-white hover:bg-gray-600'
    } transition duration-200`}
    title="Eraser"
  >
    <FaEraser className="text-lg" />
  </button>

  <div className="flex flex-col items-center space-y-1">
    <label className="text-sm text-gray-600">Color</label>
    <input
      type="color"
      value={brushColor}
      onChange={(e) => setBrushColor(e.target.value)}
      className="p-1 w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
    />
  </div>

  <div className="flex flex-col items-center space-y-1">
    <label className="text-sm text-gray-600">Brush</label>
    <input
      type="range"
      min="1"
      max="50"
      value={brushSize}
      onChange={(e) => setBrushSize(Number(e.target.value))}
      className="w-24 cursor-pointer"
    />
  </div>

  <button
    onClick={downloadCanvas}
    className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition duration-200"
    title="Download Canvas"
  >
    <FaDownload className="text-lg" />
  </button>
</div>


          
          <main className="p-2">
            <canvas
              className=""
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;
