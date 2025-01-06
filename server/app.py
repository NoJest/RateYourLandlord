#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource
from werkzeug.exceptions import BadRequest
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
from models import db, User
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
        return user.to_dict(), 202
    else: 
        return {"error": "invalid username or password"}, 401
    
@app.delete('/api/logout')
def logout():
    session.pop('user_id')
    return {}, 204


if __name__ == '__main__':
    app.run(port=5555, debug=True)

