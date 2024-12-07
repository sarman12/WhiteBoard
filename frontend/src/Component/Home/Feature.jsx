import React from 'react';

function Feature() {
  return (
    <div id="feature" className="relative py-10 border-y-[1px] border-gray-600">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-[#f7e7ce]  mb-6">
            Feature Highlights
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Unlock powerful tools that redefine seamless collaboration and unleash creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-gray-800/75 p-8 rounded-lg shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:bg-teal-500/25"
            >
              <div className="flex items-center justify-center h-20 w-20 bg-teal-500 text-white rounded-full shadow-xl mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={feature.iconPath}
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const featuresData = [
  {
    title: 'Real-time Collaboration',
    description:
      'Collaborate with your team in real-time on the same whiteboard, no matter where you are.',
    iconPath: 'M7 10h10M7 6h10M7 14h10M7 18h10',
  },
  {
    title: 'Infinite Canvas',
    description:
      'Endless space for your ideas. Zoom in, zoom out, and move around freely.',
    iconPath: 'M12 4v16m8-8H4',
  },
  {
    title: 'Drawing & Annotation Tools',
    description:
      'Use pens, shapes, and text tools to annotate and draw directly on your whiteboard.',
    iconPath: 'M19 7L10 17l-3-3L7 14l3 3L19 7z',
  },
  {
    title: 'Cloud Sync',
    description:
      'Your work is automatically synced across all devices, keeping you always up to date.',
    iconPath: 'M12 8v4M12 12v4M12 4h.01M12 16h.01',
  },
  {
    title: 'Real-time Messaging Broadcasting',
    description:
      'Send messages instantly across the platform to keep everyone in the loop.',
    iconPath: 'M5 13l4 4L19 7',
  },
  {
    title: 'Video Calling',
    description:
      'Face-to-face communication through video calling to enhance your collaboration experience.',
    iconPath:
      'M15 10l4.5-4.5M15 10l4.5 4.5M15 10v5H6V5h10v5z',
  },
];

export default Feature;
