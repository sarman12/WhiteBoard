import React, { useState } from 'react';
import '../../index.css';
import { useNavigate } from 'react-router';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import axios from 'axios';

function Register() {
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/register', {
        fullname,
        email,
        password,
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-pink-900 flex items-center justify-center fixed left-0 right-0">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
      ></div>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="z-10 backdrop-blur-lg bg-black/60 p-8 rounded-xl shadow-2xl w-[90%] max-w-md text-white">
        <h2 className="text-4xl font-bold text-center mb-6">Register</h2>
        <p className="text-center text-gray-300 mb-6">
          Join us today! Create your account in a few simple steps.
        </p>

        {error && <p className="text-sm text-red-600 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-sm text-green-600 text-center mb-4">
            Registration successful! Redirecting to login...
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-200 text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-sm text-gray-200 placeholder-gray-400 focus:outline-none"
              placeholder="Enter your name"
              required
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-200 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-sm text-gray-200 placeholder-gray-400 focus:outline-none"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-200 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-sm text-gray-200 placeholder-gray-400 focus:outline-none"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-xl font-semibold bg-teal-500 text-black hover:bg-teal-600 transition duration-300 ${
              loading && 'cursor-wait'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="relative my-4 text-center">
          <span className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-[1px] bg-gray-600"></span>
          <span className="bg-black px-3 text-sm text-gray-400 relative">
            Or Register With
          </span>
        </div>

        <div className="flex justify-center gap-4">
          <button className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300">
            <FaFacebook size={20} />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-300">
            <FaGoogle size={20} />
          </button>
        </div>

        <p className="text-center text-gray-400 mt-3">
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
