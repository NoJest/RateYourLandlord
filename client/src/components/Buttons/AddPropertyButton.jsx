import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import ShadCN Button

const AddPropertyButton = ({ landlordId }) => {
  // useNavigate hook from React Router
  const navigate = useNavigate();

  // Function to handle the navigation on button click
  const handleClick = () => {
    navigate(`/AddProperty/${landlordId}`);
  };

  return (
    <div className="mb-4">
      <Button 
        variant="default" 
        className="w-full" 
        onClick={handleClick}
      >
        Add Property
      </Button>
    </div>
  );
};

export default AddPropertyButton;
