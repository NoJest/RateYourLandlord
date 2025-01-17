import React, { useState, useEffect } from 'react';
import HomeButton from '../Buttons/HomeButton'
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

   // Add an initial message when the component loads
  useEffect(() => {
    const initialMessage = {
      sender: 'bot',
      text: 'Welcome to the Tenant-Landlord Assistant! How can I help you? You can ask about rent disputes, repairs, lease agreements, or evictions.',
    };
    setMessages([initialMessage]);
  }, []);
  const clearChat = async () => {
    try {
      const response = await fetch('/api/clear_chat', {
        method: 'POST',
      });
      const data = await response.json();
      console.log(data.message); // Optionally log the confirmation message
      setMessages([]); // Clear the chat in the UI
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };
  
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error connecting to the server.' },
      ]);
    }

    setInput('');
  };

  return (
  <>
  <HomeButton></HomeButton>
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          maxHeight: '300px',
          overflowY: 'auto',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === 'bot' ? 'left' : 'right',
              margin: '10px 0',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: msg.sender === 'bot' ? '#f0f0f0' : '#007bff',
                color: msg.sender === 'bot' ? '#000' : '#fff',
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
        style={{
          width: 'calc(100% - 50px)',
          padding: '10px',
          marginRight: '10px',
          borderRadius: '5px',
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
        }}
      >
        Send
      </button>
      <button onClick={clearChat} style={{
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
        }}>Clear Chat</button>
    </div>
  </>
  );
};

export default ChatBot;

