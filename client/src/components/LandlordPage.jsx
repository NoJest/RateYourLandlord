import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import HomeButton from './Buttons/HomeButton';
import Slider from 'react-slick'; // Import the carousel component
import PropertyCard from './PropertyCard'; // Import PropertyCard component
import AddPropertyButton from './Buttons/AddPropertyButton';
import AddRatingButton from './Buttons/AddRatingButton';
import AddIssueButton from './Buttons/AddIssueButton';
import './LandlordPage.css';

const defaultImageUrl = 'https://t3.ftcdn.net/jpg/08/57/80/96/360_F_857809650_hY4uYlIKOSKu8hela7K2sj4KPbILsNl5.jpg'

// Settings for the carousel
const carouselSettings = {
  dots: false, // Show dots for navigation
  infinite: false, // Infinite loop
  speed: 500,
  slidesToShow: 1, // Show one property at a time
  slidesToScroll: 1, // Scroll one property at a time
  autoplay: true, // Autoplay
  autoplaySpeed: 3000, // Speed of autoplay
};
const LandlordPage = () => {
  const { id } = useParams();  // Get the landlord id from the URL
  const [landlord, setLandlord] = useState(null);  // State to store landlord data
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await fetch(`/api/landlords/${id}`);  // Fetch landlord data from the API
        const data = await response.json();
        setLandlord(data);  // Set the fetched data to state
      } catch (err) {
        console.error('Failed to fetch landlord details:', err);
      } finally {
        setLoading(false);  // Set loading to false once data is fetched
      }
    };

    fetchLandlord();  // Call the fetch function when the component mounts
  }, [id]);  // Run effect when the id parameter changes

  // Show loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }
  // Show the landlord details once data is fetched
  
  return (
    <div className="landlord-detail">
      <HomeButton />  
      <div className="landlord-card-container">
        <h2>{landlord.name}</h2>
        <img src={landlord.image_url || defaultImageUrl}
         alt={landlord.name} />
      {/* Display the average rating */}
        <div>
          {landlord.average_rating ? (
           <div>
             <strong>Average Rating: {landlord.average_rating}({landlord.rating_count})</strong>
           </div>
         ) : (
           <span>No ratings available</span>
         )}
        </div>

        {/* Issues Carousel */}
      <h3>Reported Issues</h3>
      <div className="issues-carousel">
        {Array.isArray(landlord.issues) && landlord.issues.length > 0 ? (
          <Slider {...carouselSettings}>
            {landlord.issues.map((issue) => (
              <div key={issue.id} className="issue-card">
                <p>
                  <strong>Description:</strong> {issue.description}
                </p>
                <p>
                  <strong>Date Reported:</strong> {issue.date_reported}
                </p>
              </div>
            ))}
          </Slider>
        ) : (
          <p>No issues reported</p>
        )}
      </div>
      </div>
      {/* Property Carousel */}
      <h3>Properties</h3>
      <div className="property-carousel">
        {Array.isArray(landlord.properties) && landlord.properties.length > 0 ? (
          <Slider {...carouselSettings}>
            {landlord.properties.map((property) => (
              <div key={property.id}>
                <PropertyCard landlord={property} />  {/* Pass the property as a landlord prop */}
              </div>
            ))}
          </Slider>
        ) : (
          <p>No properties available</p>
        )}
      </div>
      
      <AddPropertyButton landlordId={id}/>
      <AddRatingButton landlordId={id}/>  
      <AddIssueButton landlordId={id}/>
    </div>
  );
};

export default LandlordPage;
