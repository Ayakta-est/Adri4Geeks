import { useEffect, useRef, useState } from "react";
import { path } from "../data/path";
import { mainPath } from "../data/mainPath";
import * as THREE from "three";

const baseURL = import.meta.env.VITE_BACKEND_URL;
const OFFSETS = [
  [-0.2, -0.2],
  [0.2, -0.2],
  [-0.2, 0.2],
  [0.2, 0.2],
];

const AVATAR_COLORS = {
  circulo: 0xff0000,
  estrella: 0xffff00,
  cuadro: 0x0000ff,
  triangulo: 0x00ff00,
};

export const useGameLogic = ({ playerData, mode, boardRef, category }) => {
    const pieceRefs = useRef([]);
    const preguntaTipoRef = useRef(null); 
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [diceResult, setDiceResult] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [message, setMessage] = useState("");
    const [modalPregunta, setModalPregunta] = useState(false);
    const [preguntaData, setPreguntaData] = useState(null);
    const [modalToken, setModalToken] = useState(false);
    const [tokenDador, setTokenDador] = useState(null);
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  const createPiece = (tileIndex, color, offsetIndex) => {
    const geo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 32);
    geo.translate(0, 0.1, 0);
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color }));
    const [x, z] = path[tileIndex].pos;
    const [dx, dz] = OFFSETS[offsetIndex] || [0, 0];
    mesh.position.set(x + dx, 0.8, z + dz);
    return mesh;
  };

  const movePieceToIndex = (piece, fromIndex, toIndex, offsetIndex, onDone) => {
    let step = fromIndex;
    const player = players[currentPlayer];

    let route = [];
    if (player.token && fromIndex === 37) {
      route = [47, 48, 49, 50, 51, 52, 53, 54];
      setPlayers((prev) =>
        prev.map((p, i) => (i === currentPlayer ? { ...p, token: false } : p))
      );
    } else if (player.token && fromIndex === 8) {
      route = [23];
      setPlayers((prev) =>
        prev.map((p, i) => (i === currentPlayer ? { ...p, token: false } : p))
      );
    } else {
      for (let i = fromIndex + 1; i !== (toIndex + 1) % mainPath.length; i = (i + 1) % mainPath.length) {
        route.push(mainPath[i]);
      }
    }

    let idx = 0;
    const interval = setInterval(() => {
      const realPathIndex = route[idx];
      const [x, z] = path[realPathIndex].pos;
      const [dx, dz] = OFFSETS[offsetIndex] || [0, 0];
      boardRef.current.move(piece, x + dx, z + dz);
      idx++;
      if (idx >= route.length) {
        clearInterval(interval);
        onDone?.((fromIndex + route.length) % mainPath.length);
      }
    }, 300);
  };

  const obtenerPregunta = async () => {
    try {
      const res = await fetch(`${baseURL}/api/questions/random?category=${category}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setPreguntaData(data);
      setEsperandoRespuesta(true);
    } catch (err) {
      console.error("Error al obtener pregunta:", err);
    }
  };

  const responderPregunta = (correcta = false) => {
  const tipo = preguntaTipoRef.current;
  preguntaTipoRef.current = null;

  setModalPregunta(false);
  setPreguntaData(null);
  setEsperandoRespuesta(false);

  if (tipo === "T" && correcta) {
    setTokenDador(currentPlayer);
    setModalToken(true);
  } else {
    avanzarTurno();
  }
};

  const avanzarTurno = () => {
    setTimeout(() => {
      setCurrentPlayer((prev) => (prev + 1) % players.length);
      setDiceResult(null);
      setIsRolling(false);
    }, 800);
  };

  const entregarToken = (targetIndex) => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === targetIndex ? { ...p, token: true } : p))
    );
    setModalToken(false);
    setTokenDador(null);
    avanzarTurno();
  };

  const lanzarDado = () => {
    if (isRolling || esperandoRespuesta) return;
    setIsRolling(true);

    const numDice = mode === "normal" ? 2 : 1;
    const result = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6 + 1));
    const total = result.reduce((a, b) => a + b, 0);
    setDiceResult(total);

    const player = players[currentPlayer];
    const newIndex = (player.index + total) % mainPath.length;
    const newLap = (player.index + total) >= mainPath.length ? player.lap + 1 : player.lap;
   
    const piece = pieceRefs.current[currentPlayer];
    movePieceToIndex(piece, player.index, newIndex, currentPlayer, (finalIndex) => {
      const realTile = path[mainPath[finalIndex]];

      setPlayers((prev) =>
        prev.map((p, i) =>
          i === currentPlayer ? { ...p, index: finalIndex, lap: newLap } : p
        )
      );

        if (realTile.type === "P" || realTile.type === "T") {
            preguntaTipoRef.current = realTile.type;   // ← guarda el tipo aquí
            setModalPregunta(true);
            obtenerPregunta();
        } else {
            avanzarTurno();
        }
    });
  };

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
        token: false,
      };
    });

    setPlayers(initial);
  }, [playerData]);

  return {
    players,
    currentPlayer,
    diceResult,
    isRolling,
    message,
    modalPregunta,
    preguntaData,
    responderPregunta,
    lanzarDado,
    categoria: category,
    modalToken,
    entregarToken,
  };
};
