import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // ShadCN Button

const LandlordCard = ({ landlord }) => {
  const navigate = useNavigate();

  const defaultImageUrl = 'https://t3.ftcdn.net/jpg/08/57/80/96/360_F_857809650_hY4uYlIKOSKu8hela7K2sj4KPbILsNl5.jpg';

  // Handle click to navigate to the specific landlord's page
  const handleViewDetails = () => {
    navigate(`/landlord/${landlord.id}`); // Navigate to the landlord's page using their id
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{landlord.name}</CardTitle>
        <CardDescription>
          <span className="text-gray-600">Rating: {landlord.rating}</span> (
          <span className="text-sm text-gray-500">{landlord.rating_count} reviews</span>)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <img
          src={landlord.image_url || defaultImageUrl}
          alt={landlord.name}
          className="w-full max-h-48 object-cover rounded-md"
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button onClick={handleViewDetails} variant="default" className="text-sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LandlordCard;
