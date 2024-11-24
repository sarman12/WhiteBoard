import React, { useState } from 'react';
import '../../index.css';

function Navbar() {
  const [Toggle, setToggle] = useState(false);

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggle = () => {
    setToggle(!Toggle);
  };

  return (
    <div className="border-b border-gray-700 bg-gray-950 flex px-4 py-4 justify-between items-center md:px-10 fixed top-0 left-0 w-full z-20 opacity-80 backdrop-blur-sm">
      <div>
        <h1 className="text-[40px] font-extrabold text-green-200 md:text-[30px]">
          Col<span className="text-teal-400">lab</span>
          <span className="text-teal-200">Pad</span>
        </h1>
      </div>

      <div className="flex space-x-5">
        <div className="md:hidden">
          <button
            className="text-gray-100 text-4xl focus:outline-none"
            onClick={handleToggle}
          >
            ☰
          </button>
        </div>
      </div>

      <div
        className={`absolute top-[80px] right-0 w-full max-w-[200px] bg-gray-900 rounded-s-xl md:hidden transform transition-transform duration-300 ease-in-out ${
          Toggle ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex flex-col items-center space-y-6 py-4">
          <li
            className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200"
            onClick={() => handleScroll('hero')}
          >
            Home
          </li>
          <li
            className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200"
            onClick={() => handleScroll('features')}
          >
            Features
          </li>
          <li
            className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200"
            onClick={() => handleScroll('testimonials')}
          >
            Testimonials
          </li>
        </ul>
      </div>

      <div className="hidden md:flex items-center space-x-20 md:space-x-9">
        <ul className="flex space-x-8">
          <li
            className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200 md:text-[17px]"
            onClick={() => handleScroll('hero')}
          >
            Home
          </li>
          <li
            className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200 md:text-[17px]"
            onClick={() => handleScroll('feature')}
          >
            Features
          </li>
          <li
            className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200 md:text-[17px]"
            onClick={() => handleScroll('testimonials')}
          >
            Testimonials
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
