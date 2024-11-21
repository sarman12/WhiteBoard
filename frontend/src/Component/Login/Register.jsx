import React, { useState } from 'react';
import '../../index.css';
import RegisterLogo from '../../assets/register.jpg'; 
import { useNavigate } from 'react-router';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; 

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 2000); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-pink-900 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${RegisterLogo})` }}></div>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="absolute inset-0 flex justify-center items-center text-white text-4xl font-bold z-0">
        <p>Welcome to our Registration Page</p>
      </div>
      <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg w-96 z-10 backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-100 text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-gray-900 opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your Name"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-100 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-gray-900 opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-100 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-gray-900 opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-teal-500 text-black py-3 rounded font-semibold hover:bg-teal-600 transition duration-300 ${loading && 'cursor-wait'}`}
          >
            {loading ? 'Please Wait...' : 'Register'}
          </button>
        </form>
        <div className="flex justify-evenly mt-4">
          <button className="flex items-center w-20 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300">
            <FaFacebook className="m-auto" /> 
          </button>
          <button className="flex items-center w-20 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300">
            <FaGoogle className="m-auto" />
          </button>
        </div>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-teal-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
