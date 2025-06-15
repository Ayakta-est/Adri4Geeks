from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Question
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy.sql.expression import func
import hashlib

api = Blueprint('api', __name__)
CORS(api)  # Permite llamadas desde el frontend

# Ruta de prueba
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({
        "message": "Hello! I'm a message that came from the backend."
    }), 200

def generate_question_hash(text, answers):
    """Genera un hash único para detectar duplicados basados en enunciado + respuestas."""
    base = f"{text}|{'|'.join(answers)}"
    return hashlib.md5(base.encode('utf-8')).hexdigest()


@api.route("/add_question", methods=["POST"])
def add_question():
    data = request.json

    try:
        # Validación mínima
        required_fields = ["category", "question", "answers", "correct_index"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Valores por defecto
        world = data.get("world", "general")
        subcategory = data.get("subcategory", "others")
        color = data.get("color", "#FFFFFF")
        difficulty = data.get("difficulty", "medium")

        # Verificar duplicados por texto + respuestas
        hash_nueva = generate_question_hash(data["question"], data["answers"])

        todas = Question.query.all()
        hashes_existentes = {
            generate_question_hash(q.question, q.answers) for q in todas
        }

        if hash_nueva in hashes_existentes:
            return jsonify({"error": "Pregunta duplicada"}), 409

        # Crear y guardar nueva pregunta
        pregunta = Question(
            category=data["category"],
            question=data["question"],
            answers=data["answers"],
            correct_index=data["correct_index"],
            color=color,
            difficulty=difficulty,
            world=world,
            subcategory=subcategory
        )

        db.session.add(pregunta)
        db.session.commit()
        return jsonify({"message": "✅ Pregunta guardada correctamente"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/questions/random', methods=['GET'])
def get_random_question():
    import random
    category = request.args.get("category")
    subcategory = request.args.get("subcategory")
    difficulty = request.args.get("difficulty")
    world = request.args.get("world")

    query = Question.query

    if category:
        query = query.filter(Question.category.ilike(f"%{category}%"))
    if subcategory:
        query = query.filter(Question.subcategory.ilike(f"%{subcategory}%"))
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    if world:
        query = query.filter(Question.world == world)

    preguntas = query.all()
    if preguntas:
        return jsonify(random.choice([p.to_dict() for p in preguntas]))
    else:
        return jsonify({"error": "No questions found"}), 404

# Obtener subcategorías según "world"
@api.route('/subcategories', methods=['GET'])
def get_subcategories():
    world = request.args.get("world")
    if not world:
        return jsonify({"error": "World is required"}), 400

    subcategories = (
        db.session.query(Question.subcategory)
        .filter_by(world=world)
        .distinct()
        .all()
    )

    result = [s[0] for s in subcategories]
    return jsonify(result)
