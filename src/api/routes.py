from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Question
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy.sql.expression import func

api = Blueprint('api', __name__)
CORS(api)  # Permite llamadas desde el frontend

# Ruta de prueba
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({
        "message": "Hello! I'm a message that came from the backend."
    }), 200


# Añadir pregunta
@api.route("/add_question", methods=["POST"])
def add_question():
    data = request.json

    try:
        # Valores por defecto
        world = data.get("world", "general")
        subcategory = data.get("subcategory", "others")

        question = Question(
            category=data["category"],
            question=data["question"],
            answers=data["answers"],
            correct_index=data["correct_index"],
            color=data.get("color", "#FFFFFF"),
            difficulty=data.get("difficulty", "medium"),
            world=world,
            subcategory=subcategory
        )

        db.session.add(question)
        db.session.commit()
        return jsonify({"message": "Pregunta guardada correctamente"}), 201

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
