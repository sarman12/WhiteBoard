import React from 'react';
import '../../index.css';
import bg from '../../assets/collaboration.jpg'; // Your background image
import mobile from '../../assets/modile_version.jpg'; // Optional: For mobile version

function Hero() {
  return (
    <div
      className="relative bg-cover bg-center h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6 space-y-6 md:space-y-8">
        <h1 className="text-4xl font-extrabold md:text-6xl mb-4">
          Welcome to <span className="text-teal-400">CollabPad</span>
        </h1>

        <p className="text-lg md:text-2xl mb-6 font-light italic">
          "Collaborate Creatively, Anywhere."
        </p>

        <p className="text-sm md:text-lg mb-8 font-light px-4 md:px-10">
          CollabPad is the ultimate platform for seamless collaboration, where innovation meets creativity in the digital workspace.
        </p>

        <div className="flex justify-center gap-6 md:gap-8 mb-6">
          <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-10 rounded-xl font-semibold text-lg hover:opacity-90 transition duration-300">
            Get Started
          </button>
          <button className="bg-transparent border-2 border-white text-white py-3 px-10 rounded-xl font-semibold text-lg hover:bg-white hover:text-black transition duration-300">
            Learn More
          </button>
        </div>

       
      </div>
    </div>
  );
}

export default Hero;
