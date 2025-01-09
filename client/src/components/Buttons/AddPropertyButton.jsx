import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddPropertyButton = ({landlordId}) => {
  // useNavigate hook from React Router
  const navigate = useNavigate();

  // Function to handle the navigation on button click
  const handleClick = () => {
    navigate(`/AddProperty/${landlordId}`);
  };

  return (
    <button 
      onClick={handleClick}
      style={styles.button} 
      className="add-property-btn">
      Add Property
    </button>
  );
};

const styles = {
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'white solid',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default AddPropertyButton;