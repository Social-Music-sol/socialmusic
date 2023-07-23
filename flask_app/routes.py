from flask import Flask, request, jsonify, Blueprint, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from . import db
from flask_app.repositories.user_repository import UserRepository
from flask_app.repositories.post_repository import PostRepository
from flask_app.models import User, Post

app = Blueprint('login', __name__)
user_repository = UserRepository(db)
post_repository = PostRepository(db)

@app.route('/login', methods=['POST'])
def login():
    post_data = request.get_json()  # get the data from the request
    token = user_repository.login(post_data)
    return jsonify({'message': 'Successfully logged in', 'token':token}), 201

@app.route('/register', methods=['POST'])
def register():
    post_data = request.get_json()  # get the data from the request
    try:
        new_user = user_repository.create(post_data)
        return jsonify(new_user), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    # Get the JWT token from the Authorization header
    user_id = get_jwt_identity()

    # Get the user from the database
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    post_data = request.get_json()
    new_post = post_repository.create(user_id, post_data)

    return jsonify({'message': 'Post created successfully', 'post_id': new_post.id}), 201

@app.route('/')
def home():
    return "Whoops, looks like you used the wrong port. Try port 3000!"

