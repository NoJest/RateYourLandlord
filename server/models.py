from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import date 
from sqlalchemy.orm import validates
from config import db, bcrypt
import re, datetime
from sqlalchemy.orm import configure_mappers

# -- Lease -- #
class Lease(db.Model, SerializerMixin):
    __tablename__ = 'leases_table'

    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)

    # Foreign Keys 
    user_id = db.Column(db.Integer, db.ForeignKey('users_table.id'))
    property_id = db.Column(db.Integer, db.ForeignKey('properties_table.id'))    

    # -- relationships -- #
    user = db.relationship('User', back_populates="leases")
    property = db.relationship('Property', back_populates='leases')

    # -- serializing -- #
    serialize_rules = ("-user.leases", 'user', '-properties.leases', "properties")

    # -- validations -- #
    
    
    # Validation for end date
    @validates('end_date')
    def validate_end_date(self, key, end_date):
        if end_date and end_date < self.start_date:
            raise ValueError("End date cannot be before the start date")
        return end_date

# --- USERS --- #
class User(db.Model, SerializerMixin):
    __tablename__ = 'users_table'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String)

    ## -- relationships -- #
    ratings = db.relationship('Rating', back_populates="user")
    leases = db.relationship('Lease', back_populates="user")

    ## -- associations -- #
    landlords = association_proxy('ratings', 'landlord')  
    properties = association_proxy('leases', 'property')

    ## -- serializing -- #
    serialize_rules = ("-ratings.user", "-password_hash", "-leases.user", "properties")

    @property
    def password(self):  # we will not let users see their password
        raise Exception("NOPE! No seeing your password")

    @password.setter
    def password(self, value):  # ...but they can set their encrypted password
        self.password_hash = bcrypt.generate_password_hash(value).decode('utf-8')

    def authenticate(self, user_password):
        return bcrypt.check_password_hash(self.password_hash, user_password)

    ## -- validations -- ## 
    # @validates('password')
    # def validate_password(self, key, password):
    #     # Password must be at least 8 characters long and include at least one number, one uppercase letter, and one special character
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
    @validates('username')
    def validate_username(self, key, username):
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")
        if len(username) > 20:
            raise ValueError("Username cannot be longer than 20 characters")
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            raise ValueError("Username can only contain alphanumeric characters and underscores")
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            raise ValueError("Username is already taken")
        return username


# -- Rating -- #
class Rating(db.Model, SerializerMixin):
    __tablename__ = 'ratings_table'

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)

    # Foreign Keys 
    user_id = db.Column(db.Integer, db.ForeignKey('users_table.id'))
    landlord_id = db.Column(db.Integer, db.ForeignKey('landlords_table.id'))

    # -- relationships -- #
    user = db.relationship('User', back_populates="ratings")
    landlord = db.relationship('Landlord', back_populates='ratings')

    # -- serializing -- #
    serialize_rules = ("-landlord.ratings", "-user.ratings")

    # -- validations -- ## 
    @validates('rating')
    def validate_rating(self, key, rating):
        if rating <= 0 or rating >= 5:
            raise ValueError("Rating must be between 0 and 5")
        return rating


# -- Property -- #
class Property(db.Model, SerializerMixin):
    __tablename__ = 'properties_table'

    id = db.Column(db.Integer, primary_key=True)
    llc = db.Column(db.String, nullable=True)
    property_management = db.Column(db.String, nullable=True)
    street_number = db.Column(db.Integer, unique=False, nullable=False)
    street_name = db.Column(db.String, unique=False, nullable=False)
    apartment_number = db.Column(db.Integer, unique=False, nullable=True)
    zip_code = db.Column(db.Integer, unique=False, nullable=False)

    # Foreign Keys 
    landlord_id = db.Column(db.Integer, db.ForeignKey('landlords_table.id'))

    # -- relationships -- #
    landlord = db.relationship('Landlord', back_populates="properties")
    leases = db.relationship('Lease', back_populates='property')

    # -- serializing -- #
    serialize_rules = ("-landlord.properties", "-leases.properties", "landlord", "leases")

    # -- validations -- ## 
    @validates('zip_code')
    def validate_zip_code(self, key, zip_code):
        if len(str(zip_code)) != 5:
            raise ValueError("Zip code must be 5 digits long")
        return zip_code
    @validates('street_number')
    def validate_street_number(self, key, street_number):
        if street_number <= 0:
            raise ValueError("Street number must be a positive integer")
        return street_number

# -- Landlord -- #
class Landlord(db.Model, SerializerMixin):
    __tablename__ = 'landlords_table'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    issues = db.Column(db.String, nullable=True)
    image_url = db.Column(db.String, nullable=True)
   

    # -- relationships -- #
    ratings = db.relationship('Rating', back_populates="landlord")
    properties = db.relationship('Property', back_populates="landlord")
    

    # -- serializing -- #
    serialize_rules = ("-ratings.landlord", 'ratings', '-properties.landlord', "properties")

    # -- validations -- ## 
    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name) < 3:
            raise ValueError("Landlord name must be at least 3 characters long")
        return name

    @validates('image_url')
    def validate_image_url(self, key, image_url):
    # If image_url is empty or None, return it as is without validation
        if not image_url:
            return image_url

    # Validate the URL format if image_url is provided
        if not re.match(r'^(https?|ftp)://[^\s/$.?#].[^\s]*$', image_url):
            raise ValueError("Invalid URL format for image")
    
        return image_url

#Methods for average rating and rating_count
    def get_average_rating(self):
        # Calculate the average rating based on related ratings
        total_rating = sum(rating.rating for rating in self.ratings)
        average = total_rating / len(self.ratings) if self.ratings else 0
        return round(average, 1) #round to one decimal
    def get_rating_count(self):
        return len(self.ratings)  # Returns the count of ratings

#add to landlord when i add the issues model
# issues = db.relationship('Issue', back_populates='landlord', cascade="all, delete-orphan")
# serialize_rules = ("-issues.landlord", 'issues')

# class Issue(db.Model, SerializerMixin):
#     __tablename__ = 'issues_table'

#     id = db.Column(db.Integer, primary_key=True)
#     description = db.Column(db.String, nullable=False)
#     date_reported = db.Column(db.Date, default=datetime.date.today, nullable=False)

#     # Foreign Key to Landlord
#     landlord_id = db.Column(db.Integer, db.ForeignKey('landlords_table.id'))

#     # Relationship with Landlord
#     landlord = db.relationship('Landlord', back_populates='issues')

#     # Serializing the issue for API use
#     serialize_rules = ("-landlord.issues", "landlord")

#     @validates('description')
#     def validate_description(self, key, description):
#         if len(description) < 10:
#             raise ValueError("Description must be at least 10 characters long")
#         return description

#     @validates('date_reported')
#     def validate_date_reported(self, key, date_reported):
#         if date_reported > datetime.date.today():
#             raise ValueError("Report date cannot be in the future")
#         return date_reported




# Call configure_mappers after all models are defined
configure_mappers()
