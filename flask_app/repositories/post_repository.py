from flask_app.models import Post, User
from flask import jsonify
from uuid import UUID

class PostRepository:

    def __init__(self, db):
        self.db = db

    def create(self, post_data):
        # Create and save the new post
        new_post = Post(**post_data)
        self.db.session.add(new_post)
        self.db.session.commit()

        return new_post.to_dict()
        
    def get_by_user_id(self, user_id, amount=5, descending=True):
        user = User.query.filter_by(id=user_id).first()
        if user:
            if descending:
                posts = user.posts.order_by(Post.created_at.desc()).limit(amount).all()
            else:
                posts = user.posts.order_by(Post.created_at.asc()).limit(amount).all()
            return [post.to_dict() for post in posts]
        else:
            raise NameError