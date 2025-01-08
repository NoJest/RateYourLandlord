import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import HomeButton from './HomeButton';

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
      <h2>{landlord.name}</h2>
      <img src={landlord.image_url} alt={landlord.name} />
      <div>
        {Array.isArray(landlord.ratings) && landlord.ratings.length > 0 ? (
          landlord.ratings.map((rating, index) => (
            <div key={index}>
              {/* Ensure you are rendering a valid value (e.g., rating.rating or rating itself) */}
              <strong>Rating: {rating.rating}</strong>
            </div>
          ))
        ) : (
          <span>No ratings available</span>
        )}
      </div>
      <p><strong>Issues:</strong> {landlord.issues}</p>
      {/* <p><strong>Properties:</strong> {landlord.properties}</p> */}
      {/* You can add more details or sections here */}
      <HomeButton />  
    </div>
  );
};

export default LandlordPage;
