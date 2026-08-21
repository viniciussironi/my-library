import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const COLORS = [
  { name: "yellow", hex: "#fde047" },
  { name: "green", hex: "#86efac" },
  { name: "blue", hex: "#93c5fd" },
  { name: "pink", hex: "#f9a8d4" },
] as const;

export default function SelectionMenu({
  position,
  onHighlight,
  onAnnotate,
  onClose,
}: {
  position: { x: number; y: number } | null;
  onHighlight: (color: string) => void;
  onAnnotate: () => void;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!position);
  }, [position]);

  if (!visible || !position) return null;

  return (
    <div
      className="fixed z-50 flex items-center gap-1 bg-gray-900 text-white rounded-lg shadow-xl px-2 py-1.5 animate-in fade-in zoom-in-95 duration-100"
      style={{ top: position.y - 50, left: position.x }}
      onMouseDown={(e) => e.preventDefault()} // não perde a seleção de texto
    >
      {COLORS.map((c) => (
        <button
          key={c.name}
          onClick={() => onHighlight(c.name)}
          className="h-6 w-6 rounded-full border-2 border-white/30 hover:scale-110 transition-transform cursor-pointer"
          style={{ backgroundColor: c.hex }}
          title={`Grifar em ${c.name}`}
        />
      ))}
      <div className="w-px h-5 bg-white/20 mx-1" />
      <button
        onClick={onAnnotate}
        className="p-1.5 rounded hover:bg-white/10 cursor-pointer"
        title="Adicionar anotação"
      >
        <PencilSquareIcon className="h-5 w-5" />
      </button>
    </div>
  );
}