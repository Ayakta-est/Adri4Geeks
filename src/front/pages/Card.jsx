import React from "react";

export const Card = () => {
    return (
        <div id="question-card" class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-300">
            <h2 id="question-text" class="text-xl font-bold mb-4">Cargando pregunta...</h2>
            <div id="answers" class="grid gap-3">
            </div>
        </div>

    )
}