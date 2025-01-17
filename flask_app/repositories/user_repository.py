from flask_app.models import User, Follow
from flask import jsonify, send_from_directory
from flask import current_app
import os
from sqlalchemy.exc import IntegrityError 
from datetime import timedelta
from flask_jwt_extended import create_access_token
from datetime import datetime

class UserRepository:

    def __init__(self, db, photos):
        self.db = db
        self.photos = photos
        self.ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
        self.allowed_file = lambda pfp: '.' in pfp and pfp.rsplit('.', 1)[1].lower() in self.ALLOWED_EXTENSIONS

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
            user = self.exists(user_id)
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
            existing_follow = Follow.query.filter_by(follower_id=requester_id, followed_id=user.id).first()
            user_data['requester_following'] = True if existing_follow else False
        return user_data
    
    def exists(self, user_id):
        user = User.query.get(user_id)
        if not user:
            raise NameError
        return user 

    def userExists(self, username):
        user = User.query.filter_by(username=username).first()
        if not user:
            raise NameError
        return user

    def set_pfp(self, user_id, pfp):
        user = self.exists(user_id)
        if not self.allowed_file(pfp.filename):
            raise ValueError
        
        if user.pfp != 'default.png':
            old_filename = user.pfp
            old_filepath = os.path.join(current_app.config['UPLOADED_PHOTOS_DEST'], old_filename)
            if os.path.exists(old_filepath):
                os.remove(old_filepath)
        
        now = datetime.now()
        int_timestamp = int(now.timestamp())
        new_filename = user_id + str(int_timestamp) + '.png'
        
        user.pfp = new_filename
        self.db.session.commit()
        
        self.photos.save(pfp, name=new_filename)
        return user.to_dict()
    
    def get_pfp(self, requester_id, user_id=None, username=None):
        self.exists(requester_id)
        if username:
            user_id = self.userExists(username).id
        if user_id:
            self.exists(user_id)
        user = self.exists(user_id)
        pfp_path = user.make_pfp_url()
        return {'pfp_url': pfp_path}



