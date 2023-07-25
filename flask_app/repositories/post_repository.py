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
    
    def get_by_user_id(self, user_id:UUID, amount=5, sort_by='time', descending=True):
        #descending=True : Newest posts first
        #descending=False : Oldest posts first
        user = User.query.get(user_id)
        if user:
            if sort_by == 'time':
                posts = \
                    user.posts_order_by(Post.created_at.desc().limit(amount).all()) if descending \
                    else user.posts_order_by(Post.created_at.asc().limit(amount).all())
                return [post.as_dict() for post in posts]
        else:
            raise NameError