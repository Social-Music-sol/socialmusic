from flask import Flask, request, jsonify, Blueprint, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from . import db
from flask_app.repositories.user_repository import UserRepository
from flask_app.models import User, Post

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

@app.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    # Get the JWT token from the Authorization header
    user_id = get_jwt_identity()
    user = User.query.get()

    # Get the user from the database
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    # Get the post data from the request
    post_data = request.get_json()
    content = post_data.get('content')
    image_url = post_data.get('image_url')
    parent_id = post_data.get('parent_id')

    # Create and save the new post
    new_post = Post(user_id=user.id, content=content, image_url=image_url, parent_id=parent_id)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully', 'post_id': new_post.id}), 201

@app.route('/')
def home():
    return "Whoops, looks like you used the wrong port. Try port 3000!"

