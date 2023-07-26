from uuid import UUID
from flask_app.models import User, Post, Like

class LikeRepository:

    def __init__(self, db):
        self.db = db

    def create(self, post_id, user_id):
        post = Post.query.get(post_id)
        user = User.query.get(user_id)
        if not user or not post:
            return KeyError
        
        existing_like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
        if existing_like:
            raise ValueError

        new_like = Like(user_id=user_id, post_id=post_id)
        self.db.session.add(new_like)
        self.db.session.commit()
        return new_like.to_dict()
    
    def delete(self, post_id, user_id):
        post = Post.query.get(post_id)
        user = User.query.get(user_id)
        if not user or not post:
            return KeyError

        existing_like = Like.query.filter_by(user_id=user.id, post_id=post.id).first()
        if not existing_like:
            return ValueError
        response = existing_like.to_dict()
        self.db.session.delete(existing_like)
        self.db.session.commit()
        return response
        
