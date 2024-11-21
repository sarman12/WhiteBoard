import React, { useState } from 'react';
import '../../index.css';
import bg from '../../assets/whiteboard.jpg'
function Dashboard() {
  const [whiteboards, setWhiteboards] = useState([
    { name: 'Board 1', description: 'A creative brainstorming space' },
    { name: 'Board 2', description: 'A meeting agenda whiteboard' },
  ]);
  const [userDetails, setUserDetails] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    joinedBoards: ['Board 1', 'Board 2'],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const handleCreateWhiteboard = () => {
    const newBoard = `Board ${whiteboards.length + 1}`;
    setWhiteboards([...whiteboards, { name: newBoard, description: 'New Whiteboard' }]);
  };

  const handleJoinWhiteboard = (boardName) => {
    if (!userDetails.joinedBoards.includes(boardName)) {
      setUserDetails({
        ...userDetails,
        joinedBoards: [...userDetails.joinedBoards, boardName],
      });
    }
  };

  const handleLogout = () => {
    // Logic to log out the user
    console.log('Logging out');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredBoards = whiteboards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-blue-900 via-purple-800 to-pink-900' : 'bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400'} text-white flex`}>
      <div className="w-3/4 p-8">
        <h2 className="text-3xl font-bold mb-6">Welcome to your Dashboard, {userDetails.name}!</h2>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="mb-6 py-2 px-4 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition duration-300"
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Whiteboards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Activity Feed Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Activity Feed</h3>
          <ul className="list-disc pl-5">
            <li>You joined "Board 1"</li>
            <li>You created "Board 3"</li>
            {/* Add more dynamic activity as needed */}
          </ul>
        </div>

        {/* Whiteboard Section */}
        <div className="mb-6">
          <button
            onClick={handleCreateWhiteboard}
            className="w-full bg-teal-600 py-3 rounded font-semibold hover:bg-teal-700 transition duration-300"
          >
            Create a New Whiteboard
          </button>
          <h3 className="text-xl mt-4">Your Whiteboards:</h3>
          <ul className="list-disc pl-5">
            {filteredBoards.length > 0 ? (
              filteredBoards.map((board, index) => (
                <li key={index} className="mt-2 text-teal-300 flex justify-between items-center">
                  <div>
                    <span>{board.name}</span>
                    <p className="text-sm text-gray-300">{board.description}</p>
                  </div>
                  <button
                    onClick={() => handleJoinWhiteboard(board.name)}
                    className="text-sm text-blue-300 hover:underline"
                  >
                    Join
                  </button>
                </li>
              ))
            ) : (
              <li>No whiteboards found.</li>
            )}
          </ul>
        </div>
      </div>

      {/* User Details Section */}
      <div className="w-1/4 p-8 bg-gray-800 rounded-l-lg">
        <h3 className="text-2xl font-bold mb-4">Your Profile</h3>
        <div className="mb-4">
          <strong>Name: </strong>
          <span>{userDetails.name}</span>
        </div>
        <div className="mb-4">
          <strong>Email: </strong>
          <span>{userDetails.email}</span>
        </div>
        <div>
          <strong>Joined Whiteboards: </strong>
          <ul className="list-disc pl-5">
            {userDetails.joinedBoards.length > 0 ? (
              userDetails.joinedBoards.map((board, index) => (
                <li key={index}>{board}</li>
              ))
            ) : (
              <li>No whiteboards joined.</li>
            )}
          </ul>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 py-3 rounded font-semibold hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
