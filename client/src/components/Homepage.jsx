import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; 
import LandlordCard from './LandlordCard';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"; // ShadCN button
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // ShadCN card
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import ChatBotButton from './Buttons/ChatBotButton';
import './Homepage.css';


function Homepage() {
  const [landlords, setLandlords] = useState([]); // State to store landlords data
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const response = await fetch('/api/landlords'); 
        if (!response.ok) {
          throw new Error('Failed to fetch landlords');
        }
        const data = await response.json();

        // Sort the landlords by rating (ascending) and take the first 10
        const sortedLandlords = data
          .sort((a, b) => a.rating - b.rating)
          .slice(0, 10);

        setLandlords(sortedLandlords); // Store the sorted data in state
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after the fetch completes
      }
    };

    fetchLandlords(); // Call the async function
  }, []); // Empty dependency array means it runs once when the component mounts

  // If loading, show ShadCN skeleton
  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  // If there's an error, display a styled error message
  if (error) {
    return (
      <div className="p-4 text-red-500 font-medium">
        <p>Error: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      {/* Carousel of ten worst landlords */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-center mb-4">
          The 10 Worst Rated Landlords
        </h2>
        {landlords.length > 0 ? (
          <Carousel className="carousel">
            <CarouselContent className="carousel-content">
              {landlords.map((landlord) => (
                <CarouselItem key={landlord.id} className="carousel-item">
                  <LandlordCard landlord={landlord} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <p className="text-center text-gray-500">
            No landlords found with low ratings.
          </p>
        )}
      </div>

      {/* Buttons for Login and Sign Up */}
      <div className="flex gap-4 justify-center">
        <Link to="/login">
          <Button variant="default" className="button" aria-label="Log in to your account">
            Login
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="default" className="button" aria-label="Create a new account">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}


export default Homepage;