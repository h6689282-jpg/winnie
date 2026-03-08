"""
WSGI entry point for deployment (e.g. Render).
Use: gunicorn meetnow.wsgi:application
"""
from project.wsgi import application

__all__ = ["application"]
