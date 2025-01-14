import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeButton from './Buttons/HomeButton';

const AddIssue = () => {
  const { id } = useParams(); // Get landlord ID from the URL
  const navigate = useNavigate(); // Used for navigation after form submission

  // Local state for the form fields
  const [description, setDescription] = useState('');
  const [dateReported, setDateReported] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Assuming 'currentUser' is stored as an object
    if (currentUser && currentUser.id) {
      setUserId(currentUser.id); // Set the userId from the logged-in user's data
    } else {
      setErrorMessage('You must be logged in to report an issue.');
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setErrorMessage('You must be logged in to report an issue.');
      return;
    }

    if (description.length < 10) {
      setErrorMessage('Description must be at least 10 characters long.');
      return;
    }

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          date_reported: dateReported || new Date().toISOString().split('T')[0], // Use provided date or default to today
          landlord_id: id, // Include landlord ID to associate the issue
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to report issue');
      }

      // On success, navigate back to the landlord page (or wherever appropriate)
      navigate(`/landlord/${id}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <HomeButton />
      <h2>Report an Issue</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Issue Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue (at least 10 characters)"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Date Reported:
            <input
              type="date"
              value={dateReported}
              onChange={(e) => setDateReported(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Submit Issue</button>
      </form>
    </div>
  );
};

export default AddIssue;
