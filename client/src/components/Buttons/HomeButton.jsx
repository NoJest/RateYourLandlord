import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const HomeButton = () => {
  const navigate = useNavigate();  // Initialize navigate function

  // Function to navigate to the dashboard
  const goToDashboard = () => {
    navigate('/dashboard');  // Navigate to /dashboard
  };

  return (
    <button onClick={goToDashboard}
      style={styles.button} 
      className="home-button"
    >
      Home
    </button>
  );
  
};

const styles = {
  button: {
    padding: '10px 20px',
    color: 'white',
    border: 'white solid',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default HomeButton;
