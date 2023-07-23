from flask_app.models import User
from flask import jsonify
from sqlalchemy.exc import IntegrityError 
from datetime import timedelta
from flask_jwt_extended import create_access_token

class UserRepository:

    def __init__(self, db):
        self.db = db

    def login(self, post_data):
        username = post_data.get('username')
        password = post_data.get('password')
        if not (username and password):
            return jsonify({'message': 'Cannot login without username and password'}), 400

        user = User.query.filter_by(username=username).first()  # retrieve the user from the database

        if user is None or not user.check_password(password):
            return jsonify({'message': 'Invalid username or password'}), 401

        token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=2)
        
        )
        return token
    
    def create(self, post_data):
        username = post_data.get('username')
        email = post_data.get('email')
        password = post_data.get('password')
        try:
            new_user = User(username=username, email=email)
            new_user.set_password(password)

            self.db.session.add(new_user)
            self.db.session.commit()

            return new_user.to_dict()
        except IntegrityError:
            raise ValueError("Username is already taken")


