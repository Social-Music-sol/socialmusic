from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_cors import CORS
import os
# Create the SQLAlchemy object
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    # Create the Flask application
    load_dotenv()

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://flaskuser:STARTER@localhost/socialmusic_starter_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = app.config['SECRET_KEY']
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = False  # Set to True in a production environment with HTTPS!
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True  # CSRF protection
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    app.config["JWT_COOKIE_DOMAIN"] = "http://52.38.156.74:3000"
    app.config["JWT_COOKIE_PATH"] = "/"
    jwt.init_app(app)

    # Now that we have the 'app' object, we can use it to initialize 'db'
    db.init_app(app)
    CORS(app, supports_credentials=True)
    # Then we import and register blueprints
    from flask_app.routes import app as routes_blueprint
    app.register_blueprint(routes_blueprint)

    return app
