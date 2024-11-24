import React from 'react';
import '../../index.css';
import Navbar from './Navbar';
import Hero from './Hero';
import Feature from './Feature';
import Footer from './Footer';
import About from './About';
import Testimonials from './Testimonials';
function Home() {
  return (
    <>
      <Navbar />
      <div className="gradient-wallpaper">
        <Hero />
        <Feature />
        <Testimonials/>
        {/* <About/> */}
        <Footer />
      </div>
    </>
  );
}

export default Home;
