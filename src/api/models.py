import os
import json
import hashlib
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, validates

db = SQLAlchemy()

# -------- MODELOS SQL (puedes mantenerlos si algún día vuelves a usarlos) --------
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, it's a security breach
        }

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50))
    subcategory = db.Column(db.String(100), default="others")
    question = db.Column(db.Text)
    answers = db.Column(db.JSON)
    correct_index = db.Column(db.Integer)
    color = db.Column(db.String(50))
    difficulty = db.Column(db.String(20), default="medium")
    world = db.Column(db.String(50), default="general")

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "subcategory": self.subcategory,
            "question": self.question,
            "answers": self.answers,
            "correct_index": self.correct_index,
            "color": self.color,
            "difficulty": self.difficulty,
            "world": self.world,
        }

    @validates('difficulty')
    def validate_difficulty(self, key, value):
        if value not in ['easy', 'medium', 'hard']:
            raise ValueError("Dificultad no válida. Usa: easy, medium o hard")
        return value


# -------- NUEVO MÉTODO PARA GUARDAR EN ARCHIVOS JSON SIN DUPLICADOS --------

BASE_PATH = 'data/preguntas'

def generate_question_hash(pregunta_dict):
    """Devuelve un hash único para detectar duplicados."""
    raw = f"{pregunta_dict['category']}|{pregunta_dict['subcategory']}|{pregunta_dict['question']}"
    return hashlib.md5(raw.encode('utf-8')).hexdigest()

def load_questions_for_category(category):
    """Carga todas las preguntas de un archivo de categoría."""
    path = os.path.join(BASE_PATH, f"{category.lower()}.json")
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_questions_for_category(category, preguntas):
    """Guarda todas las preguntas de una categoría."""
    path = os.path.join(BASE_PATH, f"{category.lower()}.json")
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(preguntas, f, indent=2, ensure_ascii=False)

def add_question_if_new(pregunta_dict):
    """Añade una pregunta al archivo solo si no está repetida."""
    category = pregunta_dict['category']
    preguntas = load_questions_for_category(category)

    existing_hashes = {generate_question_hash(p) for p in preguntas}
    new_hash = generate_question_hash(pregunta_dict)

    if new_hash in existing_hashes:
        return False  # Ya existe

    preguntas.append(pregunta_dict)
    save_questions_for_category(category, preguntas)
    return True  
