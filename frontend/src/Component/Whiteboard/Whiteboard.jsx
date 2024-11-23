import React, { useRef, useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  FaPencilAlt, FaEraser, FaHighlighter, FaFont, FaSearch, FaSearchMinus, FaTrashAlt,
} from 'react-icons/fa';

function Whiteboard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [brushSize, setBrushSize] = useState(2);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [color, setColor] = useState('#000000');
  const [image, setImage] = useState(null);
  const [zoomEnabled, setZoomEnabled] = useState(false);

  useEffect(() => {
    drawGrid(); // Add a grid overlay when the component mounts
  }, []);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = 20; // Size of each grid square
    ctx.strokeStyle = '#e0e0e0'; // Light gray for the grid lines
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const startDrawing = (e) => {
    if (zoomEnabled) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || zoomEnabled) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawGrid(); // Redraw the grid after clearing
  };

  const toggleZoom = () => {
    setZoomEnabled(!zoomEnabled);
  };

  return (
    <div className="font-sans h-screen flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <h2 className="text-lg font-bold">Web Whiteboard</h2>
        <div className="flex space-x-4 items-center">
          <span>24h left to save your board</span>
          <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">Sign up for Free</button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-16 bg-gray-100 border-r border-gray-300 flex flex-col items-center space-y-4 py-4">
          <button onClick={() => setTool('pencil')} className={`p-2 rounded ${tool === 'pencil' ? 'bg-blue-500 text-white' : 'bg-white'} hover:bg-blue-500 hover:text-white`}>
            <FaPencilAlt size={24} />
          </button>
          <button onClick={() => setTool('eraser')} className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-white'} hover:bg-blue-500 hover:text-white`}>
            <FaEraser size={24} />
          </button>
          <button onClick={() => setTool('highlighter')} className={`p-2 rounded ${tool === 'highlighter' ? 'bg-blue-500 text-white' : 'bg-white'} hover:bg-blue-500 hover:text-white`}>
            <FaHighlighter size={24} />
          </button>
          <button onClick={() => setTool('text')} className={`p-2 rounded ${tool === 'text' ? 'bg-blue-500 text-white' : 'bg-white'} hover:bg-blue-500 hover:text-white`}>
            <FaFont size={24} />
          </button>
          <button onClick={toggleZoom} className="p-2 rounded bg-gray-500 text-white hover:bg-gray-400">
            {zoomEnabled ? <FaSearchMinus size={24} /> : <FaSearch size={24} />}
          </button>
          <button onClick={clearCanvas} className="p-2 rounded bg-red-500 text-white hover:bg-red-400">
            <FaTrashAlt size={24} />
          </button>
        </div>

        {/* Main Canvas Area */}
        <TransformWrapper disabled={!zoomEnabled}>
          <TransformComponent>
            <div className="flex-1 bg-white relative">
              <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                className="w-full h-full border border-gray-300"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}

export default Whiteboard;
