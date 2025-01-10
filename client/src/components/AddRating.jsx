import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeButton from './Buttons/HomeButton';

const AddRating = () => {
  const { id } = useParams(); // Get landlord ID from the URL
  const navigate = useNavigate(); // Used for navigation after form submission

  // Local state for the rating
  const [rating, setRating] = useState('');
  const [userId, setUserId] = useState(''); // Assuming userId is available in the session or from context
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
 

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Assuming 'currentUser' is stored as an object
    if (currentUser && currentUser.id) {
      setUserId(currentUser.id); // Set the userId from the logged-in user's data
    } else {
      setErrorMessage('You must be logged in to rate.');
    }
  }, []); // Empty dependency array to run once when the component mounts
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || !userId) {
      setErrorMessage('Must be logged in to rate');
      return;
    }

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: parseInt(rating),
          landlord_id: id, // The landlord ID from the URL
          user_id: userId,  // Assuming the user is logged in and userId is available
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add rating');
      }

      // Reset form and show success message
      setRating('');
      setErrorMessage('');
      setSuccessMessage('Rating added successfully!');

      // Optionally, navigate to the landlord page or clear the message after a while
      setTimeout(() => {
        setSuccessMessage('');
        navigate(`/landlord/${id}`); // Redirect back to the landlord page
      }, 2000);
      
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <HomeButton></HomeButton>
      <h2>Add Rating</h2>
      
      {/* Show error message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Show success message */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Rating (1 to 5):
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </label>
        </div>
        

        <button type="submit">Submit Rating</button>
      </form>
    </div>
  );
};

export default AddRating;
