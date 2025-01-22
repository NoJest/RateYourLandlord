import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // ShadCN Card
import { Alert, AlertDescription } from "@/components/ui/alert"; // ShadCN Alert
import HomeButton from './Buttons/HomeButton';

const AddRating = () => {
  const { id } = useParams(); // Get landlord ID from the URL
  const navigate = useNavigate(); // Used for navigation after form submission

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !userId) {
      setErrorMessage('You must be logged in to rate.');
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
          user_id: userId, // Assuming the user is logged in and userId is available
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add rating');
      }

      setRating('');
      setErrorMessage('');
      setSuccessMessage('Rating added successfully!');

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
    <div className="container mx-auto p-4">
      <HomeButton />
      <Card className="mx-auto max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Add Rating</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert className="mb-4" variant="success">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="rating">
                Rating (1 to 5)
              </label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Enter a rating"
                required
              />
            </div>
            <div className="flex justify-center">
              <Button type="submit" variant="default" className="w-full">
                Submit Rating
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRating;
