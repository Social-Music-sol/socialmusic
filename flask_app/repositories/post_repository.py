from flask_app.models import Post, User, Like, Follow
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
        if len(post_data['content']) > 1000:
            return MemoryError
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
        
    def get_feed(self, requester_id, amount=10):
        if not User.query.get(requester_id):
            raise KeyError
        posts = Post.query.order_by(Post.created_at.desc()).limit(amount).all()
        post_data = [self.full_post_data(requester_id, post=post) for post in posts]
        return post_data
    
    def full_post_data(self, requester_id, post_id=None, post=None):
        requester = User.query.get(requester_id)
        if post_id:
            post = Post.query.get(post_id)
        else:
            post_id = post.id
        if not post or not requester:
            raise NameError
        
        post_data = post.to_dict()
        poster_id = post_data['user_id']
        post_data['username'] = User.query.get(poster_id).username

        likes = Like.query.filter_by(post_id=post_id)
        existing_like = likes.filter_by(user_id=requester_id).first()
        total_likes = likes.count()
        post_data['like_count'] = total_likes
        post_data['liked_by_requester'] = True if existing_like else False

        following_poster = Follow.query.filter_by(follower_id=requester_id, followed_id=poster_id).first()
        post_data['following_poster'] = True if following_poster else False

        return post_data