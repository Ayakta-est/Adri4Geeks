import os
import json
import hashlib
from api.models import Question, db

DATA_DIR = 'data/preguntas'  # Carpeta con múltiples JSON

def generate_question_hash(text, answers):
    base = f"{text}|{'|'.join(answers)}"
    return hashlib.md5(base.encode('utf-8')).hexdigest()

def load_questions(app):
    with app.app_context():
        # Cargar todos los hashes de las preguntas ya existentes
        existing_hashes = {
            generate_question_hash(q.question, q.answers)
            for q in Question.query.all()
        }

        insertadas = 0
        actualizadas = 0

        # Recorre todos los .json en la carpeta
        for filename in os.listdir(DATA_DIR):
            if filename.endswith(".json"):
                path = os.path.join(DATA_DIR, filename)
                with open(path, encoding='utf-8') as f:
                    preguntas = json.load(f)

                for p in preguntas:
                    h = generate_question_hash(p["question"], p["answers"])

                    if h in existing_hashes:
                        continue  # Duplicada exacta

                    existente = Question.query.filter_by(question=p["question"]).first()
                    if existente:
                        # Actualiza campos (por si algo cambió)
                        existente.category = p["category"]
                        existente.answers = p["answers"]
                        existente.correct_index = p["correct_index"]
                        existente.color = p.get("color", None)
                        existente.difficulty = p.get("difficulty", "medium")
                        existente.world = p.get("world", "general")
                        existente.subcategory = p.get("subcategory", "others")
                        actualizadas += 1
                    else:
                        # Crea nueva
                        nueva = Question(
                            category=p["category"],
                            question=p["question"],
                            answers=p["answers"],
                            correct_index=p["correct_index"],
                            color=p.get("color", None),
                            difficulty=p.get("difficulty", "medium"),
                            world=p.get("world", "general"),
                            subcategory=p.get("subcategory", "others")
                        )
                        db.session.add(nueva)
                        insertadas += 1
                        existing_hashes.add(h)

        db.session.commit()
        print(f"✅ {insertadas} nuevas insertadas, {actualizadas} actualizadas.")
