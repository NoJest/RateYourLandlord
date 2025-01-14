import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import ShadCN Button

const AddIssueButton = ({ landlordId }) => {
  // useNavigate hook from React Router
  const navigate = useNavigate();

  // Function to handle the navigation on button click
  const handleClick = () => {
    navigate(`/AddIssue/${landlordId}`);
  };

  return (
    <div className="mb-4">
      <Button 
        variant="default" 
        className="w-full" 
        onClick={handleClick}
      >
        Add Issue
      </Button>
    </div>
  );
};

export default AddIssueButton;
