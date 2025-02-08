import React from "react";
import { TEMPLATE } from "./TemplateListSection";
import Image from "next/image";
import Link from "next/link";

// Full gradient themes restored
const gradientCombos = [
  // Deep ocean themes
  ["from-blue-700", "via-blue-800", "to-indigo-900"],
  ["from-cyan-700", "via-blue-800", "to-blue-900"],
  ["from-blue-600", "via-indigo-800", "to-blue-900"],
  ["from-sky-700", "via-blue-800", "to-navy-900"],

  // Royal purple themes
  ["from-purple-700", "via-purple-800", "to-indigo-900"],
  ["from-indigo-700", "via-purple-800", "to-purple-900"],
  ["from-violet-700", "via-indigo-800", "to-purple-900"],
  ["from-purple-600", "via-indigo-800", "to-violet-900"],

  // Forest themes
  ["from-emerald-700", "via-green-800", "to-teal-900"],
  ["from-teal-700", "via-emerald-800", "to-green-900"],
  ["from-green-600", "via-teal-800", "to-emerald-900"],
  ["from-lime-700", "via-green-800", "to-emerald-900"],

  // Sunset themes
  ["from-rose-700", "via-pink-800", "to-purple-900"],
  ["from-orange-700", "via-rose-800", "to-pink-900"],
  ["from-red-700", "via-rose-800", "to-orange-900"],
  ["from-pink-700", "via-rose-800", "to-red-900"],

  // Galaxy themes
  ["from-violet-700", "via-purple-800", "to-blue-900"],
  ["from-fuchsia-700", "via-purple-800", "to-indigo-900"],
  ["from-purple-700", "via-violet-800", "to-indigo-900"],
  ["from-indigo-700", "via-violet-800", "to-blue-900"],

  // Deep sea themes
  ["from-blue-700", "via-indigo-800", "to-violet-900"],
  ["from-cyan-700", "via-teal-800", "to-blue-900"],
  ["from-teal-700", "via-blue-800", "to-indigo-900"],
  ["from-blue-700", "via-cyan-800", "to-teal-900"],

  // Northern lights
  ["from-green-700", "via-teal-800", "to-blue-900"],
  ["from-teal-700", "via-cyan-800", "to-indigo-900"],
  ["from-cyan-700", "via-green-800", "to-teal-900"],
  ["from-emerald-700", "via-cyan-800", "to-blue-900"],

  // Midnight themes
  ["from-slate-700", "via-blue-800", "to-indigo-900"],
  ["from-zinc-700", "via-slate-800", "to-blue-900"],
  ["from-gray-700", "via-slate-800", "to-zinc-900"],
  ["from-slate-700", "via-zinc-800", "to-gray-900"],

  // Ruby themes
  ["from-red-700", "via-rose-800", "to-pink-900"],
  ["from-rose-700", "via-red-800", "to-rose-900"],
  ["from-pink-700", "via-rose-800", "to-red-900"],
  ["from-rose-600", "via-pink-800", "to-rose-900"],
];

const usedGradients = new Set();

function TemplateCard(item: TEMPLATE) {
  // Select a unique random gradient
  const randomGradient = React.useMemo(() => {
    let availableGradients = gradientCombos.filter(
      (combo) => !usedGradients.has(combo.join(" "))
    );

    if (availableGradients.length === 0) {
      usedGradients.clear();
      availableGradients = gradientCombos;
    }

    const randomIndex = Math.floor(Math.random() * availableGradients.length);
    const selectedGradient = availableGradients[randomIndex];
    usedGradients.add(selectedGradient.join(" "));

    return selectedGradient.join(" ");
  }, []);

  return (
    <Link href={"/dashboard/content/" + item?.slug}>
      <div
        className={`
          relative 
          p-5 
          shadow-lg 
          rounded-md 
          border 
          border-gray-700/20
          overflow-hidden
          transition-transform duration-300 hover:scale-105
          group
        `}
      >
        {/* Background Layer - Fades out on hover */}
        <div
          className={`
            absolute inset-0 
            bg-gradient-to-br ${randomGradient}
            transition-opacity duration-300
            group-hover:opacity-0
          `}
        />

        {/* Content Layer - Always visible */}
        <div className="relative z-10">
          <Image
            src={item.icon}
            alt="icon"
            height={50}
            width={50}
            className="drop-shadow-lg"
          />
          <h2 className="font-medium text-lg text-white mt-3 drop-shadow-md">
            {item.name}
          </h2>
          <p className="text-white/90 line-clamp-3 mt-3">{item.desc}</p>
        </div>
      </div>
    </Link>
  );
}

export default TemplateCard;
