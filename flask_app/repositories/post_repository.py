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
            links = self.link_grabber.findall(post_data['song_url'])
            del post_data['song_url']
            if len(links) < 1:
                raise ValueError
            else:
                post_data['song_id'] = links[0]
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
        
    def get_feed(self, amount=10):
        posts = Post.query.order_by(Post.created_at.desc()).limit(amount).all()
        for i, post in enumerate(posts):
            posts[i] = post.to_dict()
            user_id = posts[i]['user_id']
            posts[i]['username'] = User.query.get(user_id=user_id).username
        return posts