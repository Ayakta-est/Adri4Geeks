import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CATEGORIAS = [
  {
    nombre: 'Sitcoms',
    color: 'bg-sky-900',
    pregunta: '¿Cómo se llama el café favorito del grupo en Friends?',
    opciones: ['Central Perk', 'Daily Grind', 'Coffee Town', 'Bean Bar'],
    categorias: ['Lugares icónicos', 'actores invitados y cameos',  'catchphrases y frases célebres', 'Romances y relaciones', '¿En qué capítulo...?', 'Adivina el personaje'],
  },
  {
    nombre: 'Harry Potter',
    color: 'bg-sky-900',
    pregunta: '¿Qué casa representa el color verde?',
    opciones: ['Ravenclaw', 'Slytherin', 'Hufflepuff', 'Gryffindor'],
    categorias: ['Casas de Hogwarts', 'Criaturas mágicas', 'Objetos y Reliquias', 'Hechizos y encantamientos', 'Adivina el personaje', 'Trama y sucesos']
  },
  {
    nombre: 'Anime',
    color: 'bg-sky-900',
    pregunta: '¿Cuál es el verdadero nombre de L en Death Note?',
    opciones: ['Light Yagami', 'Ryuk', 'L Lawliet', 'Near'],
    categorias: ['Técnicas y ataques especiales', 'Localizaciones emblemáticas', 'Adivina el personaje', 'Trama y sucesos', 'Doblaje y banda sonora', 'En qué episodio...?']
  },
  {
    nombre: 'Videojuegos',
    color: 'bg-sky-900',
    pregunta: '¿Qué compañía creó The Legend of Zelda?',
    opciones: ['Sony', 'Nintendo', 'Sega', 'Ubisoft'],
    categorias: ['Shooters y acción', 'Deportes y Carreras', 'RPG y fantasía', 'Terror y Survival', 'Mobile Games', 'Clásicos y franquicias de culto']
  },
  {
    nombre: 'Tradicional',
    color: 'bg-sky-900',
    pregunta: '¿Cuál es la capital de Francia?',
    opciones: ['Roma', 'Madrid', 'París', 'Berlín'],
    categorias: ['Deporte y pasatiempos', 'Geografía', 'Ciencias y  naturaleza', 'Historia', 'Arte y Literatura', 'Entretenimiento']
  },
];

