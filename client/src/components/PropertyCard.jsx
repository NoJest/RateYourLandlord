import React from 'react'

function PropertyCard({ landlord }) {
  return (
    <div>
        <p>{landlord.property.lcc}</p>
        <p>{landlord.property.mgmt}</p>
        <p>{landlord.property.address}</p>
    </div>
  )
}

export default PropertyCard