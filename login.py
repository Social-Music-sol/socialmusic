from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from app import app, db
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    salt = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.salt = uuid.uuid4().hex
        self.password_hash = generate_password_hash(self.salt + password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, self.salt + password)
    
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # get the data from the request
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()  # retrieve the user from the database

    if user is None or not user.check_password(password):
        return jsonify({'message': 'Invalid username or password'}), 401

    # ... generate JWT and return it to the client ...