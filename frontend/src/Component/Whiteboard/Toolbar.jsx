import React, { useState } from "react";
import { FaPencilAlt, FaTextHeight, FaCircle, FaEraser, FaHighlighter, FaImage } from "react-icons/fa";

const Toolbar = ({ setTool, setColor, setLineWidth }) => {
  const [image, setImage] = useState(null); // State for imported image
  const [imageUrl, setImageUrl] = useState("");

  // Function to handle image import
  const handleImageImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Set image to state once loaded
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-100 w-1/5 p-4 flex flex-col space-y-4 border-r">
      <button onClick={() => setTool("pencil")} className="flex items-center p-2 bg-white hover:bg-gray-200 rounded-lg">
        <FaPencilAlt className="mr-2" /> Pencil
      </button>
      <button onClick={() => setTool("text")} className="flex items-center p-2 bg-white hover:bg-gray-200 rounded-lg">
        <FaTextHeight className="mr-2" /> Text
      </button>
      <button onClick={() => setTool("eraser")} className="flex items-center p-2 bg-white hover:bg-gray-200 rounded-lg">
        <FaEraser className="mr-2" /> Eraser
      </button>
      <button onClick={() => setTool("highlighter")} className="flex items-center p-2 bg-white hover:bg-gray-200 rounded-lg">
        <FaHighlighter className="mr-2" /> Highlighter
      </button>
      <button onClick={() => setTool("rectangle")} className="flex items-center p-2 bg-white hover:bg-gray-200 rounded-lg">
        Rectangle
      </button>
      <button onClick={() => setTool("circle")} className="flex items-center p-2 bg-white hover:bg-gray-200 rounded-lg">
        <FaCircle className="mr-2" /> Circle
      </button>

      <div>
        <label className="block text-sm">Pick Color:</label>
        <input type="color" onChange={(e) => setColor(e.target.value)} className="w-full p-2 mt-1 border rounded" />
      </div>

      <div>
        <label className="block text-sm">Line Width:</label>
        <input type="range" min="1" max="10" onChange={(e) => setLineWidth(e.target.value)} className="w-full mt-1" />
      </div>

      {/* Import External Image */}
      <div>
        <label className="block text-sm">Import Image:</label>
        <input type="file" accept="image/*" onChange={handleImageImport} className="w-full mt-1" />
      </div>

      <div>
        <label className="block text-sm">External Image URL:</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="w-full mt-1 border rounded p-2"
        />
        {imageUrl && <img src={imageUrl} alt="External" className="mt-2 w-full" />}
      </div>
    </div>
  );
};

export default Toolbar;
