import React, { useEffect, useState } from "react";
import "../../index.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router";
import axios from 'axios'


function Login() {
  const [email,setEmail]= useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();
  const [success,setSuccess] = useState(false);
  const [error,setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password,
      });

      if (response.status === 200) {

        setSuccess(true);
        setError(false);

        const { user } = response.data;

        localStorage.setItem('isLoggedIn', true);

        console.log('User details:', user);
        setTimeout(() => navigate('/dashboard', { state: { user } }), 2000);
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setSuccess(false);
    }
  };


  


  return (
    <div className="fixed left-0 right-0 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 ">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
      ></div>

      <div className="relative z-10 w-full max-w-md bg-black bg-opacity-70 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        <h2 className="text-4xl font-extrabold text-teal-400 text-center mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-sm text-red-800 text-center mb-8">
            Error Occcuring,Please Provide all the Valid details
          </p>
        )}
        {success && (
          <p className="text-sm text-green-700 text-center mb-8">
            Redirecting to he dashboard page
          </p>
        )}
        {!success && !error && (
          <p className="text-sm text-gray-400 text-center mb-8">
            Login to access your account.
          </p>

        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-4 rounded-2xl bg-white/10 backdrop-blur-lg text-white placeholder-gray-400 border border-white/20 shadow-lg focus:outline-none "
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full p-4 rounded-2xl bg-[#fff]/10 backdrop-blur-lg text-white placeholder-gray-400 border border-white/20 shadow-lg focus:outline-none "
              placeholder="Enter your Password.."
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-300"
            // onClick={() => navigate("/dashboard")}
          >
            Login
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-[1px] bg-gray-600"></div>
          </div>
          <span className="relative bg-black px-3 text-sm text-gray-400">
            Or login with
          </span>
        </div>


        <div className="flex justify-center space-x-4">
          <button className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300">
            <FaFacebook size={20} />
          </button>
          <button className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300">
            <FaGoogle size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-teal-400 font-medium hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
