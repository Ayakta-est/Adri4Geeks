import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Board from "../components/Board";
import { path } from "../data/path.js";
import * as THREE from "three";

export const PlayBoard = () => {
  const location = useLocation();
  const boardRef = useRef(null);
  const pieceRefs = useRef([]);

  const getColorByAvatar = (avatar) => {
    const colors = {
      circulo: 0xff0000,
      estrella: 0xffff00,
      cuadro: 0x0000ff,
      triangulo: 0x00ff00,
    };
    return colors[avatar] ?? 0xffffff;
  };

  const createPiece = (index, color, offsetIndex) => {
  const geo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 32);
  geo.translate(0, 0.2, 0);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color }));

  const [x, z] = path[index].pos;

  // Posiciones tipo cuadrícula 2x2 dentro de la casilla
  const tileOffsets = [
    [-0.2, -0.2],
    [ 0.2, -0.2],
    [-0.2,  0.2],
    [ 0.2,  0.2],
  ];

  const [dx, dz] = tileOffsets[offsetIndex] || [0, 0];
  mesh.position.set(x + dx, 0.8, z + dz);

  return mesh;
};

  useEffect(() => {
    const { players } = location.state;
    if (!boardRef.current || !players?.length) return;

    players.forEach((player, i) => {
      const piece = createPiece(0, getColorByAvatar(player.avatar), i, players.length);
      pieceRefs.current[i] = piece;
      boardRef.current.add(piece);
    });
  }, [location.state]);

  return <Board ref={boardRef} />;
};
