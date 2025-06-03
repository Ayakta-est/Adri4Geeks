import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const CardsToChoose = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modo = location.state?.modo;

  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);
  const [cartaPersonalizada, setCartaPersonalizada] = useState('');

  useEffect(() => {
    if (!modo) navigate('/');
  }, [modo, navigate]);

  const handleAgregarCartaPersonalizada = () => {
    if (cartaPersonalizada.trim()) {
      setCartasSeleccionadas(prev => [...prev, cartaPersonalizada.trim()]);
      setCartaPersonalizada('');
    }
  };

  const handleJugar = () => {
    if (cartasSeleccionadas.length === 0) return;

    const ruta = modo === 'solo' ? '/play-solo' : '/play-board';
    navigate(ruta, { state: { cartas: cartasSeleccionadas } });
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Selecciona tus cartas</h1>
      <p className="mb-4 text-gray-600">Modo: <strong>{modo}</strong></p>

      {/* Ejemplo de cartas predefinidas */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {['Carta 1', 'Carta 2', 'Carta 3'].map((carta, index) => (
          <button
            key={index}
            onClick={() => setCartasSeleccionadas(prev => [...prev, carta])}
            className="bg-blue-200 p-3 rounded shadow hover:bg-blue-300"
          >
            {carta}
          </button>
        ))}
      </div>

      {/* Añadir cartas personalizadas */}
      <div className="mb-6">
        <input
          type="text"
          value={cartaPersonalizada}
          onChange={(e) => setCartaPersonalizada(e.target.value)}
          placeholder="Escribe tu carta"
          className="border px-3 py-2 w-full mb-2"
        />
        <button
          onClick={handleAgregarCartaPersonalizada}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Añadir carta personalizada
        </button>
      </div>

      {/* Cartas seleccionadas */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Cartas seleccionadas:</h2>
        <ul className="list-disc pl-5">
          {cartasSeleccionadas.map((carta, i) => (
            <li key={i}>{carta}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleJugar}
        className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-green-700"
      >
        Jugar
      </button>
    </div>
  );
}
