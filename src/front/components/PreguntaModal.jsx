import React, { useState } from "react";

export const PreguntaModal = ({ pregunta, onResponder }) => {
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [respondido, setRespondido] = useState(false);

  const manejarRespuesta = (index) => {
    if (respondido) return;
    setRespuestaSeleccionada(index);
    setRespondido(true);
    setTimeout(() => {
        onResponder(index === pregunta.correct_index);
    }, 1500);

  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white p-6 rounded-xl max-w-xl w-full">
        <h2 className="text-xl font-bold mb-4">Pregunta</h2>
        <p className="text-lg mb-4">{pregunta.question}</p>

        <ul className="grid grid-cols-2 gap-4">
          {pregunta.answers.map((ans, i) => {
            const esCorrecta = i === pregunta.correct_index;
            const esSeleccionada = i === respuestaSeleccionada;

            let clases = "border px-3 py-2 rounded cursor-pointer transition";
            if (respondido) {
              if (esCorrecta) clases += " bg-green-500 text-white";
              else if (esSeleccionada) clases += " bg-red-500 text-white";
              else clases += " opacity-75";
            } else if (esSeleccionada) {
              clases += " bg-blue-950";
            } else {
              clases += " hover:bg-[#ec9884]";
            }

            return (
              <li
                key={i}
                className={clases}
                onClick={() => manejarRespuesta(i)}
              >
                {ans}
              </li>
            );
          })}
        </ul>

        {respondido && (
          <div className="mt-4 text-center text-lg">
            {respuestaSeleccionada === pregunta.correct_index ? (
              <p className="text-green-400 font-semibold">✅ ¡Correcto!</p>
            ) : (
              <p className="text-red-400">
                ❌ Incorrecto. La respuesta correcta era:
                <strong> {pregunta.answers[pregunta.correct_index]}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
