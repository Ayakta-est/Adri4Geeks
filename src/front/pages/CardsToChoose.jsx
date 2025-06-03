import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const CardsToChoose = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modo = location.state?.modo;

  useEffect(() => {
    if (!modo) {
      // Si llegan sin modo manda al Home
      navigate('/');
    }
  }, [modo, navigate]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Elegir cartas</h1>
      <p className="mb-2">Modo seleccionado: <strong>{modo}</strong></p>
      
      {/* Aquí puedes condicionar lo que muestras según el modo */}
      {modo === 'solo' && <p>Mostrar solo las cartas.</p>}
      {modo === 'tablero' && <p>Elegir cartas para usar con tablero.</p>}
    </div>
  );
}