export const CardsToChoose = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modo = location.state?.modo;

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [mostrarModalPersonalizada, setMostrarModalPersonalizada] = useState(false);

  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);
  const [inputsPersonalizados, setInputsPersonalizados] = useState(
    Array(6).fill({ category: '', label: '' })
  );

  useEffect(() => {
    if (!modo) navigate('/');
  }, [modo, navigate]);

  const handleConfirmarCategoria = () => {
  const nombre = categoriaSeleccionada?.nombre;
  if (!nombre) return;

  const yaSeleccionada = cartasSeleccionadas.includes(nombre);
  const nuevaSeleccion = yaSeleccionada ? [] : [nombre];
  setCartasSeleccionadas(nuevaSeleccion);
  setMostrarModalCategoria(false);

  const ruta = modo === 'solo' ? '/play-cards' : '/play-board';
  navigate(ruta, {
    state: {
      categoria: categoriaSeleccionada
    }
  });
};

  const handleConfirmarPersonalizada = () => {
    const seleccionadas = inputsPersonalizados.filter(v => v.category && v.label);

    if (seleccionadas.length === 0) return;

    const pseudoCat = {
      nombre: 'Personalizada',
      categorias: seleccionadas
    };

    setCartasSeleccionadas(['Personalizada']);
    setCategoriaSeleccionada(pseudoCat);
    setMostrarModalPersonalizada(false);

    const ruta = modo === 'solo' ? '/play-cards' : '/play-board';
    navigate(ruta, {
      state: {
        categoria: pseudoCat
      }
    });
  };

  const handleInputChange = (i, value) => {
    const [category, label = ''] = value.split('|');
    const nuevos = [...inputsPersonalizados];
    nuevos[i] = { category, label: label || category };
    setInputsPersonalizados(nuevos);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4 text-white">Elige con qué conjunto de cartas jugar</h1>
      <p className="mb-6 text-gray-600">Modo: <strong>{modo}</strong></p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {CATEGORIAS.map((cat, index) => (
          <button
            key={index}
            onClick={() => {
              setCategoriaSeleccionada(cat);
              setMostrarModalCategoria(true);
            }}
            className={`${cat.color} rounded-xl p-4 text-left shadow hover:shadow-md transition cursor-pointer`}
          >
            <h3 className="text-lg font-bold mb-2 text-white">{cat.nombre}</h3>
            <div className="bg-white border rounded-lg p-3 text-sm">
              <p className="font-semibold mb-2">{cat.pregunta}</p>
              <ul className="grid grid-cols-2 gap-2">
                {cat.opciones.map((op, i) => (
                  <li key={i} className="border px-2 py-1 rounded text-center">{op}</li>
                ))}
              </ul>
            </div>
          </button>
        ))}

        {/* Selección personalizada */}
        <button
          onClick={() => {
            setMostrarModalPersonalizada(true);
            setCategoriaSeleccionada({ nombre: 'Personalizada' });
          }}
          className="bg-sky-900 rounded-xl p-4 text-left shadow hover:shadow-md transition"
        >
          <h3 className="text-lg font-bold mb-2 text-white">Personalizada</h3>
          <div className="bg-white border rounded-lg p-3 text-sm">
            <p className="font-semibold mb-2">Utiliza las categorías o subcategorías que quieras para tu partida</p>
            <ul className="grid grid-cols-2 gap-2 text-gray-500">
              <li>Anime</li>
              <li>Sitcoms</li>
              <li>Trama y sucesos</li>
              <li>Opción a elegir</li>
            </ul>
          </div>
        </button>
      </div>

      {/* Modal de categoría */}
      {mostrarModalCategoria && categoriaSeleccionada && (
        <div className="fixed inset-0 bg-gradient-to-r from-fuchsia-800 to-indigo-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md text-left">
            <h2 className="text-xl font-bold mb-2">{categoriaSeleccionada.nombre}</h2>
            <p className="font-semibold mb-2">{categoriaSeleccionada.pregunta}</p>
            <ul className="grid grid-cols-2 gap-2 mb-4">
              {categoriaSeleccionada.opciones.map((op, i) => (
                <li key={i} className="border px-2 py-1 rounded text-center">{op}</li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMostrarModalCategoria(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarCategoria}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal personalizada */}
      {mostrarModalPersonalizada && (
        <div className="fixed inset-0 bg-gradient-to-r from-blue-500 to-blue-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md text-left">
            <h2 className="text-xl font-bold mb-4">Personaliza tus preguntas</h2>
            {inputsPersonalizados.map((val, i) => (
              <div key={i} className="mb-2">
                <label className="block text-sm font-medium mb-1">Categoría {i + 1}</label>
                <select
                  value={`${val.category}|${val.label}`}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Anime|Anime">Anime</option>
                  <option value="Sitcoms|Sitcoms">Sitcoms</option>
                  <option value="Harry Potter|Harry Potter">Harry Potter</option>
                  <option value="Tradicional|Tradicional">Tradicional</option>
                  <option value="Videojuegos|Videojuegos">Videojuegos</option>
                  <option value="Anime|Técnicas y ataques especiales">Anime: Técnicas y ataques especiales</option>
                  <option value="Anime|Localizaciones emblemáticas">Anime: Localizaciones emblemáticas</option>
                  <option value="Anime|Adivina el personaje">Anime: Adivina el personaje</option>
                  <option value="Anime|Trama y sucesos">Anime: Trama y sucesos</option>
                  <option value="Anime|Doblaje y banda sonora">Anime: Doblaje y banda sonora</option>
                  <option value="Anime|En qué episodio...?">Anime: En qué episodio...?</option>
                  <option value="Sitcoms|Catchphrases y frases célebres">Sitcoms: Catchphrases y frases célebres</option>
                  <option value="Sitcoms|Localizaciones emblemáticas">Sitcoms: Localizaciones emblemáticas</option>
                  <option value="Sitcoms|Romances y relaciones">Sitcoms: Romances y relaciones</option>
                  <option value="Sitcoms|Actores invitados y cameos">Sitcoms: Actores invitados y cameos</option>
                  <option value="Sitcoms|Adivina el personaje">Sitcoms: Adivina el personaje</option>
                  <option value="Sitcoms|¿En qué capítulo...?">Sitcoms: ¿En qué capítulo...?</option>
                  <option value="Harry Potter|Casas de Hogwarts">Harry Potter: Casas de Hogwarts</option>
                  <option value="Harry Potter|Criaturas mágicas">Harry Potter: Criaturas mágicas</option>
                  <option value="Harry Potter|Objetos y Reliquias">Harry Potter: Objetos y Reliquias</option>
                  <option value="Harry Potter|Hechizos y encantamientos">Harry Potter: Hechizos y encantamientos</option>
                  <option value="Harry Potter|Adivina el personaje">Harry Potter: Adivina el personaje</option>
                  <option value="Harry Potter|Trama y sucesos">Harry Potter: Trama y sucesos</option>
                </select>
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMostrarModalPersonalizada(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarPersonalizada}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
