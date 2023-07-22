from flask import Flask, request, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from .models import Users, User

routes = Blueprint('login', __name__)

@routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # get the data from the request
    username = data.get('username')
    password = data.get('password')

    user = Users.query.filter_by(username=username).first()  # retrieve the user from the database

    if user is None or not user.check_password(password):
        return jsonify({'message': 'Invalid username or password'}), 401

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
