import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from app.routes import main

# Initialize Flask app
app = Flask(__name__)

# Register Blueprint
app.register_blueprint(main)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL', 
    'mysql+pymysql://root:password@localhost:3306/mydatabase'  # Update this if needed
)
app.config['SECRET_KEY'] = os.environ.get(
    'SECRET_KEY', 
    'your_super_secure_production_secret_key'
)

# Initialize Extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'main.login'  # Ensure correct login route
login_manager.login_message_category = 'info'
