import React, { useState, useContext } from 'react';
import { UserContext } from '../App';
import HomeButton from './Buttons/HomeButton';

const AddLandlord = () => {
  const [name, setName] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [issues, setIssues] = useState('');
  const [rating, setRating] = useState('');
  const [llc, setLlc] = useState('');
  const [propertyManagement, setPropertyManagement] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const { currentUser, setCurrentUser } = useContext(UserContext); // Get the current user
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

     // Validate required fields
  if (!name || !rating || !streetNumber || !streetName || !zipCode) {
    alert("Please fill in all required fields!");
    return;
  }

    const landlordData = {
      name,
      image_url,
      issues,
      ratings: parseInt(rating), // Ensure it's an integer
    };

    const propertyData = {
      llc,
      property_management: propertyManagement,
      street_number: parseInt(streetNumber), // Ensure it's an integer
      street_name: streetName,
      apartment_number: apartmentNumber ? parseInt(apartmentNumber) : null, // Optional
      zip_code: parseInt(zipCode), // Ensure it's an integer
    };
    
    const userId= currentUser ? currentUser.id : null;
    if (!userId) {
        alert('Please log in to add a new landlord');
        return;
    }
    // POST requests to create a new landlord and associated property
    try {
      // Step 1: Create the landlord
      const landlordResponse = await fetch('/api/landlords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...landlordData,
             user_id:userId,
        }),
      });
     

      if (!landlordResponse.ok) {
        throw new Error('Failed to create landlord');
      }
      const landlord = await landlordResponse.json(); // Get the created landlord (with ID)

      // Step 2: Create the property and associate it with the landlord
      const propertyResponse = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...propertyData,
          landlord_id: landlord.id, // Link the property to the created landlord
        }),
      });

      if (!propertyResponse.ok) {
        throw new Error('Failed to create property');
      }
      const property = await propertyResponse.json(); // Get the created property (with ID)

      // Optional: Step 3: Create a rating for the landlord (if needed)
      const ratingData = {
        rating: parseInt(rating),
        landlord_id: landlord.id,
        user_id: userId,
      };

      const ratingResponse = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });

      if (!ratingResponse.ok) {
        throw new Error('Failed to create rating');
      }

      // If everything is successful, reset the form
      alert('Landlord and property added successfully!');
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Error adding landlord and property');
    }
  };

  // Reset form inputs after successful submission
  const resetForm = () => {
    setName('');
    setImageUrl('');
    setIssues('');
    setRating('');
    setLlc('');
    setPropertyManagement('');
    setStreetNumber('');
    setStreetName('');
    setApartmentNumber('');
    setZipCode('');
  };

  return (
    <div className="add-landlord">
      <HomeButton />
      <h2>Add a New Landlord</h2>
      <form onSubmit={handleSubmit}>
        {/* Landlord Information */}
        <div className="form-group">
          <label htmlFor="name">Landlord Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image_url">Image URL</label>
          <input
            type="text"
            id="image_url"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>

        {/* Property Information */}
        <div className="form-group">
          <label htmlFor="llc">LLC</label>
          <input
            type="text"
            id="llc"
            value={llc}
            onChange={(e) => setLlc(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="property_management">Property Management</label>
          <input
            type="text"
            id="property_management"
            value={propertyManagement}
            onChange={(e) => setPropertyManagement(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="street_number">Street Number</label>
          <input
            type="text"
            id="street_number"
            value={streetNumber}
            onChange={(e) => setStreetNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="street_name">Street Name</label>
          <input
            type="text"
            id="street_name"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apartment_number">Apartment Number (Optional)</label>
          <input
            type="text"
            id="apartment_number"
            value={apartmentNumber}
            onChange={(e) => setApartmentNumber(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="zip_code">Zip Code</label>
          <input
            type="text"
            id="zip_code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="issues">Issues</label>
          <textarea
            id="issues"
            value={issues}
            onChange={(e) => setIssues(e.target.value)}
          ></textarea>
        </div>
        
        <button type="submit">Add Landlord</button>
      </form>
    </div>
  );
};

export default AddLandlord;
