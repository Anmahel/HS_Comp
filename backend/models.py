from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ProjectStatus(db.Model):
    __tablename__ = "project_status"
    
    id = db.Column(db.Integer, primary_key=True)
    status_name = db.Column(db.String(50), nullable=False, default="Ready")
    message = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "status_name": self.status_name,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
