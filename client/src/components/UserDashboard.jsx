import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App'; // Access the UserContext to get the current user
import Slider from 'react-slick'; // Slick carousel for displaying landlords
import LandlordCard from './LandlordCard';
import './UserDashboard.css'; // Assuming you have some basic styles for the component

const UserDashboard = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext); // Get the current user
  const [associatedLandlords, setAssociatedLandlords] = useState([]);
  const [worstRatedLandlords, setWorstRatedLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Navigate to different pages

  const handleLogout = () => {
    // Clear the current user from state and localStorage
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    
    // Navigate to the homepage or login page
    navigate('/');
  };
  

  // If there's no currentUser, redirect to the login page
  useEffect(() => {
    if (!currentUser) {
      navigate('/login'); // Redirect to login page if no user is logged in
    }
  }, []);

  // Fetch associated landlords for the current user
  const fetchAssociatedLandlords = async () => {
    try {
      const response = await fetch(`/api/landlords/associated?userId=${currentUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch associated landlords');
      }
      const data = await response.json();
      // console.log('Associated landlords:', data);

      // remove duplicates
      const uniqueLandlords = [
        ...new Map(data.map((landlord) => [landlord.id, landlord])).values()
      ];
      setAssociatedLandlords(uniqueLandlords);
    } catch (err) {
      console.error('Failed to fetch associated landlords:', err);
      setAssociatedLandlords([]); // Set to empty if the fetch fails
      setError('Failed to fetch associated landlords');
    }
  };

  // Fetch top 5 worst-rated landlords
  const fetchWorstRatedLandlords = async () => {
    try {
      const response = await fetch('/api/landlords');
      if (!response.ok) throw new Error('Failed to fetch landlords');
      const data = await response.json();
      const sortedLandlords = data
        .sort((a, b) => a.rating - b.rating) // Sort by rating (ascending)
        .slice(0, 5); // Get top 5 worst-rated landlords
      setWorstRatedLandlords(sortedLandlords);
    } catch (err) {
      console.error('Failed to fetch landlords:', err);
      setWorstRatedLandlords([]); // Set to empty if the fetch fails
      setError('Failed to fetch worst-rated landlords');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          await Promise.all([fetchAssociatedLandlords(), fetchWorstRatedLandlords()]);
        } catch (err) {
          setError('Failed to load data');
        } finally {
          setLoading(false); // Set loading to false once both fetches are complete
        }
      }
    };

    fetchData();
  }, [currentUser]);

  // Carousel settings
  const carouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
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

  // Loading state and UI rendering
  if (loading) {
    return <div>Loading...</div>; // Show loading while data is being fetched
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-dashboard">
      <h2>Welcome, {currentUser.username}</h2>

      {/* Carousel of landlords associated with the signed-in user */}
      <div className="carousel-container">
        <h3>Landlords Associated with You</h3>
        {associatedLandlords.length === 0 ? (
          <p>No landlords associated with your account.</p>
        ) : (
          <Slider {...carouselSettings}>
            {associatedLandlords.map((landlord) => (
              <div key={landlord.id}>
                <LandlordCard landlord={landlord} />
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Buttons for navigation */}
      <div className="action-buttons">
        <button onClick={() => navigate('/addlandlord')}>Add Landlord</button>
        <button onClick={() => navigate('/search')}>Search Landlords</button>
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      </div>
    </div>
    
  );
};

export default UserDashboard;
