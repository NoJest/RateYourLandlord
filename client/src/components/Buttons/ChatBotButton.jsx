import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import ShadCN Button

const ChatBotButton = () => {
  // useNavigate hook from React Router
  const navigate = useNavigate();

  // Function to handle the navigation on button click
  const handleClick = () => {
    navigate('/ChatBot');
  };

  return (
    <div className="mb-4">
      <Button 
        variant="default" 
        className="w-full" 
        onClick={handleClick}
      >
        Open ChatBot
      </Button>
    </div>
  );
};

export default ChatBotButton;
