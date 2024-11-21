import React, { useState } from 'react';
import '../../index.css';
import { useNavigate } from 'react-router';

function Navbar() {
    const navigate=useNavigate();

    const [Toggle, setToggle] = useState(false);

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
                    <button className="text-gray-100 text-4xl focus:outline-none" onClick={handleToggle}>
                        ☰
                    </button>
                </div>
                <button className="bg-white text-[15px] text-black px-1 rounded hover:opacity-90 md:hidden">
                    Join Now
                </button>
            </div>

            <div
                className={`absolute top-[80px] right-0 w-full max-w-[200px] bg-gray-900 rounded-s-xl md:hidden transform transition-transform duration-300 ease-in-out ${Toggle ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <ul className="flex flex-col items-center space-y-6 py-4">
                    <li className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200">
                        About
                    </li>
                    <li className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200">
                        Features
                    </li>
                    <li className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200">
                        Contact Us
                    </li>
                </ul>
            </div>

            <div className="hidden md:flex items-center space-x-20 md:space-x-9">
                <ul className="flex space-x-8">
                    <li className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200 md:text-[17px]">
                        About
                    </li>
                    <li className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200 md:text-[17px]">
                        Features
                    </li>
                    <li className="text-white font-medium text-xl hover:text-blue-400 cursor-pointer transition duration-200 md:text-[17px]">
                        Contact Us
                    </li>
                </ul>

                <div className="flex space-x-4">
                    <button className="bg-gradient-to-r from-blue-300 to-blue-600 text-white text-[18px] py-2 px-6 rounded-xl font-semibold hover:opacity-90 md:px-6 md:py-2" onClick={()=>navigate('/login')}>
                        Login
                    </button>
                    <button className="bg-white text-[18px] text-black py-2 px-6 rounded-xl font-semibold hover:opacity-90 md:px-6 md:py-2" onClick={()=>navigate('/login')}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
