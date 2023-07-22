from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
# Create the SQLAlchemy object
db = SQLAlchemy()

def create_app():
    # Create the Flask application
    load_dotenv()

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://flaskuser:STARTER@localhost/socialmusic_starter_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')

    # Now that we have the 'app' object, we can use it to initialize 'db'
    db.init_app(app)

    # Then we import and register blueprints
    from .routes import routes as routes_blueprint
    app.register_blueprint(routes_blueprint)

    return app
