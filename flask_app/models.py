from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from datetime import datetime

if __name__ == '__main__':
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://flaskuser:STARTER@localhost/socialmusic_starter_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db = SQLAlchemy(app)
else:
    from . import db

embed_link_builder = lambda track_id: r'https://open.spotify.com/embed/track/' + track_id + r'?utm_source=oembed'

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    salt = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    posts = db.relationship('Post', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.salt = uuid.uuid4().hex
        self.password_hash = generate_password_hash(self.salt + password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, self.salt + password)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at
        }
    
class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, unique=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    parent_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('posts.id'), nullable=True)
    content = db.Column(db.String(300), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    song_id = db.Column(db.String(500), nullable=True)
    replies = db.relationship('Post', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')
    likes = db.relationship('Like', backref='post', lazy='dynamic')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)    

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'parent_id': str(self.parent_id),
            'content': self.content,
            'image_url': self.image_url,
            'song_id': self.song_id,
            'song_embed_url': embed_link_builder(self.song_id),
            'created_at': self.created_at
        }


class Like(db.Model):
    __tablename__ = 'likes'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, unique=True, default=uuid.uuid4) 
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'post_id': str(self.post_id)
        }

if __name__ == "__main__":  
    with app.app_context():
        db.drop_all()
        db.create_all()
