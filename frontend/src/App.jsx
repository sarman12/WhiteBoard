import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Component/Home/Home';
import Login from './Component/Login/Login';
import Register from './Component/Login/Register'; 
import Dashboard from './Component/Dashboard/Dashboard';
import Whiteboard from './Component/Whiteboard/Whiteboard';
function App() {
  useEffect(() => {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;

      outline.animate(
        {
          left: `${x}px`,
          top: `${y}px`,
        },
        { duration: 500, fill: 'forwards' }
      );
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="cursor-dot"></div>
      <div className="cursor-outline"></div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
