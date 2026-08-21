import { useState, useEffect } from "react";
import { XMarkIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import type { Highlight } from "../../../interfaces/Highlight";
import type { Annotation } from "../../../interfaces/Annotation";


const COLOR_HEX: Record<string, string> = {
    yellow: "#fde047",
    green: "#86efac",
    blue: "#93c5fd",
    pink: "#f9a8d4",
};

type Tab = "highlights" | "annotations";

export default function AnnotationSidebar({
  highlights,
  annotations,
  draft,
  onSaveDraft,
  onDeleteHighlight,
  onDeleteAnnotation,
  onJumpTo,
  onClose,
}: {
  highlights: Highlight[];
  annotations: Annotation[];
  draft: { text: string; location: string } | null;
  onSaveDraft: (note: string) => void;
  onDeleteHighlight?: (id: string) => void;
  onDeleteAnnotation?: (id: string) => void;
  onJumpTo?: (location: string) => void;
  onClose: () => void;
}) {
    const [tab, setTab] = useState<Tab>("highlights");
    const [noteText, setNoteText] = useState("");

    // Se um novo rascunho de anotação chegar (via "Anotar" no texto selecionado),
    // muda pra aba de anotações automaticamente e foca no campo
    useEffect(() => {
        if (draft) {
          setTab("annotations");
          setNoteText("");
        }
    }, [draft]);

    const handleSave = () => {
        if (!noteText.trim()) return;
        onSaveDraft(noteText.trim());
        setNoteText("");
    };

    return (
        <aside className="w-80 shrink-0 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col animate-in slide-in-from-right duration-150">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <h2 className="font-medium text-gray-800 dark:text-white">Meus registros</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>

          {/* Abas */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 shrink-0">
              <button
                  onClick={() => setTab("highlights")}
                  className={`flex-1 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                    tab === "highlights"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                  Grifos ({highlights.length})
              </button>
              <button
                  onClick={() => setTab("annotations")}
                  className={`flex-1 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                    tab === "annotations"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                  Anotações ({annotations.length})
              </button>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto">
              {tab === "highlights" ? (
                  highlights.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center px-6 py-10">
                        Nenhum grifo ainda. Selecione um trecho do texto e escolha uma cor para marcar.
                      </p>
                ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {highlights.map((h) => (
                            <li
                                key={h.id}
                                className="px-4 py-3 group hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                                onClick={() => onJumpTo?.(h.location)}
                            >
                                <div className="flex items-start gap-2">
                                    <span
                                        className="mt-1 h-3 w-3 rounded-full shrink-0"
                                        style={{ backgroundColor: COLOR_HEX[h.color] }}
                                    />
                                    <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-3 flex-1">
                                        {h.text}
                                    </p>
                                    {onDeleteHighlight && (
                                        <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onDeleteHighlight(h.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity shrink-0"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )
              ) : (
              <div className="flex flex-col h-full">
                  {/* Formulário de nova anotação (aparece quando vem de um "Anotar" no texto) */}
                  {draft && (
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-gray-700/40">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trecho selecionado</p>
                      <p className="text-sm italic text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                        "{draft.text}"
                      </p>
                      <textarea
                        autoFocus
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Escreva sua anotação..."
                        rows={3}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setNoteText("")}
                          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={!noteText.trim()}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lista de anotações já salvas */}
                  {annotations.length === 0 && !draft ? (
                    <p className="text-sm text-gray-400 text-center px-6 py-10">
                      Nenhuma anotação ainda. Selecione um trecho e toque no ícone de lápis para escrever uma.
                    </p>
                  ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                      {annotations.map((a) => (
                        <li
                          key={a.id}
                          className="px-4 py-3 group hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                          onClick={() => onJumpTo?.(a.location)}
                        >
                          <div className="flex items-start gap-2">
                            <PencilIcon className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                            <p className="text-sm text-gray-700 dark:text-gray-200 flex-1">{a.note}</p>
                            {onDeleteAnnotation && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteAnnotation(a.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity shrink-0"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
          </div>
        </aside>
    );
}