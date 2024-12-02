import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Component/Home/Home';
import Login from './Component/Login/Login';
import Register from './Component/Login/Register'; 
import Dashboard from './Component/Dashboard/Dashboard';
import Whiteboard from './Component/Whiteboard/Whiteboard';
function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/whiteboard/:roomID" element={<Whiteboard />} /> 
     </Routes>
    </BrowserRouter>
  );
}

export default App;
