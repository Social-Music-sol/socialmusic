from flask_app.models import Post
from flask import jsonify
from datetime import timedelta

class PostRepository:

    def __init__(self, db):
        self.db = db

    def create(self, user_id, post_data):
        # Create and save the new post
        new_post = Post(user_id, **post_data)
        self.db.session.add(new_post)
        self.db.session.commit()

        return new_post.to_dict()