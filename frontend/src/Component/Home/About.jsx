import React from 'react';
import '../../index.css'
function About() {
  return (
    <div className="py-16 border-1 border-t border-b border-gray-500 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-teal-400 mb-4">About Us</h2>
          <p className="text-lg text-gray-400">
            We are a team of passionate developers dedicated to building innovative solutions that enhance productivity and creativity.
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-400">
            With years of experience in software development, our mission is to provide cutting-edge tools for seamless collaboration.
            Our goal is to help teams of all sizes and industries work more efficiently together.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
