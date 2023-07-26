from uuid import UUID
from flask_app.models import User, Post, Like

class LikeRepository:

    def __init__(self, db):
        self.db = db

    def create(self, post_id, user_id):
        post = Post.query.get(post_id)
        if not post:
            return ValueError
        user = User.query.get(user_id)
        if not user:
            return ValueError
        existing_like = Like.query.filter_by(user_id=user.id, post_id=post.id).first()
        if existing_like:
            return FileExistsError

        new_like = Like(user_id=user.id, post_id=post.id)
        return new_like.to_dict()