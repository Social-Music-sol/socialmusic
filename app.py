from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://flaskuser:STARTER@localhost/socialmusic_starter_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/')
def home():
    return "Hello, World!"

@app.route('/add-user/<name>')
def add_user(name):
    new_user = User(name=name)
    db.session.add(new_user)
    db.session.commit()
    return f"User {name} added successfully!"

@app.route('/delete-user/<name>', methods=['DELETE'])
def delete_user(name):
    user_to_delete = User.query.filter_by(name=name).first()
    db.session.delete(user_to_delete)
    db.session.commit()
    return f"User {name} deleted successfully!"

@app.route('/users')
def users():
	users = User.query.all()
	return jsonify([user.name for user in users])

import login

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
