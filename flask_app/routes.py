from flask import Flask, request, jsonify, Blueprint, make_response, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from . import db, photos
from flask_app.repositories.user_repository import UserRepository
from flask_app.repositories.post_repository import PostRepository
from flask_app.repositories.like_repository import LikeRepository
from flask_app.repositories.follow_repository import FollowRepository
from flask_app.models import User
from flask_cors import cross_origin
from datetime import datetime, timedelta
from os import getenv

app = Blueprint('login', __name__)
user_repository = UserRepository(db, photos)
post_repository = PostRepository(db)
like_repository = LikeRepository(db)
follow_repository = FollowRepository(db)

@app.route('/login', methods=['POST'])
def login():
    post_data = request.get_json()  # get the data from the request
    try:
        token, response = user_repository.login(post_data)
    except NameError:
        return jsonify({'message': 'Username or password field is missing'}), 401
    except ValueError:
        return jsonify({'message': 'Username and password combination is incorrect'}), 400
    
    resp = make_response(jsonify(response))
    resp.set_cookie('access_token_cookie', str(token), domain=getenv('BASE_DOMAIN'), path='/', httponly=True, samesite='None', secure=True)
    return resp, 200
    #return jsonify({'message': 'Successfully logged in', 'token':token}), 201

@app.route('/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({"message": "Logged out"}))
    resp.set_cookie('access_token_cookie', '', expires=datetime.utcnow() - timedelta(days=1), domain=getenv('BASE_DOMAIN'), path='/', httponly=True, samesite='None', secure=True)
    return resp, 200

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
    user_id = get_jwt_identity()
    try:
        resp = user_repository.get(user_id)
        return jsonify(resp), 200
    except NameError:
        return jsonify({'error': 'User not found', 'user_id': user_id}), 404 

@app.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    # Get the JWT token from the Authorization header
    user_id = get_jwt_identity()

    # Get the user from the database
    #TODO : ENSURE USER ID IS VALID IN POST_REPOSITORY

    post_data = request.get_json()
    post_data['user_id'] = user_id
    try:
        new_post = post_repository.create(post_data)
        return jsonify(new_post), 201
    except ValueError:
        return jsonify({'error': 'Invalid spotify link'}), 400
    except MemoryError:
        return jsonify({'error': 'Content field was over 1,000 characters'}), 400
    

@app.route('/user-by-id/<user_id>', methods=['GET'])
@jwt_required()
def get_user_by_id(user_id):
    requester_id = get_jwt_identity()
    try:
        user_data = user_repository.get(user_id=user_id, requester_id=requester_id)
        return jsonify(user_data), 200
    except NameError:
        return jsonify({'error': 'User not found'}), 404
    
@app.route('/user-by-name/<username>', methods=['GET'])
@jwt_required()
def get_user_by_name(username):
    requester_id = get_jwt_identity()
    try:
        user_data = user_repository.get(username=username, requester_id=requester_id)
        return jsonify(user_data), 200
    except NameError:
        return jsonify({'error': 'User not found'}, 404)
    
@app.route('/get-posts/<user_id>', methods=['GET'])
@jwt_required()
def get_posts(user_id):
    limit = request.args.get('limit', default=5, type=int)
    requester_id = get_jwt_identity()
    try:
        posts = post_repository.get(user_id, amount=limit, requester_id=requester_id)
        return jsonify(posts), 200
    except NameError:
        return jsonify({'error': 'User not found'}), 404

@app.route('/recent-feed', methods=['GET'])
@jwt_required()
def get_feed():
    user_id = get_jwt_identity()
    limit = request.args.get('limit', default=15, type=int)
    try:
        posts = post_repository.get_feed(user_id, amount=limit)
        return jsonify(posts), 201
    except KeyError:
        return jsonify({'error': 'User not found'}), 404

@app.route('/like-post', methods=['POST', 'DELETE'])
@jwt_required()
def like_post():
    post_id = request.args.get('post_id', default=None, type=str)
    user_id = get_jwt_identity()
    try:
        if request.method == 'POST':
            response = like_repository.create(post_id, user_id)
        elif request.method == 'DELETE':
            response = like_repository.delete(post_id, user_id)
        else:
            return jsonify({'error': 'Unsupported method'}), 405
        return jsonify(response), 201
    except KeyError:
        return jsonify({'error': 'User or post not found'}), 404
    except ValueError:
        return jsonify({'error': 'Trying to delete/create a post that doesnt/does exist'}), 404
    
@app.route('/follow-user', methods=['POST', 'DELETE'])
@jwt_required()
def follow_user():
    follower_id = get_jwt_identity()
    followed_id = request.args.get('id', default=None, type=str)

    if not followed_id:
        return jsonify({'error': 'missing id arg'}), 404

    try:
        if request.method == 'POST':
            resp = follow_repository.create(follower_id=follower_id, followed_id=followed_id)
        elif request.method == 'DELETE':
            resp = follow_repository.delete(follower_id=follower_id, followed_id=followed_id)
        else:
            return jsonify({'error': 'unkown method'}), 405
        return jsonify(resp), 201
    except NameError:
        return jsonify({'error': 'follower_id or followed_id not found'}), 404
    except ValueError:
        return jsonify({'error': 'follow cannot be deleted/created because it doesn\'t/does exist'})
    
    
@app.route('/profile/upload', methods=['POST'])
@jwt_required()
def upload_profile_image():
    requester_id = get_jwt_identity()
    if 'photo' not in request.files:
        return jsonify({'error': 'image not uploaded'}), 400
    #filename = photos.save(request.files['photo'])
    pfp = request.files['photo']
    try:
        response = user_repository.set_pfp(requester_id, pfp)
        return jsonify(response), 201
    except NameError:
        return jsonify({'error': 'User not found'}), 404
    except ValueError:
        return jsonify({'error': 'File type not allowed'}), 405
    
    #return redirect(url_for('get_image', name=filename))

@app.route('/get-pfp')
@jwt_required()
def get_image():
    requester_id = get_jwt_identity()
    user_id = request.args.get('id', default=None, type=str)
    response = user_repository.get_pfp(requester_id, user_id)
    return response


@app.route('/')
def home():
    return "Whoops, looks like you used the wrong port. Try port 3000!"

