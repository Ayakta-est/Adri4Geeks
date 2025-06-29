import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import Board from "../components/Board";
import { PreguntaModal } from "../components/PreguntaModal";
import { useGameLogic } from "../hooks/useGameLogic";
import { TokenShortcutModal } from "../components/TokenShortcutModal";

export const PlayBoard = () => {
  const location = useLocation();
  const boardRef = useRef(null);

    const {
      players,
      currentPlayer,
      diceResult,
      isRolling,
      message,
      modalPregunta,
      preguntaData,
      responderPregunta,
      lanzarDado,
      modalToken,
      entregarToken,
    } = useGameLogic({
      playerData: location.state.players,
      mode: location.state.mode,
      boardRef,
      category: location.state.category,
    });

  return (
    <div className="relative w-full h-screen">
      <Board ref={boardRef} />

      <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-xl shadow space-y-2">
        <h2 className="font-semibold text-lg">
          Turno de: {players[currentPlayer]?.name}
        </h2>
        {diceResult && <div>Resultado: 🎲 {diceResult}</div>}
        {!message && (
          <button
            onClick={lanzarDado}
            disabled={isRolling}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Lanzar dado
          </button>
        )}
        {message && <div className="text-green-600 font-bold">{message}</div>}
      </div>

      {modalPregunta && preguntaData && (
        <PreguntaModal
          pregunta={preguntaData}
          onResponder={responderPregunta}
        />
      )}

      {modalToken && (
        <TokenShortcutModal players={players} onSelect={entregarToken} />
      )}
    </div>
  );
};
