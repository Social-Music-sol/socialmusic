from flask import Flask
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from werkzeug.utils import secure_filename
import os
# Create the SQLAlchemy object
db = SQLAlchemy()
jwt = JWTManager()
photos = UploadSet('photos', IMAGES)

def create_app():
    # Create the Flask application

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
    app.config["JWT_COOKIE_DOMAIN"] = os.getenv('HTTPS_DOMAIN')
    app.config["JWT_COOKIE_PATH"] = "/"
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
    jwt.init_app(app)

    app.config['PFP_PREFIX_DOMAIN'] = 'http://jamjar.live/profile-pictures/'
    app.config['UPLOADED_PHOTOS_DEST'] = '/srv/static/pfp'
    configure_uploads(app, photos)
    patch_request_class(app)

    # Now that we have the 'app' object, we can use it to initialize 'db'
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    # Then we import and register blueprints
    from flask_app.routes import app as routes_blueprint
    app.register_blueprint(routes_blueprint, url_prefix='/api')

    return app
