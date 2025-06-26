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
  const [respondido, setRespondido] = useState(false);
  const [ultimaOpcion, setUltimaOpcion] = useState(null);

  const obtenerPregunta = async (clickedOption) => {
    setCargando(true);
    setError(null);
    setPregunta(null);
    setRespuestaSeleccionada(null);
    setRespondido(false);
    setUltimaOpcion(clickedOption);

    const params = new URLSearchParams();
    let category, subcategory;

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

    try {
      const res = await fetch(`${baseURL}/api/questions/random?${params}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPregunta(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const manejarRespuesta = (index) => {
    if (respondido) return;
    setRespuestaSeleccionada(index);
    setRespondido(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Jugar con: {nombre}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {categorias.map((op, i) => (
          <button
            key={i}
            onClick={() => obtenerPregunta(op)}
            className="bg-[#f2a44c] text-white px-4 py-2 rounded-lg hover:bg-[#f2b44d]"
          >
            {typeof op === 'string' ? op : op.label}
          </button>
        ))}
      </div>

      {cargando && <p>Cargando pregunta...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {pregunta && (
        <div className="border rounded-xl p-4 shadow text-left bg-gradient-to-r from-slate-800 to-blue-900 text-white">
          <p className="text-lg font-semibold m-4">{pregunta.question}</p>

          <ul className="grid grid-cols-2 gap-4 my-4">
            {pregunta.answers.map((ans, i) => {
              const esCorrecta = i === pregunta.correct_index;
              const esSeleccionada = i === respuestaSeleccionada;

              let clases = 'border px-3 py-2 rounded cursor-pointer transition';
              if (respondido) {
                if (esCorrecta) clases += ' bg-green-500 text-white';
                else if (esSeleccionada) clases += ' bg-red-500 text-white';
                else clases += ' opacity-75';
              } else if (esSeleccionada) {
                clases += ' bg-blue-950';
              } else {
                clases += ' hover:bg-[#ec9884]';
              }

              return (
                <li key={i} className={clases} onClick={() => manejarRespuesta(i)}>
                  {ans}
                </li>
              );
            })}
          </ul>

          {respondido && (
            <>
              <div className="mt-4 text-lg font-medium">
                {respuestaSeleccionada === pregunta.correct_index ? (
                  <p className="text-green-400">✅ ¡Correcto!</p>
                ) : (
                  <p className="text-red-400">
                    ❌ Incorrecto. La respuesta correcta era:{' '}
                    <strong>{pregunta.answers[pregunta.correct_index]}</strong>
                  </p>
                )}
              </div>
              <button
                onClick={() => obtenerPregunta(ultimaOpcion)}
                className="mt-4 bg-slate-500 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Otra pregunta
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
