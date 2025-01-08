import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const HomeButton = () => {
  const navigate = useNavigate();  // Initialize navigate function

  // Function to navigate to the dashboard
  const goToDashboard = () => {
    navigate('/dashboard');  // Navigate to /dashboard
  };

  return (
    <button onClick={goToDashboard} className="home-button">
      Home
    </button>
  );
};

export default HomeButton;
