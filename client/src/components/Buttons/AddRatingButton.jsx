import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddRatingButton = ({ landlordId }) => {
  // useNavigate hook from React Router
  const navigate = useNavigate();
  // Function to handle the navigation on button click
  const handleClick = () => {
    navigate(`/AddRating/${landlordId}`);
  };

  return (
    <button 
      onClick={handleClick}
      style={styles.button} 
      className="add-rating-btn">
      Add Rating
    </button>
  );
};

const styles = {
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'White solid',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default AddRatingButton;