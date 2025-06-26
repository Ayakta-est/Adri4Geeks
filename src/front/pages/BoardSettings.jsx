import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const avatars = ["circulo", "estrella", "cuadro", "triangulo"];
const categorias = ["Harry Potter", "Sitcoms", "Tradicional", "Anime", "Videojuegos"];

const PlayerSetupCard = ({ index, player, onChange, allPlayers }) => {
  const handleNameChange = (e) => {
    onChange(index, { ...player, name: e.target.value });
  };

  const handleAvatarChange = (avatar) => {
    if (allPlayers.some((p, i) => i !== index && p.avatar === avatar)) return;
    onChange(index, { ...player, avatar });
  };

  return (
    <div className="p-4 border rounded-xl shadow space-y-2">
      <h3 className="font-semibold">Jugador {index + 1}</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={player.name}
        onChange={handleNameChange}
        className="border p-2 rounded w-full"
      />
      <div className="flex space-x-2 mt-2">
        {avatars.map((av) => (
          <button
            key={av}
            onClick={() => handleAvatarChange(av)}
            className={`w-10 h-10 rounded-full border-2 ${
              player.avatar === av ? "border-blue-500" : "border-gray-300"
            } flex items-center justify-center ${
              allPlayers.some((p, i) => i !== index && p.avatar === av) ? "opacity-30 cursor-not-allowed" : ""
            }`}
            disabled={allPlayers.some((p, i) => i !== index && p.avatar === av)}
          >
            {av[0].toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export const BoardSettings = () => {
  const navigate = useNavigate();

  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([
    { name: "", avatar: "" },
    { name: "", avatar: "" },
  ]);
  const [mode, setMode] = useState("normal");
  const [category, setCategory] = useState("");

  const updatePlayer = (index, newPlayer) => {
    const newPlayers = [...players];
    newPlayers[index] = newPlayer;
    setPlayers(newPlayers);
  };

  const changeNumPlayers = (delta) => {
    const newNum = Math.min(4, Math.max(2, numPlayers + delta));
    setNumPlayers(newNum);
    setPlayers((prev) => {
      const copy = [...prev];
      while (copy.length < newNum) copy.push({ name: "", avatar: "" });
      return copy.slice(0, newNum);
    });
  };

  const names = players.slice(0, numPlayers).map(p => p.name);
  const avatarsSelected = players.slice(0, numPlayers).map(p => p.avatar);
  const uniqueNames = new Set(names);
  const uniqueAvatars = new Set(avatarsSelected);

  const canStart =
    names.every(n => n) &&
    avatarsSelected.every(a => a) &&
    uniqueNames.size === numPlayers &&
    uniqueAvatars.size === numPlayers &&
    category;

  const handleStart = () => {
    if (canStart) {
      navigate("/play-board", {
        state: {
          players: players.slice(0, numPlayers),
          mode,
          category,
        },
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Jugadores: {numPlayers}</span>
        <div className="space-x-2">
          <button
            onClick={() => changeNumPlayers(-1)}
            disabled={numPlayers === 2}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded disabled:opacity-50"
          >
            -
          </button>
          <button
            onClick={() => changeNumPlayers(1)}
            disabled={numPlayers === 4}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.slice(0, numPlayers).map((player, i) => (
          <PlayerSetupCard
            key={i}
            index={i}
            player={player}
            onChange={updatePlayer}
            allPlayers={players.slice(0, numPlayers)}
          />
        ))}
      </div>

      <div>
        <label className="block font-semibold mb-1">Categoría</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex space-x-4">
          <button
            onClick={() => setMode("normal")}
            className={`py-2 px-4 rounded font-semibold ${
              mode === "normal" ? "bg-blue-600 text-white" : "border border-gray-400"
            }`}
          >
            Modo normal
          </button>
          <button
            onClick={() => setMode("rapido")}
            className={`py-2 px-4 rounded font-semibold ${
              mode === "rapido" ? "bg-blue-600 text-white" : "border border-gray-400"
            }`}
          >
            Modo rápido
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {mode === "normal"
            ? "3 vueltas al tablero. La dificultad aumenta con cada vuelta."
            : "1 vuelta. Preguntas con dificultad aleatoria."}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={!canStart}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        Iniciar partida
      </button>
    </div>
  );
};
