# app/__init__.py

# third-party imports
from flask import Flask
from flask_bootstrap import Bootstrap
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

# local imports
from config import app_config

# db variable initialization
db = SQLAlchemy()

def create_app(config_name):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('config.py')
    db.init_app(app)

    Bootstrap(app)
    db.init_app(app)
    
    migrate = Migrate(app, db)

    from app import models

    from .servico import servico as servico_blueprint
    app.register_blueprint(servico_blueprint)

    return app