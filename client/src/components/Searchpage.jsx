import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // ShadCN carousel
import { Button } from "@/components/ui/button"; // ShadCN button
import { Input } from "@/components/ui/input"; // ShadCN input
import LandlordCard from './LandlordCard'; // Assuming you have this LandlordCard component
import HomeButton from './Buttons/HomeButton';

const Searchpage = () => {
  const [landlords, setLandlords] = useState([]);
  const [filteredLandlords, setFilteredLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [streetNameFilter, setStreetNameFilter] = useState('');
  const [streetNumberFilter, setStreetNumberFilter] = useState('');
  const [apartmentNumberFilter, setApartmentNumberFilter] = useState('');

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const response = await fetch('/api/landlords');
        if (!response.ok) throw new Error('Failed to fetch landlords');

        const data = await response.json();

        // Sort landlords by rating and limit to the first 10
        const sortedLandlords = data.sort((a, b) => a.rating - b.rating);
        setLandlords(sortedLandlords);
        setFilteredLandlords(sortedLandlords);
      } catch (err) {
        console.error('Failed to fetch landlords:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlords();
  }, []);

  const applyFilters = () => {
    let filtered = landlords;

    if (nameFilter) {
      filtered = filtered.filter((landlord) =>
        landlord.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (streetNameFilter) {
      filtered = filtered.filter((landlord) =>
        landlord.properties.some((property) =>
          property.street_name?.toLowerCase().includes(streetNameFilter.toLowerCase())
        )
      );
    }
  
    if (streetNumberFilter) {
      filtered = filtered.filter((landlord) =>
        landlord.properties.some((property) =>
          String(property.street_number).includes(streetNumberFilter)
        )
      );
    }
  
    if (apartmentNumberFilter) {
      filtered = filtered.filter((landlord) =>
        landlord.properties.some((property) =>
          String(property.apartment_number).includes(apartmentNumberFilter)
        )
      );
    }
  
    setFilteredLandlords(filtered);
  };
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mt-8 text-center">
        <HomeButton />
      </div>
      <h2 className="text-2xl font-semibold mb-6 text-center"> {`Landlords Found: ${filteredLandlords.length} out of ${landlords.length}`}</h2>

      {/* Carousel of landlords */}
      <div className="mb-8">
        {filteredLandlords.length > 0 ? (
          <Carousel className="w-full max-w-3xl mx-auto">
            <CarouselContent>
              {filteredLandlords.map((landlord) => (
                <CarouselItem key={landlord.id}>
                  <LandlordCard landlord={landlord} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-gray-500 text-center">No landlords found.</p>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Filter Landlords</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="text"
            placeholder="Landlord Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Street Name"
            value={streetNameFilter}
            onChange={(e) => setStreetNameFilter(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Street Number"
            value={streetNumberFilter}
            onChange={(e) => setStreetNumberFilter(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Apartment Number"
            value={apartmentNumberFilter}
            onChange={(e) => setApartmentNumberFilter(e.target.value)}
          />
        </div>

        <Button onClick={applyFilters} className="w-full sm:w-auto">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default Searchpage;

