import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from 'react-router-dom';

export const Home = () => {

	const navigate = useNavigate();

  const handleSeleccion = (modo) => {
    navigate('/cards-to-choose', { state: { modo } }); // "modo" como state
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-2xl font-bold mb-8">¿Cómo quieres jugar?</h1>

      <div className="flex flex-col gap-6 w-full max-w-md">
        <button
          onClick={() => handleSeleccion('solo')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-6 px-4 rounded-2xl shadow-md text-lg"
        >
          Usar solo tarjetas de juego
        </button>

        <button
          onClick={() => handleSeleccion('tablero')}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-6 px-4 rounded-2xl shadow-md text-lg"
        >
          Jugar con tablero
        </button>
      </div>
    </div>
  );
}