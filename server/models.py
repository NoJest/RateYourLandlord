from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import date 
from sqlalchemy.orm import validates
from config import db, bcrypt
import re, datetime
# --- USERS --- #
class User(db.Model, SerializerMixin):

    __tablename__ = 'users_table'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique = True, nullable = False)
    username = db.Column(db.String, unique=True, nullable= False)
    password_hash = db.Column(db.String)

    ##--relationships--#
    ratings = db.relationship('Rating', back_populates = "user")
    leases = db.relationship('Lease', back_populates = "user")
    ##--associations--#
    landlords = association_proxy('ratings','landlord')
    properties = association_proxy('leases', 'property')
    ##--serializing--#
    serialize_rules = ("-ratings.user",'landlords', "-password_hash", "-leases.user", "properties")

    @property
    def password(self): # we will not let users see their password
        raise Exception("NOPE! No seeing your password")
    
    @password.setter
    def password(self, value): # ...but they can set their encrypted password
        self.password_hash = bcrypt.generate_password_hash(value).decode('utf-8')
    def authenticate(self, user_password):
        return bcrypt.check_password_hash(self.password_hash, user_password)
    
    ##--validations--## 
    # @validates('password')
    # def validate_password(self, key, password):
    # # Password must be at least 8 characters long and include at least one number, one uppercase letter, and one special character
    #     if len(password) < 8:
    #         raise ValueError("Password must be at least 8 characters long")
    #     if not re.search(r"[A-Z]", password):
    #         raise ValueError("Password must contain at least one uppercase letter")
    #     if not re.search(r"\d", password):
    #         raise ValueError("Password must contain at least one number")
    #     if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
    #         raise ValueError("Password must contain at least one special character")
    #     return password
    
    
    @validates('email')
    def validate_email(self, key, email):
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            raise ValueError("Email address is already taken")
        if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email):
            raise ValueError("Invalid email format")
        return email    
#-- Rating --#
class Rating(db.Model, SerializerMixin):

    __tablename__= 'ratings_table'

    id = db.Column(db.Integer, primary_key = True )
    rating = db.Column (db.Integer, unique=True, nullable= False)
    
    #Foreign Keys 
    user_id = db.Column (db.Integer, db. ForeignKey('users_table.id'))
    landlord_id = db.Column (db.Integer, db. ForeignKey('landlords_table.id'))
    #--relationships--#
    user= db.relationship('User', back_populates="ratings")
    landlord= db.relationship('Landlord', back_populates='ratings')
    #--associations--#
    #--serializing--#
    serialize_rules = ("-landlord.ratings", "-user.ratings")
    #--validations--## 
#-- Landlord --#
class Landlord(db.Model, SerializerMixin):

    __tablename__= 'landlords_table'

    id = db.Column(db.Integer, primary_key = True )
    name= db.Column (db.String, unique=True, nullable= False)
    issues= db.Column (db.String, unique=False, nullable= True)
    image_url= db.Column (db.String, unique=True, nullable= True)
    
    #--relationships--#
    ratings = db.relationship('Rating', back_populates = "landlord")
    properties = db.relationship('Property', back_populates = "landlord")
    #--associations--#
    #--serializing--#
    serialize_rules = ("-ratings.landlord",'ratings', '-properties.landlord', "properties")
    #--validations--## 
#-- Lease --#
class Lease(db.Model, SerializerMixin):

    __tablename__= 'leases_table'

    id = db.Column(db.Integer, primary_key = True )
    start_date= db.Column (db.Date, nullable= False)
    end_date = db.Column (db.Date, nullable = True )
    
    #Foreign Keys 
    user_id = db.Column (db.Integer, db. ForeignKey('users_table.id'))
    property_id = db.Column (db.Integer, db. ForeignKey('properties_table.id'))    
    #--relationships--#
    user= db.relationship('User', back_populates="leases")
    property= db.relationship('Property', back_populates='leases')
    #--associations--#
    #--serializing--#
    serialize_rules = ("-user.leases",'user', '-properties.leases', "properties")
    #--validations--## 
#-- Property --#
class Property(db.Model, SerializerMixin):

    __tablename__= 'properties_table'

    id = db.Column(db.Integer, primary_key = True )
    llc= db.Column (db.String, unique=True, nullable= True)
    property_management= db.Column (db.String, unique=True, nullable= True)
    street_number= db.Column (db.Integer, unique=False, nullable= False)
    street_name= db.Column (db.String, unique=False, nullable= False)
    apartment_number= db.Column (db.Integer, unique=False, nullable= True)
    zip_code = db.Column (db.Integer, unique= False, nullable = False)
      #Foreign Keys 
    landlord_id = db.Column (db.Integer, db. ForeignKey('landlords_table.id'))
    #--relationships--#
    landlord = db.relationship('Landlord', back_populates="properties")
    leases = db.relationship('Lease', back_populates='properties')
    #--associations--#
    #--serializing--#
    serialize_rules = ("-landlords.properties", "-leases.properties", "landlords", "leases")
    #--validations--## 