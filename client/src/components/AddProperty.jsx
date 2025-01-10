import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeButton from './Buttons/HomeButton';

const AddProperty = () => {
    
  const { id } = useParams(); // Get landlord ID from the URL
 
  const navigate = useNavigate(); // Used for navigation after form submission

  // Local state for the form fields
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [llc, setLlc] = useState('');
  const [propertyManagement, setPropertyManagement] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');


  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Assuming 'currentUser' is stored as an object
    if (currentUser && currentUser.id) {
      setUserId(currentUser.id); // Set the userId from the logged-in user's data
    } else {
      setErrorMessage('You must be logged in to add a property.');
    }
  }, []); 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
        setErrorMessage('You must be logged in to add a property.');
        return;
      }
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartment_number: apartmentNumber,
          street_number: streetNumber,
          street_name: streetName,
          zip_code: zipCode,
          llc,
          property_management: propertyManagement,
          landlord_id: id, // Include landlord ID to associate the property
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create property');
      }

      // On success, navigate back to the landlord page (or wherever appropriate)
      navigate(`/landlord/${id}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <HomeButton></HomeButton>
      <h2>Add New Property</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Apartment Number:
            <input
              type="text"
              value={apartmentNumber}
              onChange={(e) => setApartmentNumber(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Street Number:
            <input
              type="text"
              value={streetNumber}
              onChange={(e) => setStreetNumber(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Street Name:
            <input
              type="text"
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Zip Code:
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            LLC (Optional):
            <input
              type="text"
              value={llc}
              onChange={(e) => setLlc(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Property Management (Optional):
            <input
              type="text"
              value={propertyManagement}
              onChange={(e) => setPropertyManagement(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Add Property</button>
      </form>
    </div>
  );
};

export default AddProperty;