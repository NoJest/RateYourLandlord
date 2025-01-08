import React, { useState, useEffect } from 'react';
import Slider from 'react-slick'; // Slick carousel for displaying landlords
import LandlordCard from './LandlordCard'; // Assuming you have this LandlordCard component
import './Searchpage.css'; // Assuming you have styles for the page
import HomeButton from './HomeButton';
const Searchpage = () => {
  const [landlords, setLandlords] = useState([]);  // State to store the landlords
  const [filteredLandlords, setFilteredLandlords] = useState([]);  // State for filtered landlords
  const [loading, setLoading] = useState(true);  // Loading state
  const [nameFilter, setNameFilter] = useState('');  // State for name filter
  const [streetNameFilter, setStreetNameFilter] = useState('');  // State for street name filter
  const [streetNumberFilter, setStreetNumberFilter] = useState('');  // State for street number filter
  const [apartmentNumberFilter, setApartmentNumberFilter] = useState('');  // State for apartment number filter

  // Fetch landlords sorted by rating when the component mounts
  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const response = await fetch('/api/landlords');  // Adjust the API endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch landlords');
        }
        const data = await response.json();
        // Sort by rating (ascending) to get the worst rated landlords first
        const sortedLandlords = data
          .sort((a, b) => a.rating - b.rating)
          .slice(0, 10);  // You can adjust the number of landlords you want to show

        setLandlords(sortedLandlords);  // Store the sorted data
        setFilteredLandlords(sortedLandlords);  // Initially, show all landlords
      } catch (err) {
        console.error('Failed to fetch landlords:', err);
      } finally {
        setLoading(false);  // Set loading to false when done
      }
    };

    fetchLandlords();
  }, []);

  // Slick carousel settings
  const carouselSettings = {
    dots: false,
    infinite: false,
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

  // Handle filter changes
  const handleNameChange = (e) => setNameFilter(e.target.value);
  const handleStreetNameChange = (e) => setStreetNameFilter(e.target.value);
  const handleStreetNumberChange = (e) => setStreetNumberFilter(e.target.value);
  const handleApartmentNumberChange = (e) => setApartmentNumberFilter(e.target.value);

  // Apply filters to the landlords list
  const applyFilters = () => {
    let filtered = landlords;

    // Filter by name if provided
    if (nameFilter) {
      filtered = filtered.filter((landlord) =>
        landlord.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Filter by street name if provided
    if (streetNameFilter) {
      filtered = filtered.filter((landlord) =>
        landlord.property.streetName.toLowerCase().includes(streetNameFilter.toLowerCase())
      );
    }

    // Filter by street number if provided
    if (streetNumberFilter) {
      filtered = filtered.filter((landlord) =>
        landlord.property.streetNumber.includes(streetNumberFilter)
      );
    }

    // Filter by apartment number if provided
    if (apartmentNumberFilter) {
      filtered = filtered.filter((landlord) =>
        landlord.property.apartmentNumber.includes(apartmentNumberFilter)
      );
    }
    setFilteredLandlords(filtered);  // Set the filtered landlords
  };

  // Loading state and UI rendering
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="searchpage-container">
      <h2>Landlords with the Worst Ratings</h2>

      {/* Carousel of landlords sorted by rating */}
      <div className="carousel-container">
        <Slider {...carouselSettings}>
          {filteredLandlords.map((landlord) => (
            <div key={landlord.id}>
              <LandlordCard landlord={landlord} />
            </div>
          ))}
        </Slider>
      </div>
      <HomeButton></HomeButton>
      {/* Filters */}
      <div className="filter-section">
        <h3>Filter Landlords</h3>

        {/* Name filter form */}
        <div className="filter-form">
          <label htmlFor="name-filter">Landlord Name:</label>
          <input
            type="text"
            id="name-filter"
            value={nameFilter}
            onChange={handleNameChange}
            placeholder="Enter landlord name"
          />
        </div>

        {/* Property filter form */}
        <div className="property-filter">
          <h4>Filter by Property</h4>

          {/* Street Name filter */}
          <div className="filter-form">
            <label htmlFor="street-name-filter">Street Name:</label>
            <input
              type="text"
              id="street-name-filter"
              value={streetNameFilter}
              onChange={handleStreetNameChange}
              placeholder="Enter street name"
            />
          </div>

          {/* Street Number filter */}
          <div className="filter-form">
            <label htmlFor="street-number-filter">Street Number:</label>
            <input
              type="text"
              id="street-number-filter"
              value={streetNumberFilter}
              onChange={handleStreetNumberChange}
              placeholder="Enter street number"
            />
          </div>

          {/* Apartment Number filter */}
          <div className="filter-form">
            <label htmlFor="apartment-number-filter">Apartment Number:</label>
            <input
              type="text"
              id="apartment-number-filter"
              value={apartmentNumberFilter}
              onChange={handleApartmentNumberChange}
              placeholder="Enter apartment number"
            />
          </div>
        </div>

        {/* Apply Filters button */}
        <button onClick={applyFilters}>Apply Filters</button>
      </div>
    </div>
  );
};

export default Searchpage;

