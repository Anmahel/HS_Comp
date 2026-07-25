import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db, ProjectStatus

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend requests
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)

    with app.app_context():
        db.create_all()
        # Seed initial status if empty
        if not ProjectStatus.query.first():
            initial_status = ProjectStatus(
                status_name="Operativo",
                message="Todo esta listo para comenzar a crear tu gran proyecto."
            )
            db.session.add(initial_status)
            db.session.commit()

    @app.route("/api/health", methods=["GET"])
    def health_check():
        status = ProjectStatus.query.first()
        return jsonify({
            "status": "online",
            "backend": "Flask + SQLAlchemy",
            "db_connected": True,
            "message": status.message if status else "Backend listo",
            "timestamp": status.created_at.isoformat() if status and status.created_at else None
        }), 200

    @app.route("/api/info", methods=["GET"])
    def get_info():
        return jsonify({
            "name": "HC_comp Full-Stack API",
            "version": "0.1v",
            "tech_stack": {
                "backend": "Python 3 + Flask + SQLAlchemy",
                "package_manager": "uv",
                "frontend": "React + Vite + Tailwind CSS (Bun)"
            }
        }), 200

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
