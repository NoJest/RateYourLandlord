import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // ShadCN carousel
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // ShadCN card
import { Skeleton } from "@/components/ui/skeleton"; // ShadCN skeleton for loading state
import HomeButton from './Buttons/HomeButton';
import PropertyCard from './PropertyCard';
import AddPropertyButton from './Buttons/AddPropertyButton';
import AddRatingButton from './Buttons/AddRatingButton';
import AddIssueButton from './Buttons/AddIssueButton';
import ChatBotButton from './Buttons/ChatBotButton';

const defaultImageUrl = 'https://t3.ftcdn.net/jpg/08/57/80/96/360_F_857809650_hY4uYlIKOSKu8hela7K2sj4KPbILsNl5.jpg';

const LandlordPage = () => {
  const { id } = useParams(); // Get landlord ID from the URL
  const [landlord, setLandlord] = useState(null); // Landlord data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await fetch(`/api/landlords/${id}`);
        if (!response.ok) throw new Error('Failed to fetch landlord details');
        const data = await response.json();
        setLandlord(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlord();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!landlord) {
    return <div className="text-center text-red-500">Failed to load landlord details.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <HomeButton />
      </div>
      
      {/* Landlord Details */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>{landlord.name}</CardTitle>
          <CardDescription>
            {landlord.average_rating
              ? `Average Rating: ${landlord.average_rating} (${landlord.rating_count} ${landlord.rating_count === 1 ? 'review' : 'reviews'})`
              : 'No ratings available'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <img
            src={landlord.image_url || defaultImageUrl}
            alt={landlord.name}
            className="rounded-lg mb-4"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
        </CardContent>
      </Card>

      {/* Issues Carousel */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Reported {landlord.issues?.length === 1 ? 'Issue' : 'Issues'}({landlord.issues?.length || 0})</h3>
        {landlord.issues?.length > 0 ? (
          <Carousel className="w-full max-w-3xl mx-auto">
            <CarouselContent>
              {landlord.issues.map((issue) => (
                <CarouselItem key={issue.id}>
                  <Card className="shadow-md">
                    <CardContent>
                      <p><strong>Description:</strong> {issue.description}</p>
                      <p><strong>Date Reported:</strong> {issue.date_reported}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-gray-500 text-center">No issues reported.</p>
        )}
      </div>

      {/* Property Carousel */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{landlord.properties?.length === 1 ? 'Property' : 'Properties'}({landlord.properties?.length || 0})</h3>
        {landlord.properties?.length > 0 ? (
          <Carousel className="w-full max-w-3xl mx-auto">
            <CarouselContent>
              {landlord.properties.map((property) => (
                <CarouselItem key={property.id}>
                  <Card className="shadow-md">
                    <CardContent>
                      <PropertyCard landlord={property} />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-gray-500 text-center">No properties available.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <AddPropertyButton landlordId={id} />
        <AddRatingButton landlordId={id} />
        <AddIssueButton landlordId={id} />
        <ChatBotButton />
      </div>
    </div>
  );
};

export default LandlordPage;
