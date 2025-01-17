import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App'; 
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LandlordCard from './LandlordCard';
import './UserDashboard.css' 
import ChatBotButton from './Buttons/ChatBotButton';
const UserDashboard = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [associatedLandlords, setAssociatedLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const fetchAssociatedLandlords = async () => {
    try {
      const response = await fetch(`/api/landlords/associated?userId=${currentUser.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setAssociatedLandlords([]);
          return;
        }
        throw new Error('Failed to fetch associated landlords');
      }
      const data = await response.json();
      // Remove duplicates by using a Map
      const uniqueLandlords = Array.from(
        new Map(data.map((landlord) => [landlord.id, landlord])).values()
      );

      setAssociatedLandlords(uniqueLandlords);
    } catch (err) {
      setError('Failed to fetch associated landlords');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        setLoading(true);
        await fetchAssociatedLandlords();
      }
    };
    fetchData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="skeleton h-6" />
        <Skeleton className="skeleton h-40" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container">
      <h2 className="dashboard-welcome">Welcome, {currentUser.username}</h2>

      <div className="carousel-section">
        <h3 className="carousel-title">Landlords</h3>
        {associatedLandlords.length > 0 ? (
          <Carousel className="carousel">
            <CarouselContent className="carousel-content">
              {associatedLandlords.map((landlord, index) => (
                <CarouselItem key={`${landlord.id}-${index}`} className="carousel-item">
                  <LandlordCard landlord={landlord} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="empty-message">No landlords associated with your account.</p>
        )}
      </div>

      <div className="action-buttons">
        <Button onClick={() => navigate('/addlandlord')}>Add Landlord</Button>
        <Button onClick={() => navigate('/search')}>Search Landlords</Button>
        <Button className="logout-button" onClick={handleLogout}>
          Logout
        </Button>
        <ChatBotButton />
      </div>
    </div>
  );
};

export default UserDashboard;
