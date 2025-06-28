import React, { useRef, useEffect } from "react";
import Board from "../components/Board";
import { createPiece } from "../components/Piece";

export const PlayBoard = () => {      // ⬅ export nombrado
  const boardRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current) return;
    boardRef.current.add(createPiece(0, 0xffff00));
  }, []);

  return <Board ref={boardRef} />;
};