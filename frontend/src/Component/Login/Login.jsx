import React from 'react';
import '../../index.css';
import LoginLogo from '../../assets/login.jpg'; // Import the logo image
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // For Google and Facebook icons
import { useNavigate } from 'react-router';

function Login() {
  const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative">
      
      <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${LoginLogo})` }}></div>
      
      <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg w-96 z-10 backdrop-blur-lg ">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-100 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-gray-900 opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-100 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-gray-900 opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-black py-3 rounded font-semibold hover:bg-teal-600 transition duration-300"
          onClick={()=>navigate('/dashboard')}>
            Login
          </button>
        </form>

        <div className="flex justify-evenly mt-4">
          <button className="flex items-center w-20  py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300">
            <FaFacebook className="m-auto" />
          </button>
          <button className="flex items-center w-20  py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300">
            <FaGoogle className="m-auto" />
          </button>
        </div>

        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-teal-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
