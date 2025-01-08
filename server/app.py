#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, jsonify
from flask_restful import Resource
from werkzeug.exceptions import BadRequest
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db
from models import db, User, Landlord, Rating, Lease, Property 
# Add your model imports

@app.route('/')
def index():
    return '<h1>RATE YO LORD PEASANT!</h1>'

#authentication and user login
@app.post('/api/users')
def create_user():
    data = request.json
    required_fields = ['email','username','password']
    for field in required_fields:
        if field not in data:
            return {"error": f"missing required field: {field}"}, 400
    try:
        new_user = User(
            email=data['email'],
            username = data ['username'],
            password = data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id  
        return new_user.to_dict(rules=("-password_hash",)), 201
    
    except IntegrityError as e:
        db.session.rollback()  # Rollback the session in case of error
        # Handle duplicate email or phone errors
        if 'email' in str(e.orig) or 'phone' in str(e.orig):
            return {'error': 'Email or phone number already in use.'}, 400
        return {'error': str(e.orig)}, 400

    except BadRequest as e:
        # Handle invalid JSON or malformed requests
        return {'error': 'Bad request. Please check your input.'}, 400
    
    except Exception as e:
        return { 'error': str(e) }, 400

@app.get('/api/check_session')
def check_session():
    user_id = session.get("user_id")
    user = User.query.where(User.id == user_id).first()
    if user:
        return user.to_dict(), 200
    else:
        return {}, 204
    
@app.post('/api/login')
def login():
    data = request.json 
    user = User.query.where(User.username == data.get('username')).first()
    if user and user.authenticate(data.get('password')):
        session['user_id'] = user.id
        print(f"Session ID after login: {session.get('user_id')}")  # Debugging line
        return user.to_dict(), 202
    else: 
        return {"error": "invalid username or password"}, 401
    
@app.delete('/api/logout')
def logout():
    session.pop('user_id')
    return {}, 204

@app.route('/api/landlords', methods=['GET'])
def get_landlords():
    try:
        # Query all landlords from the database
        landlords = Landlord.query.all()

        # Prepare a list of landlords
        landlord_list = [{"id": l.id, "name": l.name, "rating": l.get_average_rating()} for l in landlords]
        return jsonify(landlord_list), 200
    except Exception as e:
        print(f"Error fetching landlords: {str(e)}")  # Debugging line
        return jsonify({"message": f"Error fetching landlords: {str(e)}"}), 500

# Route to fetch landlords associated with a specific user
@app.route('/api/landlords', methods=['POST'])
def create_landlord():
    data = request.get_json()
    
    # Validate data (basic checks for required fields)
    if not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Create the landlord
        new_landlord = Landlord(
            name=data.get('name'),
            image_url=data.get('image_url'),
            issues=data.get('issues', None),
        )
        
        # Add to the database
        db.session.add(new_landlord)
        db.session.commit()

        return jsonify(new_landlord.to_dict()), 201  # Respond with the created landlord
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/landlords/associated', methods=['GET'])
def get_associated_landlords():
    try:
        # Get userId from query parameter
        user_id = request.args.get('userId')

        if not user_id:
            return jsonify({"message": "userId parameter is required"}), 400

        ratings = Rating.query.filter_by(user_id=user_id).all()
        
        # if not ratings:
        #     return jsonify({"message": "No ratings found for this user."}), 404
        # Query landlords associated with the specific userId
        landlords = [rating.landlord for rating in ratings]
        # if not landlords:
        #     return jsonify({"message": "No landlords found for this user."}), 404
        
        

        # Prepare the landlord data to return
        landlord_list = [{"id": l.id, "name": l.name, "rating": l.rating} for l in landlords]
        return jsonify(landlord_list), 200

    except Exception as e:
        return jsonify({"message": f"Error fetching associated landlords: {str(e)}"}), 500
    
@app.route('/api/landlords/<int:id>', methods=['GET'])
def get_landlord(id):
    try:
        landlord = Landlord.query.get(id)  # Query the database for the landlord by ID
        if landlord:
             # Serialize the ratings using to_dict() 
            ratings = [rating.to_dict() for rating in landlord.ratings] if landlord.ratings else 'No ratings available'
            # Serialize the properties using to_dict() 
            properties = [property.to_dict() for property in landlord.properties] if landlord.properties else 'No properties available'
            return jsonify({
                'id': landlord.id,
                'name': landlord.name,
                'ratings': ratings,  # Default if ratings are None
                'image_url': landlord.image_url or 'No image available',  # Default if image is None
                'issues': landlord.issues or 'No issues available',  # Default if issues are None
                'properties': properties # Default if properties is None
            })
        else:
            return jsonify({'message': 'Landlord not found'}), 404
    except Exception as e:
        # Log the error for debugging
        print(f"Error fetching landlord {id}: {str(e)}")
        return jsonify({'message': f"Error fetching landlord: {str(e)}"}), 500

@app.route('/api/properties', methods=['POST'])
def create_property():
    data = request.get_json()
    
    # Validate the property data
    if not data.get('street_number') or not data.get('street_name') or not data.get('zip_code'):
        return jsonify({'error': 'Missing required property fields'}), 400

    # Create a new property and associate it with the landlord
    new_property = Property(
        llc=data.get('llc', None),
        property_management=data.get('property_management', None),
        street_number=data['street_number'],
        street_name=data['street_name'],
        apartment_number=data.get('apartment_number', None),
        zip_code=data['zip_code'],
        landlord_id=data['landlord_id'],  # Ensure landlord_id is sent from frontend
    )
    
    # Add to the database
    db.session.add(new_property)
    db.session.commit()

    return jsonify(new_property.to_dict()), 201  # Send back the created property as a response
@app.route('/api/ratings', methods=['POST'])
def create_rating():
    data = request.get_json()
    
    # Validate the rating data
    if not data.get('rating') or not data.get('landlord_id'):
        return jsonify({'error': 'Missing required fields'}), 400

    # Create a new rating for the landlord
    new_rating = Rating(
        rating=data['rating'],
        landlord_id=data['landlord_id'],
    )
    
    # Add to the database
    db.session.add(new_rating)
    db.session.commit()

    return jsonify(new_rating.to_dict()), 201  # Send back the created rating as a response


if __name__ == '__main__':
    app.run(port=5555, debug=True)

