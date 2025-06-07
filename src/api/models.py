from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, validates

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50))  # "anime", "youtube", etc
    question = db.Column(db.Text)
    answers = db.Column(db.JSON)  # ej. ["A", "B", "C", "D"]
    correct_index = db.Column(db.Integer)  # índice de respuesta correcta
    color = db.Column(db.String(50))
    difficulty = db.Column(db.String(20), default="medium")
    world = db.Column(db.String(50), default="general")        
    subcategory = db.Column(db.String(100), default="others")

    @validates('difficulty')
    def validate_difficulty(self, key, value):
        if value not in ['easy', 'medium', 'difficult']:
            raise ValueError("Dificultad no válida. Usa: easy, medium o difficult")
        return value