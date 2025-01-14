import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Textarea } from "@/components/ui/textarea"; // ShadCN Textarea
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // ShadCN Card
import { Alert, AlertDescription } from "@/components/ui/alert"; // ShadCN Alert
import HomeButton from './Buttons/HomeButton';

const AddIssue = () => {
  const { id } = useParams(); // Get landlord ID from the URL
  const navigate = useNavigate(); // Used for navigation after form submission

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

      navigate(`/landlord/${id}`); // Redirect back to the landlord page on success
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <HomeButton />
      <Card className="mx-auto max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Report an Issue</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Issue Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue (at least 10 characters)"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="dateReported">
                Date Reported
              </label>
              <Input
                id="dateReported"
                type="date"
                value={dateReported}
                onChange={(e) => setDateReported(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <Button type="submit" variant="default" className="w-full">
                Submit Issue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddIssue;
