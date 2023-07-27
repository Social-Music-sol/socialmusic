from uuid import UUID
from flask_app.models import User, Post, Like, Follow

class FollowRepository:

    def __init__(self, db):
        self.db = db

    def create(self, follower_id, followed_id):
        follower = User.query.get(follower_id)
        followed = User.query.get(followed_id)
        if not follower or not followed:
            raise NameError
        
        existing_follow = Follow.query.filter_by(follower_id=follower_id, followed_id=followed_id).first()
        if existing_follow:
            raise ValueError

        new_follow = Follow(follower_id=follower_id, followed_id=followed_id)
        self.db.session.add(new_follow)
        self.db.session.commit()
        return new_follow.to_dict()
    
    def delete(self, follower_id, followed_id):
        follower = User.query.get(follower_id)
        followed = User.query.get(followed_id)
        if not follower or not followed:
            raise NameError
        
        existing_follow = Follow.query.filter_by(follower_id=follower_id, followed_id=followed_id).first()
        if not existing_follow:
            raise ValueError

        response = existing_follow.to_dict()
        self.db.session.delete(existing_follow)
        self.db.session.commit()
        return response