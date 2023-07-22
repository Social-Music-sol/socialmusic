from flask import Flask, request, jsonify, Blueprint, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from .models import Users, User
import jwt
import datetime

routes = Blueprint('login', __name__)

@routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # get the data from the request
    username = data.get('username')
    password = data.get('password')

    if not (username and password):
         return jsonify({'message': 'Cannot login without username and password'}), 400

    user = Users.query.filter_by(username=username).first()  # retrieve the user from the database

    if user is None or not user.check_password(password):
        return jsonify({'message': 'Invalid username or password'}), 401

    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=6)
    token_info = {
         "identity": str(user.id),
         "expiration": int(expiration.timestamp())
    }
    token = jwt.encode(token_info, current_app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'message': 'Successfully logged in', 'token':token})
    # ... generate JWT and return it to the client ...

@routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # get the data from the request
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if a user with this username or email already exists
    existing_user = Users.query.filter((Users.username == username) | (Users.email == email)).first()
    if existing_user is not None:
        return jsonify({'message': 'A user with this username or email already exists'}), 409

    new_user = Users(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@routes.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@routes.route('/')
def home():
    return "Hello, World!"

@routes.route('/add-user/<name>')
def add_user(name):
    new_user = User(name=name)
    db.session.add(new_user)
    db.session.commit()
    return f"User {name} added successfully!"

@routes.route('/delete-user/<name>', methods=['DELETE'])
def delete_user(name):
    user_to_delete = User.query.filter_by(name=name).first()
    db.session.delete(user_to_delete)
    db.session.commit()
    return f"User {name} deleted successfully!"

@routes.route('/users')
def users():
	users = User.query.all()
	return jsonify([user.name for user in users])
