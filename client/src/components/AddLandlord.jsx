import React, { useState, useContext } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !rating || !streetNumber || !streetName || !zipCode) {
      alert('Name, rating, and address must be provided');
      return;
    }

    // Your existing submission logic goes here...
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
                <Input
                  id="rating"
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="Rate the landlord (1-5)"
                  required
                />
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
