import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CATEGORIAS = [
  {
    nombre: 'Sitcoms',
    color: 'bg-blue-200',
    pregunta: '¿Cómo se llama el café favorito del grupo en Friends?',
    opciones: ['Central Perk', 'Daily Grind', 'Coffee Town', 'Bean Bar'],
    categorías: ['Lugares icónicos', 'actores invitados y cameos',  'catchphrases y frases célebres', 'Romances y relaciones', 'En qué capitulo...', 'Adivina el personaje'],
  },
  {
    nombre: 'Harry Potter',
    color: 'bg-green-200',
    pregunta: '¿Qué casa representa el color verde?',
    opciones: ['Ravenclaw', 'Slytherin', 'Hufflepuff', 'Gryffindor'],
    categorías: ['Casas de Hogwarts', 'Criaturas mágicas', 'Objetos y Reliquias', 'Hechizos y encantamientos', 'Adivina el personaje']
  },
  {
    nombre: 'Anime',
    color: 'bg-red-200',
    pregunta: '¿Cuál es el verdadero nombre de L en Death Note?',
    opciones: ['Light Yagami', 'Ryuk', 'L Lawliet', 'Near'],
    categorías: ['Técnicas y ataques especiales', 'Locaciones emblemáticas', 'Adivina el personaje']
  },
  {
    nombre: 'Videojuegos',
    color: 'bg-yellow-200',
    pregunta: '¿Qué compañía creó The Legend of Zelda?',
    opciones: ['Sony', 'Nintendo', 'Sega', 'Ubisoft'],
  },
  {
    nombre: 'Tradicional',
    color: 'bg-purple-200',
    pregunta: '¿Cuál es la capital de Francia?',
    opciones: ['Roma', 'Madrid', 'París', 'Berlín'],
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

  const [inputsPersonalizados, setInputsPersonalizados] = useState(Array(6).fill(''));

  useEffect(() => {
    if (!modo) navigate('/');
  }, [modo, navigate]);

  const handleConfirmarCategoria = () => {
    const yaSeleccionada = cartasSeleccionadas.includes(categoriaSeleccionada.nombre);
    if (yaSeleccionada) {
      setCartasSeleccionadas([]);
    } else {
      setCartasSeleccionadas([categoriaSeleccionada.nombre]);
    }
    setMostrarModalCategoria(false);
  };

  const handleConfirmarPersonalizada = () => {
    const yaSeleccionada = cartasSeleccionadas.includes('Personalizada');
    if (yaSeleccionada) {
      setCartasSeleccionadas([]);
    } else {
      setCartasSeleccionadas(['Personalizada']);
    }
    setMostrarModalPersonalizada(false);
  };

  const handleInputChange = (i, value) => {
    const nuevos = [...inputsPersonalizados];
    nuevos[i] = value;
    setInputsPersonalizados(nuevos);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Elige con qué conjunto de cartas jugar</h1>
      <p className="mb-2">Solo puedes seleccionar una categoría.</p>
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
            <h3 className="text-lg font-bold mb-2">{cat.nombre}</h3>
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

        {/* Carta personalizada */}
        <button
          onClick={() => {
            setMostrarModalPersonalizada(true);
            setCategoriaSeleccionada(null);
          }}
          className="bg-pink-200 rounded-xl p-4 text-left shadow hover:shadow-md transition"
        >
          <h3 className="text-lg font-bold mb-2">Personalizada</h3>
          <div className="bg-white border rounded-lg p-3 text-sm">
            <p className="font-semibold mb-2">Utiliza las categorías que quieras para tu partida</p>
            <ul className="grid grid-cols-2 gap-2 text-gray-500">
              <li>Categoría 1 </li>
              <li>Categoría 2</li>
              <li>Categoría 3</li>
              <li>Categoría 4</li>
            </ul>
          </div>
        </button>
      </div>

      {/* Mostrar cartas seleccionadas */}
      <div className="mb-6 text-left max-w-md mx-auto">
        <h2 className="font-semibold mb-2">Categoría seleccionada:</h2>
        <ul className="list-disc pl-5">
          {cartasSeleccionadas.map((carta, i) => (
            <li key={i}>{carta}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => {
          if (cartasSeleccionadas.length > 0) {
            const ruta = modo === 'solo' ? '/play-cards' : '/play-board';
            navigate(ruta, {
              state: {
                categoria: categoriaSeleccionada, // objeto completo
                inputs: inputsPersonalizados
              }
            });
          }
        }}
        className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-green-700"
      >
        Jugar
      </button>

      {/* Modal categoría */}
      {mostrarModalCategoria && categoriaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md text-left">
            <h2 className="text-xl font-bold mb-4">Personaliza tus preguntas</h2>
            {inputsPersonalizados.map((val, i) => (
              <input
                key={i}
                type="text"
                value={val}
                onChange={(e) => handleInputChange(i, e.target.value)}
                placeholder={`Pregunta ${i + 1}`}
                className="w-full border px-3 py-2 rounded mb-2"
              />
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
