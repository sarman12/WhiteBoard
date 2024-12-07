import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Logo from '../../assets/logo.webp';

function Footer() {
  return (
    <footer id="contact" className="relative py-12 text-white px-10">
      <div className="relative z-10">
        <div className="w-full px-6 py-8 rounded-lg mb-10">
          <h3 className="text-4xl text-center font-extrabold text-[#f7e7ce]  mb-4">Stay Updated!</h3>
          <p className="text-sm text-center text-gray-200 mb-4">
            Sign up for our newsletter to get the latest updates and offers.
          </p>
          <div className="flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-l-xl border-2 border-gray-500 text-black w-56 md:w-[600px] focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button className="bg-teal-500 text-black font-semibold p-3 rounded-r-xl hover:bg-teal-600 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>

        

        <div className="container mx-auto flex  justify-between items-start px-6">
          <div className="w-full md:w-1/3 text-center md:text-left mb-8 hidden md:block">
            <img
              src={Logo}
              alt="CollabPad Logo"
              className="h-[180px] w-auto mx-auto md:mx-0 rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-10">
            <div className="w-full md:w-1/3 mb-8">
              <ul className="text-sm space-y-2">
                <li><a href="#home" className="text-gray-300 text-lg hover:text-teal-400 transition">Home</a></li>
                <li><a href="#features" className="text-gray-300 text-lg hover:text-teal-400 transition">Features</a></li>
                <li><a href="#pricing" className="text-gray-300 text-lg hover:text-teal-400 transition">Pricing</a></li>
                <li><a href="#contact" className="text-gray-300 text-lg hover:text-teal-400 transition">Contact</a></li>
              </ul>
            </div>

            <div className="w-full md:w-1/3 mb-8">
              <ul className="text-sm space-y-2">
                <li><a href="#privacy-policy" className="text-gray-400 text-lg hover:text-teal-400 transition">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-400 text-lg hover:text-teal-400 transition">Terms & Conditions</a></li>
              </ul>
            </div>

            <div className="  py-10 text-center mb-10">

              <h3 className="text-2xl font-extrabold text-[#f7e7ce] mb-6">Queries!!</h3>
              <div
                onClick={() => window.location.href = 'mailto:sahaneearman601@gmail.com'}
                className="text-xl font-mono tracking-wide rounded-full text-gray-800 hover:text-teal-900  transition cursor-pointer bg-white py-4 px-6  inline-block"
              >
                sahaneearman601@gmail.com
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-center space-x-6 mt-8">
          <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300">
            <FaLinkedin size={24} />
          </a>
        </div>

        <div className="text-center text-lg py-4 mt-12">
          <p className="text-gray-400">
            &copy; 2024 <span className="text-teal-400 font-semibold">CollabPad</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
