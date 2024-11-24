import React, { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messageContainerRef = useRef(null);

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() === "") return;
    setMessages([
      ...messages,
      { sender: "You", text: currentMessage, timestamp: new Date().toLocaleTimeString(), isOnline: true },
    ]);
    setCurrentMessage("");
    setIsTyping(false);
  };
  const handleEmojiClick = (event, emojiObject) => {
    setCurrentMessage((prev) => prev + emojiObject.emoji);
    setEmojiPickerVisible(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages([
        ...messages,
        { sender: "You", text: `Sent a file: ${file.name}`, timestamp: new Date().toLocaleTimeString(), isOnline: true },
      ]);
    }
  };

  const handleEditMessage = (index) => {
    const newMessage = prompt("Edit your message:", messages[index].text);
    if (newMessage) {
      const updatedMessages = [...messages];
      updatedMessages[index].text = newMessage;
      setMessages(updatedMessages);
    }
  };

  const handleDeleteMessage = (index) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
  };

  const handleScroll = () => {
    const { scrollTop } = messageContainerRef.current;
    if (scrollTop === 0) {
      setMessages((prev) => [
        ...Array.from({ length: 5 }, (_, i) => ({
          sender: "Old User",
          text: `Old message ${i + 1}`,
          timestamp: new Date().toLocaleTimeString(),
          isOnline: false,
        })),
        ...prev,
      ]);
    }
  };

  const filteredMessages = messages.filter((message) =>
    message.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-1/4 p-4 border-l bg-white text-black space-y-4">
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Search messages..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div
        className="h-[70vh] overflow-auto border p-4"
        ref={messageContainerRef}
        onScroll={handleScroll}
      >
        {filteredMessages.map((message, index) => (
          <div key={index} className="my-2 flex items-start">
            <img
              src={message.avatarUrl || "default-avatar.png"}
              alt="Avatar"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full ${
                    message.isOnline ? "bg-green-500" : "bg-gray-500"
                  } mr-2`}
                ></span>
                <strong>{message.sender}</strong>
              </div>
              <p>{message.text}</p>
              <span className="text-xs text-gray-500">{message.timestamp}</span>
              <div className="flex space-x-2 text-sm text-gray-500">
                <button onClick={() => handleEditMessage(index)}>Edit</button>
                <button onClick={() => handleDeleteMessage(index)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-sm text-gray-500">Someone is typing...</div>}
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="p-2 bg-gray-200 text-gray-600 rounded"
          onClick={toggleEmojiPicker}
        >
          😊
        </button>
        {emojiPickerVisible && (
          <div className="absolute w-40 top-2">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <label
          htmlFor="fileInput"
          className="p-2 bg-gray-200 text-gray-600 cursor-pointer rounded"
        >
          📎
        </label>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileUpload}
        />
        <input
          type="text"
          className="border p-2 flex-grow"
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
            setIsTyping(true);
          }}
          placeholder="Type a message"
        />
        <button
          className="p-2 bg-blue-500 text-white ml-2"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
