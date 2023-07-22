from flask import Flask, request, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from app import app, db
from werkzeug.security import generate_password_hash, check_password_hash
from models import Users
import uuid


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # get the data from the request
    username = data.get('username')
    password = data.get('password')

    user = Users.query.filter_by(username=username).first()  # retrieve the user from the database

    if user is None or not user.check_password(password):
        return jsonify({'message': 'Invalid username or password'}), 401

    # ... generate JWT and return it to the client ...

@app.route('/register', methods=['POST'])
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
