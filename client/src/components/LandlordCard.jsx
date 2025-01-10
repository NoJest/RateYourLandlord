import React from 'react'
import { useNavigate } from 'react-router-dom'; 
import './LandlordCard.css'; // Assuming you have styles for the page
function LandlordCard({ landlord }) {
    const navigate = useNavigate();

    const defaultImageUrl = 'https://t3.ftcdn.net/jpg/08/57/80/96/360_F_857809650_hY4uYlIKOSKu8hela7K2sj4KPbILsNl5.jpg'

    // Handle click to navigate to the specific landlord's page
  const handleCardClick = () => {
    navigate(`/landlord/${landlord.id}`);  // Navigate to the landlord's page using their id
  };

  // const calculateAverageRating = (ratings) => {
  //   if (Array.isArray(ratings) && ratings.length > 0) {
  //     const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);  // Assuming each rating is an object with a "rating" property
  //     return (total / ratings.length).toFixed(1);  // Return the average rating rounded to 1 decimal place
  //   }
  //   return 'N/A';  // Return 'N/A' if no ratings
  // };
  return (
    <div className="landlord-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {/* Displaying landlord information */}
      <img src={landlord.image_url || defaultImageUrl}
      alt={landlord.name} />
      <h3>Name: {landlord.name}</h3>
      <h3>Rating: {landlord.rating}(<span>{landlord.rating_count}</span>)</h3>
      <p> Click to learn more about this Landlord</p>
      {/* <p>Complaints: {landlord.issues}</p> */}
      {/* <p>{landlord.properties}</p> */}
      {/* Potentially another card here */}
      {/* <PropertyCard></PropertyCard> */}
    </div>
  );
}

export default LandlordCard;

