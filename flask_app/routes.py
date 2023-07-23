from flask import Flask, request, jsonify, Blueprint, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from . import db
from repositories.user_repository import UserRepository

app = Blueprint('login', __name__)
user_repository = UserRepository(db)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # get the data from the request
    username = data.get('username')
    password = data.get('password')

    return user_repository.login(username, password)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # get the data from the request
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    return user_repository.create(username, password, email)

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/')
def home():
    return "Whoops, looks like you used the wrong port. Try port 3000!"

