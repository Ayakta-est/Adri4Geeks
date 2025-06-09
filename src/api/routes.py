"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Question
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import json

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# app.py (añadir esto)

@api.route("/add_question", methods=["POST"])
def add_question():
    data = request.json

    try:
        # Extraemos los campos con defaults
        world = data.get("world", "general")
        subcategory = data.get("subcategory", "others")

        # Creamos la instancia sólo una vez, con todas las props
        question = Question(
            category=data["category"],
            question=data["question"],
            answers=data["answers"],
            correct_index=data["correct_index"],
            color=data.get("color", "#FFFFFF"),
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
    subcategory = request.args.get("subcategory")
    query = Question.query
    if subcategory:
        query = query.filter(Question.subcategory.ilike(f"%{subcategory}%"))
    preguntas = query.all()
    if preguntas:
        return jsonify(random.choice([p.to_dict() for p in preguntas]))
    else:
        return jsonify({"error": "No questions found"}), 404

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
