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


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(64), nullable=False)
    salt = db.Column(db.String(64), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def set_password(self, password):
        self.salt = uuid.uuid4().hex
        self.password_hash = generate_password_hash(self.salt + password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, self.salt + password)
    
class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, unique=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    parent_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('posts.id'), nullable=True)
    content = db.Column(db.String(300), nullable=False)
    replies = db.relationship('Post', backref=db.backref('parent', remote_side=['id']), lazy='dynamic')
    likes = db.relationship('Like', backref='post', lazy='dynamic')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class Like(db.Model):
    __tablename__ = 'likes'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, unique=True, default=uuid.uuid4) 
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    post_id = db.Columns(db.UUID(as_uuid=True), db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


if __name__ == "__main__":  
    with app.app_context():
        db.create_all()
