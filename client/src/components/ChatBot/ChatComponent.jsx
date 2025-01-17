import React, { useState } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

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
        placeholder="Type your message..."
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
    </div>
  );
};

export default ChatBot;

