import os

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from config import Config
from extensions import db, jwt, limiter


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    os.makedirs(app.config["UPLOAD_DIR"], exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)
    if app.config["CORS_ORIGINS"]:
        CORS(app, origins=app.config["CORS_ORIGINS"], supports_credentials=True)

    from routes_public import public_bp
    from routes_admin import admin_bp

    app.register_blueprint(public_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.get("/uploads/<path:filename>")
    def uploaded_file(filename):
        # In production nginx serves /uploads directly; this keeps dev and fallback working.
        return send_from_directory(app.config["UPLOAD_DIR"], filename)

    @app.get("/api/health")
    def health():
        return jsonify(status="ok")

    @app.after_request
    def security_headers(resp):
        resp.headers.setdefault("X-Content-Type-Options", "nosniff")
        resp.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
        resp.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        resp.headers.setdefault("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
        if request.path.startswith("/api/admin"):
            resp.headers.setdefault("Cache-Control", "no-store")
        return resp

    @app.errorhandler(HTTPException)
    def http_error(err):
        return jsonify(error=err.description or err.name), err.code

    @app.errorhandler(Exception)
    def server_error(err):
        app.logger.exception("Unhandled error")
        db.session.rollback()
        return jsonify(error="Something went wrong on the server."), 500

    return app
