import React, { useRef, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  FaTrash,
  FaBrush,
  FaPen,
  FaStickyNote,
  FaTextHeight,
  FaEraser,
  FaDownload,
  FaUndo,
  FaRedo,
  FaTh,
  FaEllipsisV,
  FaTimes,
  FaSnapchat,
  FaSquare,
  FaCircle
} from 'react-icons/fa';
import { BsChatDots } from 'react-icons/bs';
import ChatInterface from './ChatInterface';

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
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [hostName, setHostName] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [textTool, setTextTool] = useState(false);
  const [seeMore,setSeeMore] = useState(false);
  const [chat,setChat] = useState(false);
  const [tool, setTool] = useState("brush");
  const [shapes, setShapes] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight * 0.77;
    canvas.style.backgroundColor = '#f0f0f0';
    context.lineCap = 'round';
    contextRef.current = context;

    socket.on('startDrawing', ({ x, y }) => {
      context.beginPath();
      context.moveTo(x, y);
    });

    socket.on('drawing', ({ x, y, color, size, tool }) => {
      context.globalCompositeOperation =
        tool === 'eraser' ? 'destination-out' : 'source-over';
      context.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : color;
      context.lineWidth = size;
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
    });

    socket.on('stopDrawing', () => {
      context.closePath();
    });

    socket.on('clear', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.on('chatMessage', (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    socket.on('importImage', ({ imageData }) => {
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      img.src = imageData;
    });

    return () => {
      socket.off('startDrawing');
      socket.off('drawing');
      socket.off('stopDrawing');
      socket.off('clear');
      socket.off('chatMessage');
      socket.off('importImage');
    };
  }, []);

  
  
  


  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    setUndoStack((prev) => [...prev, dataURL]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop();
      setRedoStack((prev) => [...prev, canvasRef.current.toDataURL()]);
      restoreCanvasState(lastState);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setUndoStack((prev) => [...prev, canvasRef.current.toDataURL()]);
      restoreCanvasState(nextState);
    }
  };

  const restoreCanvasState = (dataURL) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
    };
  };

  const startDrawing = ({ nativeEvent }) => {
    if (name !== hostName) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    saveCanvasState();
    socket.emit('startDrawing', { roomID, data: { x: offsetX, y: offsetY } });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    socket.emit('stopDrawing', roomID);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    context.globalCompositeOperation = isErasing
      ? 'destination-out'
      : 'source-over';
    context.globalAlpha = isHighlighting ? 0.3 : 1;
    context.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : brushColor;
    context.lineWidth = brushSize;
    context.lineTo(offsetX, offsetY);
    context.stroke();
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    socket.emit('drawing', {
      roomID,
      data: {
        x: offsetX,
        y: offsetY,
        color: brushColor,
        size: brushSize,
        tool: isErasing ? 'eraser' : isHighlighting ? 'highlighter' : 'brush',
      },
    });
    context.globalAlpha = 1;
  };

  const importImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        contextRef.current.drawImage(img, 0, 0);
        socket.emit('importImage', {
          roomID,
          imageData: canvasRef.current.toDataURL(),
        });
      };
      img.src = URL.createObjectURL(file);
    }
  };

  

  const clearCanvas = () => {
    if (name !== hostName) {
      alert('Only the host can clear the canvas.');
      return;
    }
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    socket.emit('clear', roomID);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'collabpad.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const toggleGrid = () => {
    setShowGrid((prev) => !prev);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (showGrid) {
      for (let x = 0; x < canvas.width; x += 50) {
        for (let y = 0; y < canvas.height; y += 50) {
          context.beginPath();
          context.strokeStyle = '#e0e0e0';
          context.rect(x, y, 50, 50);
          context.stroke();
        }
      }
    }
  }, [showGrid]);

  const addStickyNote = () => {
        const note = { id: Date.now(), text: 'New Note', x: 100, y: 100 };
        setStickyNotes([...stickyNotes, note]);
        socket.emit('add-note', note);
    };

    const addShape = (type) => {
        const shape = { id: Date.now(), type, x: 150, y: 150, width: 100, height: 100 };
        setShapes([...shapes, shape]);
        socket.emit('add-shape', shape);
    };

    const renderShapesAndNotes = () => {
        const context = contextRef.current;
        stickyNotes.forEach(note => {
            context.fillStyle = 'yellow';
            context.fillRect(note.x, note.y, 150, 100);
            context.fillStyle = 'black';
            context.fillText(note.text, note.x + 10, note.y + 50);
        });

        shapes.forEach(shape => {
            context.strokeStyle = 'blue';
            if (shape.type === 'rectangle') {
                context.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === 'circle') {
                context.beginPath();
                context.arc(
                    shape.x + shape.width / 2,
                    shape.y + shape.height / 2,
                    shape.width / 2,
                    0,
                    Math.PI * 2
                );
                context.stroke();
            }
        });
    };
        useEffect(() => {
        if (socket) {
            socket.on('canvas-data', data => {
                const image = new Image();
                image.src = data;
                image.onload = () => {
                    contextRef.current.drawImage(image, 0, 0);
                };
            });

            socket.on('add-note', note => {
                setStickyNotes(prevNotes => [...prevNotes, note]);
            });

            socket.on('add-shape', shape => {
                setShapes(prevShapes => [...prevShapes, shape]);
            });
        }
    }, [socket]);

  
  


  return (
    <div className="fixed top-0 bottom-0 w-full bg-white flex flex-col items-center">
      <nav className="p-2 px-5 bg-slate-200 w-full flex justify-between items-center">
        <h1 className="text-xl font-bold">CollabPad</h1>
        <span className="bg-blue-500 text- px-3 py-1 rounded flex font-extrabold text-[17px] items-center gap-4">
          Session Code -{`>`} <p className="text-white font-bold tracking-wide">{roomID}</p>
          <button
              title="see more"
              className="bg-black p-2 mx-4 text-white rounded-full"
              onClick={() => {
                setSeeMore(!seeMore);
              }}
            >
              <FaEllipsisV />
            </button>
        </span>
        <div>

        </div>
      </nav>

      <div className="flex h-[95vh] flex-row-reverse p-3">
        <div className="bg-white">
            
            {seeMore && (
              <div className="fixed p-4 w-[80vw] h-[80vh] top-[10vh] left-[10vw] z-30 bg-black/80 backdrop-blur-md rounded-2xl shadow-lg">
                
                <h2 className="text-xl font-bold text-white mb-4 text-center">Users in Room</h2>
                <ul className="flex gap-4 overflow-y-auto max-h-[70vh] px-4">
                  {usersInRoom.map((user) => (
                    <li
                      key={user}
                      className="flex items-center gap-4 bg-white/10 p-3 rounded-lg shadow-2xl"
                    >
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {user.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium text-lg">
                        {user}
                        {user === hostName && (
                          <span className="ml-2 text-green-500 text-sm">(Host)</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {!chat && (
            <button
              onClick={() => setChat(true)}
              className="fixed bottom-4 right-4 p-4 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
            >
              <BsChatDots className="text-2xl" />
            </button>
          )}

          {chat && (
          <div className="h-full flex flex-col">
              <div className="p-2 border-b bg-blue-500 text-white font-bold flex justify-between items-center">
                <h2>Chat</h2>
                <button
                  onClick={() => setChat(false)}
                  className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
                >
                  Close
                </button>
              </div>
                <ChatInterface />
          </div>
          )}

        </div>

        <div className="flex flex-col-reverse border-2 bg-blue-500  shadow-2xl  py-5 px-2">
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
                onClick={() => {
                  setIsErasing(false);
                  setIsHighlighting(!isHighlighting);
                }}
                className={`p-3 rounded-full ${
                  isHighlighting ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-500 text-white hover:bg-gray-600'
                } transition duration-200`}
                title="Highlighter"
              >
                <FaBrush className="text-lg" />
              </button>

              <button onClick={() => setTextTool(!textTool)}>
                <FaTextHeight />
              </button>
              



              <button onClick={() => setIsErasing(false)} className={`p-3 rounded-full ${ !isErasing
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                } transition duration-200`} title="Brush"> <FaPen className="text-lg" /> </button>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => importImage(e)}
                className="hidden"
                id="imageUploader"
                disabled={name !== hostName}
              />
              <label
                htmlFor="imageUploader"
                className="p-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition duration-200 cursor-pointer"
                title="Import Image"
              >
                <FaDownload className="text-lg" />
            </label>
            
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

              <button onClick={toggleGrid}><FaTh /></button>
              <button onClick={undo}><FaUndo /></button>
              <button onClick={redo}><FaRedo /></button>
              <button onClick={addStickyNote}>Sticky Note</button>
                <button onClick={() => addShape('rectangle')}>Rectangle</button>
                <button onClick={() => addShape('circle')}>Circle</button>


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
