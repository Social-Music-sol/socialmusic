from flask_app.models import Post, User
from flask import jsonify
import re
from uuid import UUID

class PostRepository:

    def __init__(self, db):
        self.db = db
        regex_statement = r'https:\/\/open\.spotify\.com\/track\/([^\?]+)'
        self.link_grabber = re.compile(regex_statement)

    def create(self, post_data):
        # Create and save the new post
        
        if 'song_url' in post_data.keys():
            links = self.link_grabber.search(post_data['song_url'])
            if len(links) < 1:
                raise ValueError
            else:
                post_data['song_id'] = self.link_builder(links[0])
        new_post = Post(**post_data)
        self.db.session.add(new_post)
        self.db.session.commit()

        return new_post.to_dict()
        
    def get(self, user_id, amount=5, descending=True):
        user = User.query.filter_by(id=user_id).first()
        if user:
            if descending:
                posts = user.posts.order_by(Post.created_at.desc()).limit(amount).all()
            else:
                posts = user.posts.order_by(Post.created_at.asc()).limit(amount).all()
            return [post.to_dict() for post in posts]
        else:
            raise NameError