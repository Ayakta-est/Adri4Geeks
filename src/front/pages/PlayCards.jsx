import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const MAIN_CATS = ['Sitcoms', 'Harry Potter', 'Anime', 'Videojuegos', 'Tradicional'];
const baseURL = import.meta.env.VITE_BACKEND_URL;

export const PlayCards = () => {
  const { nombre, categorias } = useLocation().state.categoria;
  const [pregunta, setPregunta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [confirmado, setConfirmado] = useState(false);

  const obtenerPregunta = async (clickedOption) => {
    setCargando(true);
    setError(null);
    setPregunta(null);
    setRespuestaSeleccionada(null);
    setConfirmado(false);

    const params = new URLSearchParams();

    let category;
    let subcategory;

    if (typeof clickedOption === 'string') {
      if (MAIN_CATS.includes(clickedOption)) {
        category = clickedOption;
      } else {
        category = nombre;
        subcategory = clickedOption;
      }
    } else if (typeof clickedOption === 'object' && clickedOption !== null) {
      category = clickedOption.category;
      subcategory = clickedOption.label;
    }

    if (category) params.set('category', category);
    if (subcategory && subcategory !== category) params.set('subcategory', subcategory);

    const url = `${baseURL}/api/questions/random?${params}`;
    console.log('[PlayCards] Fetching question from:', url);

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

  const manejarRespuesta = (index) => {
    if (confirmado) return;
    setRespuestaSeleccionada(index);
  };

  const confirmarRespuesta = () => {
    if (respuestaSeleccionada !== null) {
      setConfirmado(true);
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
          <p className="text-lg font-semibold mb-4">{pregunta.question}</p>

          <ul className="grid grid-cols-2 gap-3">
            {pregunta.answers.map((respuesta, i) => {
              const esCorrecta = i === pregunta.correct_index;
              const esSeleccionada = i === respuestaSeleccionada;

              let clases = 'border px-3 py-2 rounded cursor-pointer transition';

              if (confirmado) {
                if (esCorrecta) {
                  clases += ' bg-green-500 text-white';
                } else if (esSeleccionada) {
                  clases += ' bg-red-500 text-white';
                } else {
                  clases += ' opacity-50';
                }
              } else if (esSeleccionada) {
                clases += ' bg-blue-200';
              } else {
                clases += ' hover:bg-gray-100';
              }

              return (
                <li key={i} className={clases} onClick={() => manejarRespuesta(i)}>
                  {respuesta}
                </li>
              );
            })}
          </ul>

          {!confirmado && (
            <button
              onClick={confirmarRespuesta}
              disabled={respuestaSeleccionada === null}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Confirmar
            </button>
          )}

          {confirmado && (
            <div className="mt-4 text-lg font-medium">
              {respuestaSeleccionada === pregunta.correct_index ? (
                <p className="text-green-600">✅ ¡Correcto!</p>
              ) : (
                <p className="text-red-600">
                  ❌ Incorrecto. La respuesta correcta era:{' '}
                  <strong>{pregunta.answers[pregunta.correct_index]}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
