import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { io } from "socket.io-client";
import logo from "../../assets/logo.webp";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCog,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import col from "../../assets/collaboration.png";
import chat from "../../assets/chat.png";
import video from "../../assets/videocall.png";

const socket = io("http://localhost:5000");

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const { user } = state || {};
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const generateRoomCode = () => {
    const randomString = Math.random().toString(36).substring(2, 15).toUpperCase();
    const formattedCode = randomString.match(/.{1,4}/g).join('-');
    setRoomCode(formattedCode);
  };



  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (user.fullname && roomCode) {
      socket.emit("joinRoom", { roomID: roomCode, name: user.fullname });
      navigate(`/whiteboard/${roomCode}?name=${user.fullname}`);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (user.fullname && joinRoomCode) {
      socket.emit("joinRoom", { roomID: joinRoomCode, name: user.fullname });
      navigate(`/whiteboard/${joinRoomCode}?name=${user.fullname}`);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = currentTime.toLocaleDateString();

  const slides = [
    {
      title: "Welcome to the Whiteboard",
      description:
        "Join the whiteboard to collaborate, sketch, and communicate with your team in real-time.",
      image: col,
    },
    {
      title: "Start Drawing",
      description: "Draw and annotate on the whiteboard for brainstorming or teaching.",
      image: chat,
    },
    {
      title: "Real-Time Chat",
      description: "Keep the conversation going with our integrated chat feature.",
      image: video,
    },
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n.charAt(0).toUpperCase())
          .join("")
      : "U";

  const initials = user ? getInitials(user.fullname) : "U";

  const avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff`;

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <header className="sticky top-0 z-50 px-16 py-3 flex items-center justify-between bg-white shadow-md">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10 rounded-full" alt="Logo" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Collab<span className="text-gray-500">Pad</span>
          </h1>
        </div>

        <div className="hidden sm:flex items-center space-x-3">
          <div className="text-right flex items-center p-2 space-x-2">
            <p className="text-xl text-gray-500">{formattedTime}</p>
            <p className="text-lg text-gray-500">{formattedDate}</p>
          </div>
          <button title="Settings">
            <FaCog className="text-lg sm:text-xl" />
          </button>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="bg-blue-700 h-8 w-8 sm:h-10 sm:w-10 rounded-full"
            >
              <img src={avatarUrl} className="rounded-full" alt="Avatar" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 text-center bg-white shadow-2xl rounded-2xl p-6 w-60 sm:w-[400px]">
                <p className="text-gray-500 text-xl mb-3">{user?.email}</p>
                <p className="font-semibold text-gray-800 text-3xl mb-4">Hi, {user?.fullname}!</p>
                <div className="flex justify-center mb-4">
                  <img src={avatarUrl} className="rounded-full w-[150px]" alt="Profile Avatar" />
                </div>
                <div>
                  <button
                    onClick={handleLogout}
                    className="px-4 text-sm bg-blue-600 text-white py-2 rounded mr-10 hover:bg-blue-600"
                  >
                    Logout
                  </button>
                  <button className="text-sm py-2 hover:border-b-2 border-blue-700">
                    Add Another Account
                  </button>
                </div>
              </div>
            )}
          </div>
          <button onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-800" />}
          </button>
        </div>
      </header>

      <main className="flex-grow h-[50vh] md:h-[82.7vh] flex flex-col sm:flex-row items-center justify-evenly px-4 py-6 gap-8">
        <section className="border-2 border-red-500  text-center sm:text-left max-w-2xl py-10 px-10 sm:m-auto md:m-0">
          <h1 className="text-2xl sm:text-4xl font-bold">Real-time Whiteboard Collaboration</h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Collaborate in real-time on a shared whiteboard, perfect for brainstorming, sketching, or teaching.
          </p>            
            <div className="flex justify-between pt-5">
              <button
                onClick={generateRoomCode}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 py-2 text-white px-2 rounded-lg hover:opacity-90 shadow-md transition duration-300"
              >
                Generate Room Code
              </button>
              {roomCode && (
                <div className="flex items-center w-[260px]">
                <div className="h-full flex items-center text-center mt-2 bg-gray-100 py-2 px-4 rounded-lg border border-gray-300 w-full sm:w-auto">
                  <p className="text-sm text-gray-700 font-mono">{roomCode}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(roomCode)}
                    className="mt-2 h-full bg-green-500 text-white py-1 px-3 rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Copy
                  </button>
                </div>
              
              )}
            </div>


          <div className="flex space-x-4">
              <form onSubmit={handleCreateRoom} className="mt-6">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-6 rounded-lg hover:opacity-90 shadow-md transition duration-300"
                >
                  Start Whiteboard
                </button>
              </form>

              <form onSubmit={handleJoinRoom} className="mt-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 ">
                <input
                  type="text"
                  placeholder="Enter room code"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value)}
                  className="w-full sm:w-auto py-2 px-4 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-lg hover:opacity-90 shadow-md transition duration-300"
                >
                  Join Room
                </button>
              </form>
          </div>
        </section>



        <section className="max-w-md relative sm:hidden md:block">
          <img
            src={slides[currentSlide].image}
            alt="Slide"
            className="w-48 sm:w-64 mx-auto rounded-full object-cover border-2 border-gray-300"
          />
          <h2 className="text-lg sm:text-xl font-semibold mt-3">{slides[currentSlide].title}</h2>
          <p className="text-gray-600 text-sm sm:text-base">{slides[currentSlide].description}</p>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
          >
            <FaArrowRight />
          </button>
        </section>
      </main>


      <footer className="bg-gray-800 text-white py-4 text-center">
        <p className="text-sm">&copy; 2024 CollabPad. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
