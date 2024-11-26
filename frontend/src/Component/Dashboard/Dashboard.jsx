import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";


import {
  FaArrowLeft,
  FaArrowRight,
  FaCog,
  FaUserCircle,
  FaKeyboard,
  FaVideo,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import col from "../../assets/collaboration.png";
import chat from "../../assets/chat.png";
import logo from "../../assets/logo.webp";
import video from "../../assets/videocall.png";
import { useNavigate } from "react-router";

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    setUserData(user);
  } else {
    console.warn("No user data found in localStorage");
    navigate("/login");
  }
}, []);


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
      description: "Join the whiteboard to collaborate, sketch, and communicate with your team in real-time.",
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/login");
  };

  const getInitials = (name) => {
    const newName = name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase();
    return newName;
  };

  const initials = userData && userData.fullname ? getInitials(userData.fullname) : "";

  const avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff`;


  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <header
        className={`sticky top-0 z-50 border-b-2 ${
          darkMode ? "border-gray-700" : ""
        } px-16 py-3 flex items-center justify-between bg-white shadow-md`}
      >
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10 rounded-full" alt="Logo" />
          <h1
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Collab<span className={darkMode ? "text-gray-300" : "text-gray-500"}>Pad</span>
          </h1>
        </div>

        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-3">
          <div className="text-right flex items-center p-2 space-x-2">
            <p className="text-xl text-gray-500">{formattedTime}</p>
            <p className="text-lg  text-gray-500">{formattedDate}</p>
          </div>
          <button title="Settings">
            <FaCog className="text-lg sm:text-xl" />
          </button>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className=" bg-blue-700
              h-8 w-8 sm:h-10 sm:w-10 rounded-full "
            >
              <img src={avatarUrl} className="rounded-full"  alt="" />
              
            </button>
            {profileOpen && userData && (
            <div className="absolute right-0 mt-2 text-center bg-white shadow-2xl rounded-2xl p-6 w-60 sm:w-[400px]">
              <p className="text-gray-500 text-xl mb-3">{userData.email}</p>

              <p className="font-semibold text-gray-800 text-3xl mb-4">Hi, {userData.fullname}!</p>

              <div className="flex justify-center mb-4">
                
                  <img src={avatarUrl} className="rounded-full w-[150px]"  alt="" />

              </div>

              <button
                onClick={() => alert("Change profile photo clicked")}
                className="w-full text-blue-500 text-sm mb-3 hover:underline"
              >
                Change Photo
              </button>

              <div className="">
                <button
                    onClick={handleLogout}
                    className="px-4 text-sm bg-blue-600 text-white py-2 rounded mr-10 hover:bg-blue-600 "
                  >
                    Logout
                  </button>
                  <button 
                      className=" text-sm  py-2  hover:border-b-2 border-blue-700 "
                      >

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

      {menuOpen && (
        <nav className="sm:hidden bg-gray-200 p-4">
          <ul className="space-y-3">
            <li className="text-gray-700">Home</li>
            <li className="text-gray-700">Features</li>
            <li className="text-gray-700">Contact</li>
          </ul>
        </nav>
      )}

      <main className="flex-grow flex flex-col sm:flex-row items-center justify-evenly px-4 py-6 gap-8">
        <section className="text-center sm:text-left max-w-lg sm:m-auto md:m-0">
          <h1 className="text-2xl sm:text-3xl font-bold">Real-time Whiteboard Collaboration</h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Collaborate in real-time on a shared whiteboard, perfect for brainstorming, sketching, or teaching.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="flex items-center justify-center w-[300px] m-auto text-sm md:m-0 bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600" onClick={()=>{navigate('/whiteboard')}}>
              <FaVideo className="mr-2" />
              Start Whiteboard
            </button>
            <div className="flex items-center border rounded-md  w-[300px] m-auto md:m-0">
              <FaKeyboard className="ml-3 mr-3 text-lg sm:text-xl" />
              <input
                type="text"
                placeholder="Enter code or link"
                className="flex-grow px-2 py-2 sm:py-3 focus:outline-none "
              />
              <button className="bg-gray-300 px-4 py-3 hover:bg-gray-400">Join</button>
            </div>
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
