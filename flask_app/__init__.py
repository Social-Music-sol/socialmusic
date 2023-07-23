from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
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
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    jwt.init_app(app)

    # Now that we have the 'app' object, we can use it to initialize 'db'
    db.init_app(app)


    # Then we import and register blueprints
    import flask_app.routes.app as routes_blueprint
    app.register_blueprint(routes_blueprint)

    return app
