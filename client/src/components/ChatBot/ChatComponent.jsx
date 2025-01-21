import React, { useState, useEffect } from 'react';
import HomeButton from '../Buttons/HomeButton';
import { Input } from '@/components/ui/input'; // ShadCN input
import { Button } from '@/components/ui/button'; // ShadCN button
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // ShadCN card
import { ScrollArea } from '@/components/ui/scroll-area'; // ShadCN scroll area

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
      <HomeButton />
      <Card className="max-w-md mx-auto p-4">
        <CardHeader>
          <CardTitle className="text-center">Chat with Tenant-Landlord Assistant</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ScrollArea className="h-full">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 text-sm ${
                  msg.sender === 'bot' ? 'text-left' : 'text-right'
                }`}
              >
                <span
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.sender === 'bot'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button onClick={sendMessage} variant="default">
            Send
          </Button>
          <Button onClick={clearChat} variant="secondary">
            Clear Chat
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ChatBot;

