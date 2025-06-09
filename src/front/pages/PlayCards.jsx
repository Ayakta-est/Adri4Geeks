import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export const PlayCards = () => {
  const location = useLocation();
  const categoria = location.state?.categoria;

  const [pregunta, setPregunta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerPregunta = async (subcat) => {
    setCargando(true);
    setError(null);
    setPregunta(null);

    const url = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/questions/random?subcategory=${encodeURIComponent(subcat)}`;
    console.log('[PlayCards] Fetching question from:', url);

    try {
      const res = await fetch(url);

      console.log('[PlayCards] Response status:', res.status);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} — ${text}`);
      }

      const data = await res.json();
      console.log('[PlayCards] Received data:', data);

      if (data.error) {
        throw new Error(data.error);
      }

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
      <h1 className="text-2xl font-bold mb-4">Jugar con: {categoria?.nombre}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {categoria?.categorias?.map((subcat, i) => (
          <button
            key={i}
            onClick={() => obtenerPregunta(subcat)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {subcat}
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
