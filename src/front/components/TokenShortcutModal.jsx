import React from "react";

export const TokenShortcutModal = ({ players, onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Elige a quién dar el token de atajo</h2>

        <ul className="space-y-3">
          {players.map((player, i) => (
            <li key={i}>
              <button
                onClick={() => onSelect(i)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                {player.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
