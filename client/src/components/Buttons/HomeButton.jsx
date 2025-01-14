import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import ShadCN Button

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-4">
      <Button 
        variant="default" 
        className="w-full" 
        onClick={() => navigate('/dashboard')}
      >
        Home
      </Button>
    </div>
  );
};

export default HomeButton;