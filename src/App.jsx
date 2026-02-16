
import React from "react";

// Configuration couleurs
const PART_COLORS = {
  1: {
    bg: "bg-emerald-600",
    hover: "hover:bg-emerald-700",
    button: "text-emerald-700",
  },
  2: {
    bg: "bg-blue-600",
    hover: "hover:bg-blue-700",
    button: "text-blue-700",
  },
  3: {
    bg: "bg-orange-500",
    hover: "hover:bg-orange-600",
    button: "text-orange-700",
  },
};

const parts = [
  { id: 1, title: "ENVIRONNEMENT", progress: 24 },
  { id: 2, title: "SOCIAL & GOUVERNANCE", progress: 0 },
  { id: 3, title: "ÉCONOMIE & AMÉNAGEMENT DURABLE", progress: 0 },
];

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-100">
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        {parts.map((part) => (
          <div
            key={part.id}
            className={`
              ${PART_COLORS[part.id].bg}
              ${PART_COLORS[part.id].hover}
              transition-all duration-300 hover:scale-105
              rounded-2xl shadow-lg p-8 text-white
              flex flex-col items-center text-center
            `}
          >
            <h3 className="font-bold uppercase tracking-wide">
              PARTIE {part.id}
            </h3>

            <p className="mt-2 font-semibold text-lg">
              {part.title}
            </p>

            <div className="mt-6 text-3xl font-bold">
              {part.progress}%
            </div>

            <button
              className={`
                mt-6 bg-white px-6 py-2 rounded-full font-semibold
                ${PART_COLORS[part.id].button}
                shadow hover:scale-105 transition
              `}
            >
              COMMENCER
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
