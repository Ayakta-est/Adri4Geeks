import json
from api.models import Question, db

def load_questions(app):
    with app.app_context():
        with open('data/preguntas.json', encoding='utf-8') as f:
            preguntas = json.load(f)

        for p in preguntas:
            existente = Question.query.filter_by(question=p["question"]).first()
            if existente:
                # Actualiza campos existentes
                existente.category = p["category"]
                existente.answers = p["answers"]
                existente.correct_index = p["correct_index"]
                existente.color = p["color"]
                existente.difficulty = p.get("difficulty", "medium")
            else:
                # Crea nueva pregunta
                nueva = Question(
                    category=p["category"],
                    question=p["question"],
                    answers=p["answers"],
                    correct_index=p["correct_index"],
                    color=p["color"],
                    difficulty=p.get("difficulty", "medium")
                )
                db.session.add(nueva)

        db.session.commit()
        print("Preguntas insertadas o actualizadas correctamente.")