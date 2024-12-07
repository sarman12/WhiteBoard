import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { io } from "socket.io-client";
import logo from "../../assets/logo.webp";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCog,
} from "react-icons/fa";
import col from "../../assets/collaboration.png";
import chat from "../../assets/chat.png";
import video from "../../assets/videocall.png";
import team from "../../assets/team.png";
import brainstorm from '../../assets/brainstorming.png'
import draw from "../../assets/draw.png"

const socket = io("http://localhost:5000");

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const { user } = state || {};
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
    const formattedCode = randomString.match(/.{1,4}/g).join("-");
    setRoomCode(formattedCode);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (user.fullname && roomCode) {
      socket.emit("joinRoom", { roomID: roomCode, name: user.fullname });
      navigate(`/whiteboard/${roomCode}?name=${user.fullname}&isHost=true`);
    }
  };
  

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinRoomCode.match(/^[A-Z0-9\-]+$/)) {
      alert("Invalid room code format. Please check and try again.");
      return;
    }
    if (user?.fullname && joinRoomCode) {
      socket.emit("joinRoom", { roomID: joinRoomCode, name: user.fullname });
      navigate(`/whiteboard/${joinRoomCode}?name=${user.fullname}`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 0);
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
    description: "Join the whiteboard to collaborate, sketch, and communicate with your team in real-time.",
    image: col,
  },
  {
    title: "Start Drawing",
    description: "Draw and annotate on the whiteboard for brainstorming or teaching.",
    image: draw,
  },
  {
    title: "Real-Time Chat",
    description: "Keep the conversation going with our integrated chat feature.",
    image: chat,
  },
  {
    title: "Brainstorm Together",
    description: "Use the whiteboard for group brainstorming sessions to create and innovate.",
    image: brainstorm,
  },
  {
    title: "Teamwork Made Easy",
    description: "Collaborate with your team efficiently with all the tools in one place.",
    image: team,
  },
  {
    title: "Share Videos",
    description: "Enhance communication by sharing videos for better collaboration and understanding.",
    image: video,
  },
];



  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : (prev - 1) % slides.length
    );
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
    <div className="bg-gradient-to-r from-gray-900 via-teal-950 to-black  h-screen md:fixed md:left-0 md:right-0 min-h-screen flex flex-col  overflow-auto">
      <header className="sticky top-0 z-50 px-16 py-3 flex items-center justify-between shadow-2xl ">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10 rounded-full" alt="Logo" />
          <h1 className="text-xl sm:text-3xl font-bold text-red-300">
            Collab<span className="text-white">Pad</span>
          </h1>
        </div>

        <div className="hidden sm:flex items-center space-x-3">
          <div className="text-right flex items-center p-2 space-x-2">
            <p className="text-xl text-gray-300">{formattedTime}</p>
            <p className="text-sm text-gray-300">{formattedDate}</p>
          </div>
          <button title="Settings">
            <FaCog className="text-lg text-white sm:text-xl" />
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
        </div>
      </header>

      <main className="flex-grow h-[50vh] md:h-[82.7vh] flex flex-col sm:flex-row items-center justify-evenly px-4 py-6 gap-1">
        <section className="text-center sm:text-left max-w-2xl py-10 px-6 sm:px-10 sm:m-auto md:m-0">
  <h1 className="text-2xl sm:text-4xl font-bold text-gray-200">
    Real-time Whiteboard Collaboration
  </h1>
  <p className="text-white mt-3 text-sm sm:text-base">
    Collaborate in real-time on a shared whiteboard, perfect for brainstorming, sketching, or teaching.
  </p>
  
  <div className="flex flex-col sm:flex-row sm:justify-between pt-5 gap-4 sm:gap-0">
    <button
      onClick={generateRoomCode}
      className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 py-2 text-white px-2 rounded-lg hover:opacity-90 shadow-md transition duration-300"
    >
      Generate Room Code
    </button>
    {roomCode && (
      <div className="flex items-center w-full sm:w-[260px] gap-2">
        <div className="h-full flex items-center text-center mt-2 bg-gray-100 py-2 px-4 rounded-lg border border-gray-300 w-full sm:w-auto">
          <p className="text-sm text-gray-700 font-mono">{roomCode}</p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(roomCode)}
          className="mt-2 bg-green-500 text-white py-1 px-3 rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Copy
        </button>
      </div>
    )}
  </div>

  <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0 mt-6">
    <form className="w-full sm:w-auto">
      <button
        type="submit"
        className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-6 rounded-lg hover:opacity-90 shadow-md transition duration-300"
        onClick={handleCreateRoom}
      >
        Start Whiteboard
      </button>
    </form>

    <form onSubmit={handleJoinRoom} className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
      <input
        type="text"
        value={joinRoomCode}
        onChange={(e) => setJoinRoomCode(e.target.value)}
        placeholder="Enter Room Code"
        className="w-full sm:w-auto py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-lg hover:opacity-90 shadow-md transition duration-300"
      >
        Join
      </button>
    </form>
  </div>
        </section>

         <section className="max-w-md relative sm:hidden md:block">
          <div className="relative flex items-center justify-center">
            <button
                onClick={handlePrevSlide}
                className="absolute left-0 transform -translate-x-full sm:-translate-x-20 bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600"
              >
                <FaArrowLeft className="text-lg" />
            </button>

            <div className="text-center">
                <img
                  src={slides[currentSlide].image}
                  alt="Slide"
                  className="w-40 sm:w-80 mx-auto rounded-full object-cover border-2 border-gray-300"
                />
                <h2 className="text-lg text-white text-center sm:text-xl font-semibold mt-3">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-center text-white text-sm sm:text-base">
                  {slides[currentSlide].description}
                </p>
            </div>
            <button
                onClick={handleNextSlide}
                className="absolute right-0 transform translate-x-full sm:translate-x-20 bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600"
              >
                <FaArrowRight className="text-lg" />
              </button>


          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
