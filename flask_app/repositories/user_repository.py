from flask_app.models import User, Follow
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
            raise NameError

        user = User.query.filter_by(username=username).first()  # retrieve the user from the database

        if user is None or not user.check_password(password):
            raise ValueError

        token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(days=7)
        
        )
        return token, {'user_id': user.id, 'username': username}
    
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
        
    def get(self, user_id=None, username=None, requester_id=None):
        if user_id:
            user = User.query.get(user_id)
        elif username:
            user = User.query.filter_by(username=username).first()
        else:
            raise ValueError
        
        if not user:
            raise NameError

        followers = Follow.query.filter_by(followed_id=user.id).count()
        following = Follow.query.filter_by(follower_id=user.id).count()

        user_data = {
            'username': user.username,
            'user_id': user.id,
            'created_at': user.created_at.strftime('%m/%d/%Y, %H:%M:%S'),
            'followers': followers,
            'following': following
        }
        if requester_id:
            user_data['requester_following'] = True if \
                Follow.query.filter_by(follower_id=requester_id, followed_id=user.id).first() \
                else False
        return user_data
    
    def exists(self, user_id):
        user = User.query.get(user_id)
        return True if user else False


