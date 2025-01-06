import React from 'react'
import { useNavigate } from 'react-router-dom'; 

function LandlordCard({ landlord }) {
    const navigate = useNavigate();

    // Handle click to navigate to the specific landlord's page
  const handleCardClick = () => {
    navigate(`/landlord/${landlord.id}`);  // Navigate to the landlord's page using their id
  };
  return (
    <div className="landlord-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {/* Displaying landlord information */}
      <img src={landlord.image} alt={landlord.name} />
      <h3>{landlord.ratings}</h3> {/* Add logic for displaying average rating */}
      <h3>{landlord.name}</h3>
      <p>{landlord.issues}</p>
      <p>{landlord.properties}</p>
      {/* Potentially another card here */}
      {/* <PropertyCard></PropertyCard> */}
    </div>
  );
}

export default LandlordCard;

