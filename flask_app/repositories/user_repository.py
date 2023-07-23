from flask_app.models import User
from flask import jsonify
from datetime import timedelta
from flask_jwt_extended import create_access_token

class UserRepository:

    def __init__(self, db):
        self.db = db

    def login(self, username, password):
        if not (username and password):
            return jsonify({'message': 'Cannot login without username and password'}), 400

        user = User.query.filter_by(username=username).first()  # retrieve the user from the database

        if user is None or not user.check_password(password):
            return jsonify({'message': 'Invalid username or password'}), 401

        token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=2)
        
        )
        return jsonify({'message': 'Successfully logged in', 'token':token}), 201
    
    def create(self, username, password, email):
        # Check if a user with this username or email already exists
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing_user is not None:
            return jsonify({'message': 'A user with this username or email already exists'}), 409

        new_user = User(username=username, email=email)
        new_user.set_password(password)

        self.db.session.add(new_user)
        self.db.session.commit()

        return jsonify({'message': 'User created successfully'}), 201

