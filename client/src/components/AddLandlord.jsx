import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { Button } from '@/components/ui/button'; // ShadCN Button
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'; // ShadCN Card
import { Input } from '@/components/ui/input'; // ShadCN Input
import { Textarea } from '@/components/ui/textarea'; // ShadCN Textarea
import { Label } from '@/components/ui/label'; // ShadCN Label
import { Separator } from '@/components/ui/separator'; // ShadCN Separator
import HomeButton from './Buttons/HomeButton';
const AddLandlord = () => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [issues, setIssues] = useState('');
  const [dateReported, setDateReported] = useState('');
  const [rating, setRating] = useState('');
  const [llc, setLlc] = useState('');
  const [propertyManagement, setPropertyManagement] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !rating || !streetNumber || !streetName || !zipCode) {
      alert('Name, rating, and address must be provided');
      return;
    }

    const numericRating = parseFloat(rating);
    if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
      alert('Rating must be a number between 0 and 5');
      return;
    }

    try {
      // Step 1: Create the landlord
      const landlordResponse = await fetch('/api/landlords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          image_url: imageUrl || null, // Allow empty image URLs
          user_id: currentUser?.id, // Associate landlord with the current user
        }),
      });
  
      if (!landlordResponse.ok) {
        throw new Error('Failed to create landlord');
      }
  
      const landlordData = await landlordResponse.json();
      const landlordId = landlordData.id; // Get the created landlord ID
  
      console.log('Landlord created:', landlordData);
  
      // Step 2: Create the property
      const propertyResponse = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          llc: llc || null,
          property_management: propertyManagement || null,
          street_number: streetNumber,
          street_name: streetName,
          apartment_number: apartmentNumber || null,
          zip_code: zipCode,
          landlord_id: landlordId,
        }),
      });
  
      if (!propertyResponse.ok) {
        throw new Error('Failed to create property');
      }
  
      const propertyData = await propertyResponse.json();
      console.log('Property created:', propertyData);
  
      // Step 3: Create an issue (if provided)
      if (issues.trim()) {
        const issueResponse = await fetch('/api/issues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: issues,
            landlord_id: landlordId,
          }),
        });
  
        if (!issueResponse.ok) {
          throw new Error('Failed to create issue');
        }
  
        const issueData = await issueResponse.json();
        console.log('Issue created:', issueData);
      }
  
      // Step 4: Create a rating
      const ratingResponse = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: parseInt(rating, 10),
          landlord_id: landlordId,
          user_id: currentUser?.id,
        }),
      });
  
      if (!ratingResponse.ok) {
        throw new Error('Failed to create rating');
      }
  
      const ratingData = await ratingResponse.json();
      console.log('Rating created:', ratingData);
  
      // Clear the form and show success message
      alert('Landlord added successfully!');
      setName('');
      setImageUrl('');
      setIssues('');
      setDateReported('');
      setRating('');
      setLlc('');
      setPropertyManagement('');
      setStreetNumber('');
      setStreetName('');
      setApartmentNumber('');
      setZipCode('');
      navigate('/dashboard'); // Navigate to /dashboard
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the landlord. Please try again.');
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <HomeButton />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Add a New Landlord</CardTitle>
          <CardDescription>
            Please provide the necessary information to add a new landlord.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Landlord Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Landlord Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter landlord's name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter landlord's image URL"
                />
              </div>

              <div>
              <Label htmlFor="rating">Rating</Label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="" disabled>
                    Select a rating
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>

              </div>
            </div>

            <Separator className="my-4" />

            {/* Property Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="llc">LLC</Label>
                <Input
                  id="llc"
                  value={llc}
                  onChange={(e) => setLlc(e.target.value)}
                  placeholder="Enter LLC (if applicable)"
                />
              </div>

              <div>
                <Label htmlFor="property_management">Property Management</Label>
                <Input
                  id="property_management"
                  value={propertyManagement}
                  onChange={(e) => setPropertyManagement(e.target.value)}
                  placeholder="Enter property management company"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street_number">Street Number</Label>
                  <Input
                    id="street_number"
                    value={streetNumber}
                    onChange={(e) => setStreetNumber(e.target.value)}
                    placeholder="Street Number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="street_name">Street Name</Label>
                  <Input
                    id="street_name"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    placeholder="Street Name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apartment_number">Apartment Number (Optional)</Label>
                  <Input
                    id="apartment_number"
                    value={apartmentNumber}
                    onChange={(e) => setApartmentNumber(e.target.value)}
                    placeholder="Apartment Number"
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">Zip Code</Label>
                  <Input
                    id="zip_code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Zip Code"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Issues Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="issues">Issues</Label>
                <Textarea
                  id="issues"
                  value={issues}
                  onChange={(e) => setIssues(e.target.value)}
                  placeholder="e.g., Broken pipe, Leaking roof"
                />
              </div>

              <div>
                <Label htmlFor="date_reported">Date Reported</Label>
                <Input
                  id="date_reported"
                  type="date"
                  value={dateReported}
                  onChange={(e) => setDateReported(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <Button type="submit" variant="default" className="w-full">
                Add Landlord
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddLandlord;
