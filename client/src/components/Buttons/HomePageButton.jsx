import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import ShadCN Button

const HomePageButton = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-4">
      <Button 
        variant="default" 
        className="w-full" 
        onClick={() => navigate('/')}
      >
        Homepage
      </Button>
    </div>
  );
};

export default HomePageButton;