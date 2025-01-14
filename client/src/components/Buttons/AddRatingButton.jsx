import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import ShadCN Button

const AddRatingButton = ({ landlordId }) => {
  // useNavigate hook from React Router
  const navigate = useNavigate();

  // Function to handle the navigation on button click
  const handleClick = () => {
    navigate(`/AddRating/${landlordId}`);
  };

  return (
    <div className="mb-4">
      <Button 
        variant="default" 
        className="w-full" 
        onClick={handleClick}
      >
        Add Rating
      </Button>
    </div>
  );
};

export default AddRatingButton;
