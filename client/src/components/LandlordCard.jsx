import React from 'react'

function LandlordCard({ landlord }) {
 

  return (
    <div>
        <img src={landlord.image} alt={landlord.name} />
        <h3>{landlord.ratings}</h3>
        {/* add logic to make it average rating */}
        <h3>{landlord.name}</h3>
        <p>{landlord.issues}</p>
        <p>{landlord.properties}</p>
        {/* might be doing the below ones wrong */}
       <PropertyCard></PropertyCard>
    </div>
  )
}

export default LandlordCard

   
__tablename__= "landlords_table"
    

// __tablename__= 'landlords_table'

// id = db.Column(db.Integer, primary_key = True )
// name= db.Column (db.String, unique=True, nullable= False)
// issues= db.Column (db.String, unique=False, nullable= True)
// image_url= db.Column (db.String, unique=True, nullable= True)

// #--relationships--#
// ratings = db.relationship('Rating', back_populates = "landlord")
// properties = db.relationship('Property', back_populates = "landlord")