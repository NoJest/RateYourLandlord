import React from 'react'

function PropertyCard({ landlord }) {
  return (
    <div className="property-card">
      <p>Address:{landlord.apartment_number} {landlord.street_number} {landlord.street_name} {landlord.zip_code}</p>
      <p>Property Management Company:{landlord.property_management}</p>
      <p>LLC associated with property:{landlord.llc}</p>
    </div>
  );
}

//     <div>
//         <p>{landlord.property.lcc}</p>
//         <p>{landlord.property.mgmt}</p>
//         <p>{landlord.property.apartmentent_number} {landlord.property.street_number} {landlord.property.street_name} {landlord.property.zipcode}</p>
//     </div>
//   )
// }

export default PropertyCard