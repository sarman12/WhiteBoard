import React from 'react';
import '../../index.css';
import Navbar from './Navbar';
import Hero from './Hero';
import Feature from './Feature';
import Footer from './Footer';
import About from './About';
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="gradient-wallpaper">
        <Feature />
        <About/>
        <Footer />
      </div>
    </>
  );
}

export default Home;
