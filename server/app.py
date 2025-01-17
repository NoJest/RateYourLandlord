#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, jsonify
from flask_restful import Resource
from werkzeug.exceptions import BadRequest
from sqlalchemy.exc import IntegrityError
import re, datetime
from datetime import date 
import openai 
# Local imports
from config import app, db
from models import db, User, Landlord, Rating, Lease, Property , Issue
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
        landlord_list = [{
            "id": l.id, 
            "name": l.name, 
            "rating": l.get_average_rating(),
            "rating_count": l.get_rating_count(),
            "issues": [issue.to_dict() for issue in l.issues]  # Include issues
        } for l in landlords]
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
            return jsonify({"message": "userId  is required"}), 400

        ratings = Rating.query.filter_by(user_id=user_id).all()
        if not ratings:
            return jsonify({"message": "No ratings found for this user."}), 404
        
        landlord_list = [{
            "id": rating.landlord.id if rating.landlord else None,
            "name": rating.landlord.name if rating.landlord else "Unknown",
            "rating": rating.landlord.get_average_rating() if rating.landlord else None,
            "rating_count": rating.landlord.get_rating_count() if rating.landlord else 0,
            "issues": [issue.to_dict() for issue in rating.landlord.issues] if rating.landlord and rating.landlord.issues else [],
            "image_url": rating.landlord.image_url if rating.landlord else None
        } for rating in ratings]
        
        return jsonify(landlord_list), 200

    except Exception as e:
        return jsonify({"message": f"Error fetching associated landlords: {str(e)}"}), 500
    
@app.route('/api/landlords/<int:id>', methods=['GET'])
def get_landlord(id):
    try:
        landlord = Landlord.query.get(id)  # Query the database for the landlord by ID
        if landlord:
            # Get the average rating and rating count 
            average_rating = landlord.get_average_rating()
            rating_count = landlord.get_rating_count()
            # Serialize the properties using to_dict() 
            properties = [property.to_dict() for property in landlord.properties] if landlord.properties else 'No properties available'
            return jsonify({
                'id': landlord.id,
                'name': landlord.name,
                'average_rating': average_rating,  
                'rating_count': rating_count,  
                'image_url': landlord.image_url, 
                'issues': [issue.to_dict() for issue in landlord.issues],
                'properties': [property.to_dict() for property in landlord.properties]
            })
        else:
            return jsonify({'message': 'Landlord not found'}), 404
    except Exception as e:
        # Log the error for debugging
        print(f"Error fetching landlord {id}: {str(e)}")
        return jsonify({'message': f"Error fetching landlord: {str(e)}"}), 500
@app.route('/api/issues', methods=['POST'])
def create_issue():
    try:
        data = request.json
        description = data.get('description')
        landlord_id = data.get('landlord_id')

        if not description or len(description) < 10:
            return jsonify({'error': 'Description must be at least 10 characters long'}), 400
        if not landlord_id:
            return jsonify({'error': 'landlord_id is required'}), 400

        new_issue = Issue(
            description=description,
            landlord_id=landlord_id,
            date_reported=datetime.date.today(),
        )
        db.session.add(new_issue)
        db.session.commit()

        return jsonify(new_issue.to_dict()), 201
    except Exception as e:
        app.logger.error(f"Error creating issue: {str(e)}")
        return jsonify({'error': f"Server error: {str(e)}"}), 500
@app.route('/api/issues/<int:landlord_id>', methods=['GET'])
def get_issues_for_landlord(landlord_id):
    try:
        issues = Issue.query.filter_by(landlord_id=landlord_id).all()
        if not issues:
            return jsonify({"message": "No issues found for this landlord."}), 404
        return jsonify([issue.to_dict() for issue in issues]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
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
        rating=data.get('rating'),
        landlord_id=data.get('landlord_id'),
        user_id=data.get('user_id'),  # Ensure user_id is sent from frontend, default to None if not provided by the user.
    )
    
    # Add to the database
    db.session.add(new_rating)
    db.session.commit()

    return jsonify(new_rating.to_dict()), 201  # Send back the created rating as a response


##open ai 
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message")

    if not user_message.strip():
        return jsonify({"error": "Message cannot be empty"}), 400
    if len(user_message) > 1000:
        return jsonify({"error": "Message exceeds maximum length"}), 400

    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant for tenant-landlord disputes."},
                {"role": "user", "content": user_message},
            ]
        )
        reply = response['choices'][0]['message']['content']
        return jsonify({"reply": reply})
    except openai.error.OpenAIError as e:
        return jsonify({"error": f"OpenAI API error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(port=5555, debug=True)

