# app/servico/__init__.py

from flask import Blueprint

servico = Blueprint('servico', __name__)

from . import views