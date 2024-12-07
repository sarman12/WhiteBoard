import React from 'react'

function Testimonials() {
  return (
    <div id="testimonials" className="mt-10 text-center px-6 pb-10 border-b-[1px] border-gray-600">
      
      <h2 className="text-2xl md:text-4xl   mb-6 font-extrabold text-[#f7e7ce] ">
        What Our Users Say
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        <blockquote className="text-white max-w-xs text-left italic border-l-4 border-teal-400 pl-4">
          "CollabPad has transformed the way my team works together! The tools are intuitive and powerful."
          <cite className="block mt-2 text-teal-400 font-semibold">- Sarah, Project Manager</cite>
        </blockquote>
        <blockquote className="text-white max-w-xs text-left italic border-l-4 border-teal-400 pl-4">
          "The best collaboration tool I’ve ever used. It’s like a digital workshop for creatives!"
          <cite className="block mt-2 text-teal-400 font-semibold">- Alex, Designer</cite>
        </blockquote>
        <blockquote className="text-white max-w-xs text-left italic border-l-4 border-teal-400 pl-4">
          "The seamless collaboration and real-time updates make it perfect for my remote team."
          <cite className="block mt-2 text-teal-400 font-semibold">- Michael, Developer</cite>
        </blockquote>
        <blockquote className="text-white max-w-xs text-left italic border-l-4 border-teal-400 pl-4">
          "It feels like brainstorming on a whiteboard but with the flexibility of digital tools!"
          <cite className="block mt-2 text-teal-400 font-semibold">- Emily, Educator</cite>
        </blockquote>
      </div>

      <div className="mt-10">
        <button className="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-3 px-12 rounded-xl font-semibold text-lg hover:opacity-90 transition duration-300">
          Watch Video Demo
        </button>
        <p className="text-sm text-gray-400 mt-4">
          See how CollabPad can help you achieve your goals.
        </p>
      </div>
    </div>
  );
}

export default Testimonials;
