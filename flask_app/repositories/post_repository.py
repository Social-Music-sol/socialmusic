from flask_app.models import Post, User, Like, Follow
from flask import jsonify
import re
from datetime import datetime
from uuid import UUID

class PostRepository:

    def __init__(self, db):
        self.db = db
        regex_statement = r'https:\/\/open\.spotify\.com\/track\/([^\?]+)'
        self.link_grabber = re.compile(regex_statement)

    def exists(self, user_id):
        user = User.query.get(user_id)
        if not user:
            raise NameError
        return user
    
    def userExists(self, username):
        user = User.query.filter_by(username=username).first()
        if not user:
            raise NameError
        return user


    def create(self, post_data):
        user_id = post_data['user_id']
        if not User.query.get(user_id):
            raise NameError
        
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
        
    def get_user_posts(self, username, amount=5, requester_id=None, timestamp=None):
        self.exists(requester_id)
        user = self.userExists(username)
        query = Post.query.filter_by(parent_id=None, user_id=user.id)
        if timestamp:
            timestamp = datetime.utcfromtimestamp(timestamp)
            query = query.filter(Post.created_at < timestamp)
        posts = query.order_by(Post.created_at.desc()).limit(amount).all()
        post_data = [self.full_post_data(requester_id, post=post) for post in posts]
        if not posts:
            raise FileNotFoundError
        return post_data, int(post_data[-1]['created_at']) - 1

    def get_feed(self, requester_id, amount=10, timestamp=None):
        self.exists(requester_id)
        query = Post.query.filter_by(parent_id=None)
        if timestamp:
            timestamp = datetime.utcfromtimestamp(timestamp)
            query = query.filter(Post.created_at < timestamp)
        posts = query.order_by(Post.created_at.desc()).limit(amount).all()
        post_data = [self.full_post_data(requester_id, post=post) for post in posts]
        if not posts:
            raise FileNotFoundError
        return post_data, int(post_data[-1]['created_at']) - 1
    
    def full_post_data(self, requester_id, post_id=None, post=None):
        requester = self.exists(requester_id)
        if post_id:
            post = Post.query.get(post_id)
        else:
            post_id = post.id
        if not post or not requester:
            raise NameError
        
        post_data = post.to_dict()
        poster_id = post_data['user_id']
        user =  self.exists(poster_id)
        post_data['username'] = user.username
        post_data['poster_pfp_url'] = user.make_pfp_url()

        likes = Like.query.filter_by(post_id=post_id)
        existing_like = likes.filter_by(user_id=requester_id).first()
        total_likes = likes.count()
        post_data['like_count'] = total_likes
        post_data['liked_by_requester'] = True if existing_like else False

        following_poster = Follow.query.filter_by(follower_id=requester_id, followed_id=poster_id).first()
        post_data['following_poster'] = True if following_poster else False

        if post.parent_id:
            post_data['parent_id'] = post.parent_id
        else:
            post_data['parent_id'] = None

        replies = post.replies.all()
        replies = sorted(replies, lambda reply: reply.created_at)
        post_data['replies'] = []
        if replies:
            post_data['replies'] = [self.full_post_data(requester_id=requester_id, post=reply) for reply in replies]

        return post_data