from flask_app.models import User, Follow
from flask import jsonify, send_from_directory
from flask import current_app
from os import path
from sqlalchemy.exc import IntegrityError 
from datetime import timedelta
from flask_jwt_extended import create_access_token

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
            existing_follow = Follow.query.filter_by(follower_id=requester_id, followed_id=user.id).first()
            user_data['requester_following'] = True if existing_follow else False
        return user_data
    
    def exists(self, user_id):
        user = User.query.get(user_id)
        if not user:
            raise NameError
        return user 

    def set_pfp(self, user_id, pfp):
        user = self.exists(user_id)
        if not self.allowed_file(pfp.filename):
            raise ValueError
        self.photos.save(pfp, name=user_id+'.png')
        user.pfp = user_id+'.png'
        self.db.session.commit()
        return user.to_dict()
    
    def get_pfp(self, requester_id, user_id):
        self.exists(requester_id)
        user = self.exists(user_id)
        path = path.join(current_app.config['UPLOADED_PHOTOS_DEST'], user.pfp)
        return {'pfp_ur': path}
        #return #send_from_directory(, )



