import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Board from "../components/Board";
import { path } from "../data/path";
import { mainPath } from "../data/mainPath";
import * as THREE from "three";

const OFFSETS = [
  [-0.2, -0.2],
  [ 0.2, -0.2],
  [-0.2,  0.2],
  [ 0.2,  0.2],
];

const AVATAR_COLORS = {
  circulo: 0xff0000,
  estrella: 0xffff00,
  cuadro: 0x0000ff,
  triangulo: 0x00ff00,
};

export const PlayBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const boardRef = useRef(null);
  const pieceRefs = useRef([]);

  const { players: playerData, mode } = location.state;
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceResult, setDiceResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState("");

  // Crear ficha
  const createPiece = (tileIndex, color, offsetIndex) => {
    const geo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 32);
    geo.translate(0, 0.1, 0);
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color }));

    const [x, z] = path[tileIndex].pos;
    const [dx, dz] = OFFSETS[offsetIndex] || [0, 0];
    mesh.position.set(x + dx, 0.8, z + dz);
    return mesh;
  };

  // Mover ficha paso a paso
  const movePieceToIndex = (piece, fromIndex, toIndex, offsetIndex, onDone) => {
    let step = fromIndex;

    const interval = setInterval(() => {
      step++;
      const realPathIndex = mainPath[step % mainPath.length];
      const [x, z] = path[realPathIndex].pos;
      const [dx, dz] = OFFSETS[offsetIndex] || [0, 0];
      boardRef.current.move(piece, x + dx, z + dz);

      if ((step % mainPath.length) === toIndex) {
        clearInterval(interval);
        onDone?.(step % mainPath.length);
      }
    }, 300);
  };

  // Lanzar dado y mover ficha
  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);

    const numDice = mode === "normal" ? 2 : 1;
    const result = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6 + 1));
    const total = result.reduce((a, b) => a + b, 0);
    setDiceResult(total);

    const player = players[currentPlayer];
    const newIndex = (player.index + total) % mainPath.length;
    const newLap = (player.index + total) >= mainPath.length ? player.lap + 1 : player.lap;

    const piece = pieceRefs.current[currentPlayer];
    movePieceToIndex(piece, player.index, newIndex, currentPlayer, () => {
      // Check win
      const win = mode === "normal" ? newLap >= 3 : newLap >= 1;
      if (win) {
        setMessage(`${player.name} ha ganado 🎉`);
        return;
      }

      // Update player state
      setPlayers((prev) =>
        prev.map((p, i) =>
          i === currentPlayer ? { ...p, index: newIndex, lap: newLap } : p
        )
      );

      setTimeout(() => {
        setCurrentPlayer((prev) => (prev + 1) % players.length);
        setDiceResult(null);
        setIsRolling(false);
      }, 800);
    });
  };

  // Inicializar fichas y jugadores
  useEffect(() => {
    if (!boardRef.current || !playerData) return;

    const initial = playerData.map((p, i) => {
      const piece = createPiece(0, AVATAR_COLORS[p.avatar], i);
      pieceRefs.current[i] = piece;
      boardRef.current.add(piece);
      return {
        ...p,
        index: 0,
        lap: 0,
        token: false, // para camino especial
      };
    });

    setPlayers(initial);
  }, [playerData]);

  return (
    <div className="relative w-full h-screen">
      <Board ref={boardRef} />
      
      <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-xl shadow space-y-2">
        <h2 className="font-semibold text-lg">Turno de: {players[currentPlayer]?.name}</h2>
        {diceResult && <div>Resultado: 🎲 {diceResult}</div>}
        {!message && (
          <button
            onClick={handleRoll}
            disabled={isRolling}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Lanzar dado
          </button>
        )}
        {message && (
          <div className="text-green-600 font-bold">{message}</div>
        )}
      </div>
    </div>
  );
};
