import React, {useState, useEffect} from 'react'
import Slider from 'react-slick'
import LandlordCard from './LandlordCard'
import { Link } from 'react-router-dom';
function Homepage() {
    const [landlords, setLandlords] = useState([]);  // State to store landlords data
    const [loading, setLoading] = useState(true);  // State to track loading state
    const [error, setError] = useState(null);  // State to track errors

    useEffect(() => {
        // Async function to fetch landlord data
        const fetchLandlords = async () => {
          try {
            const response = await fetch('/api/landlords'); // Replace with your backend API
            if (!response.ok) {
              throw new Error('Failed to fetch landlords');
            }
            const data = await response.json();
    
            // Sort the landlords by rating (ascending) and take the first 10
            const sortedLandlords = data
              .sort((a, b) => a.rating - b.rating)
              .slice(0, 10);
            
            setLandlords(sortedLandlords);  // Store the sorted data in state
          } catch (err) {
            setError(err.message);  // Handle errors
          } finally {
            setLoading(false);  // Set loading to false after the fetch completes
          }
        };
    
        fetchLandlords();  // Call the async function
      }, []);  // Empty dependency array means it runs once when the component mounts
    
      // If loading, show a loading spinner or message
      if (loading) {
        return <div>Loading...</div>;
      }
    
      // If there's an error, display an error message
      if (error) {
        return <div>Error: {error}</div>;
      }
    
      // Slick carousel settings
      const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,  // Number of items to show at once
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 768,  // For small screens
            settings: {
              slidesToShow: 1, // Show 1 item per slide on small screens
              slidesToScroll: 1
            }
          }
        ]
      };
  return (
    <>
    {/* Carousel of ten worst landlords */}
    <div className="landlord-carousel">
      <h2>Landlords with the Lowest Ratings</h2>
      <Slider {...settings}>
        {landlords.map((landlord) => (
          <div key={landlord.id}>
            <LandlordCard landlord={landlord} />
          </div>
        ))}
      </Slider>
    </div>
    {/* button for routing to LoginPage */}
    <Link to = '/login'>
    <button>Login</button>
    </Link>
    {/* button for routing to SignUpPage */}
    <Link to = '/signup'>
    <button>Sign Up</button>
    </Link>
    </>
  )
}

export default Homepage