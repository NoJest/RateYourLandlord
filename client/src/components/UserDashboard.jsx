import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '/Users/justinpthomasson/Development/code/phase-5/RateYourLandlord/client/src/App.jsx'; // Access the UserContext to get the current user
import Slider from 'react-slick'; // Slick carousel for displaying landlords
import LandlordCard from './LandlordCard';
import './UserDashboard.css'; // Assuming you have some basic styles for the component

const UserDashboard = () => {
  const { currentUser } = useContext(UserContext); // Get the current user
  const [associatedLandlords, setAssociatedLandlords] = useState([]);
  const [worstRatedLandlords, setWorstRatedLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Navigate to different pages

  // Fetch associated landlords for the current user
  const fetchAssociatedLandlords = async () => {
    try {
      const response = await fetch(`/api/landlords/associated?userId=${currentUser.id}`);
      const data = await response.json();
      setAssociatedLandlords(data);
    } catch (err) {
      console.error('Failed to fetch associated landlords:', err);
    }
  };

  // Fetch top 5 worst-rated landlords
  const fetchWorstRatedLandlords = async () => {
    try {
      const response = await fetch('/api/landlords');
      const data = await response.json();
      const sortedLandlords = data
        .sort((a, b) => a.rating - b.rating) // Sort by rating (ascending)
        .slice(0, 5); // Get top 5 worst-rated landlords
      setWorstRatedLandlords(sortedLandlords);
    } catch (err) {
      console.error('Failed to fetch landlords:', err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (currentUser) {
      fetchAssociatedLandlords();
      fetchWorstRatedLandlords();
      setLoading(false); // Set loading to false when data is fetched
    }
  }, [currentUser]);

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Handle button click for adding a landlord
  const handleAddLandlordClick = () => {
    navigate('/addlandlord'); // Navigate to /addlandlord page
  };

  // Handle button click for searching landlords
  const handleSearchClick = () => {
    navigate('/search'); // Navigate to /search page
  };

  // Loading state and UI rendering
  if (loading) {
    return <div>Loading...</div>; // Show loading while data is being fetched
  }

  return (
    <div className="user-dashboard">
      <h2>Welcome, {currentUser.username}</h2>

      {/* Carousel of landlords associated with the signed-in user */}
      <div className="carousel-container">
        <h3>Landlords Associated with You</h3>
        <Slider {...carouselSettings}>
          {associatedLandlords.map((landlord) => (
            <div key={landlord.id}>
              <LandlordCard landlord={landlord} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Buttons for navigation */}
      <div className="action-buttons">
        <button onClick={handleAddLandlordClick}>Add Landlord</button>
        <button onClick={handleSearchClick}>Search Landlords</button>
      </div>

      {/* Top 5 worst-rated landlords */}
      <div className="worst-rated-container">
        <h3>Top 5 Worst Rated Landlords</h3>
        <Slider {...carouselSettings}>
          {worstRatedLandlords.map((landlord) => (
            <div key={landlord.id}>
              <LandlordCard landlord={landlord} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default UserDashboard;