import os
import json
import random

BASE_DIR = 'data/preguntas'

def cargar_preguntas_de_archivo(nombre_archivo):
    path = os.path.join(BASE_DIR, nombre_archivo)
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def filtrar_pregunta_aleatoria(filtros: dict):
    preguntas_filtradas = []

    # Cargar todos los archivos de preguntas
    for archivo in os.listdir(BASE_DIR):
        if archivo.endswith('.json'):
            preguntas = cargar_preguntas_de_archivo(archivo)

            for pregunta in preguntas:
                if filtros.get('category') and pregunta['category'] != filtros['category']:
                    continue
                if filtros.get('subcategory') and pregunta['subcategory'] != filtros['subcategory']:
                    continue
                if filtros.get('difficulty') and pregunta['difficulty'] != filtros['difficulty']:
                    continue
                if filtros.get('world') and pregunta['world'] != filtros['world']:
                    continue

                preguntas_filtradas.append(pregunta)

    if preguntas_filtradas:
        return random.choice(preguntas_filtradas)
    return None
