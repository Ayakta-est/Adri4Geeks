import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const MAIN_CATS = ['Sitcoms', 'Harry Potter', 'Anime', 'Videojuegos', 'Tradicional'];
const baseURL = import.meta.env.VITE_BACKEND_URL;

export const PlayCards = () => {
  const { nombre, categorias } = useLocation().state.categoria;
  const [pregunta, setPregunta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerPregunta = async (clickedOption) => {
  setCargando(true);
  setError(null);
  setPregunta(null);

  const params = new URLSearchParams();

  let category;
let subcategory;

// Si es string
  if (typeof clickedOption === 'string') {
    if (MAIN_CATS.includes(clickedOption)) {
      category = clickedOption;
    } else {
      category = nombre; // categoría principal desde useLocation
      subcategory = clickedOption;
    }
  } else if (typeof clickedOption === 'object' && clickedOption !== null) {
    category = clickedOption.category;
    subcategory = clickedOption.label;
  }

  // Setear parámetros correctamente
  if (category) params.set('category', category);
  if (subcategory && subcategory !== category) params.set('subcategory', subcategory);

  params.set('category', category);

  const url = `${baseURL}/api/questions/random?${params}`;
  console.log('[PlayCards] Fetching question from:', url);
  console.log('🛠 category:', category);
  console.log('🛠 subcategory:', params.get('subcategory'));

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    setPregunta(data);
  } catch (err) {
    console.error('[PlayCards] Error al obtener pregunta:', err);
    setError(err.message);
  } finally {
    setCargando(false);
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Jugar con: {nombre}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {categorias.map((opcion, i) => (
          <button
            key={i}
            onClick={() => obtenerPregunta(opcion)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {typeof opcion === 'string' ? opcion : opcion.label}
          </button>
        ))}
      </div>

      {cargando && <p>Cargando pregunta...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {pregunta && (
        <div className="border rounded-xl p-4 bg-white shadow text-left">
          <p className="text-lg font-semibold mb-2">{pregunta.question}</p>
          <ul className="grid grid-cols-2 gap-2">
            {pregunta.answers.map((a, i) => (
              <li key={i} className="border px-2 py-1 rounded">{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
