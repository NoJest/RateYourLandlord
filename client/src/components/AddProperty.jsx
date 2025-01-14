import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // ShadCN Card
import { Alert, AlertDescription } from "@/components/ui/alert"; // ShadCN Alert
import HomeButton from './Buttons/HomeButton';

const AddProperty = () => {
  const { id } = useParams(); // Get landlord ID from the URL
  const navigate = useNavigate(); // Used for navigation after form submission

  const [apartmentNumber, setApartmentNumber] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [llc, setLlc] = useState('');
  const [propertyManagement, setPropertyManagement] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Assuming 'currentUser' is stored as an object
    if (currentUser && currentUser.id) {
      setUserId(currentUser.id); // Set the userId from the logged-in user's data
    } else {
      setErrorMessage('You must be logged in to add a property.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setErrorMessage('You must be logged in to add a property.');
      return;
    }
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartment_number: apartmentNumber,
          street_number: streetNumber,
          street_name: streetName,
          zip_code: zipCode,
          llc,
          property_management: propertyManagement,
          landlord_id: id, // Include landlord ID to associate the property
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create property');
      }

      // On success, navigate back to the landlord page
      navigate(`/landlord/${id}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <HomeButton />
      <Card className="mx-auto max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Add New Property</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="apartmentNumber">
                Apartment Number
              </label>
              <Input
                id="apartmentNumber"
                value={apartmentNumber}
                onChange={(e) => setApartmentNumber(e.target.value)}
                placeholder="Enter apartment number"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="streetNumber">
                Street Number
              </label>
              <Input
                id="streetNumber"
                value={streetNumber}
                onChange={(e) => setStreetNumber(e.target.value)}
                placeholder="Enter street number"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="streetName">
                Street Name
              </label>
              <Input
                id="streetName"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter street name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="zipCode">
                Zip Code
              </label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter zip code"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="llc">
                LLC (Optional)
              </label>
              <Input
                id="llc"
                value={llc}
                onChange={(e) => setLlc(e.target.value)}
                placeholder="Enter LLC"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="propertyManagement">
                Property Management (Optional)
              </label>
              <Input
                id="propertyManagement"
                value={propertyManagement}
                onChange={(e) => setPropertyManagement(e.target.value)}
                placeholder="Enter property management"
              />
            </div>
            <div className="flex justify-center">
              <Button type="submit" variant="default" className="w-full">
                Add Property
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProperty;
