import random
from models import Question
from app import db  # o donde tengas instanciado db

def filtrar_pregunta_aleatoria(filtros: dict):
    query = db.session.query(Question)

    if filtros.get('category'):
        query = query.filter_by(category=filtros['category'])

    if filtros.get('subcategory'):
        query = query.filter_by(subcategory=filtros['subcategory'])

    if filtros.get('difficulty'):
        query = query.filter_by(difficulty=filtros['difficulty'])

    if filtros.get('world'):
        query = query.filter_by(world=filtros['world'])

    preguntas = query.all()

    if preguntas:
        return random.choice(preguntas)
    return None
