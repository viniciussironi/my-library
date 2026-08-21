import { useEffect, useRef, useState } from "react";
import ePub, { Rendition, Book } from "epubjs";
import SelectionMenu from "./SelectionMenu";
import type { Highlight } from "../../../interfaces/Highlight";


export default function EpubReader({
  fileUrl,
  highlights,
  initialLocation,
  onLocationChange,
  onCreateHighlight,
  onCreateAnnotation,
}: {
  fileUrl: string;
  highlights: Highlight[];
  initialLocation: string | null;
  onLocationChange: (cfi: string, percentage: number) => void;
  onCreateHighlight: (color: string, text: string, cfi: string) => void;
  onCreateAnnotation: (text: string, cfi: string) => void;
}) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
  const pendingSelection = useRef<{ text: string; cfi: string } | null>(null);

    useEffect(() => {
        if (!viewerRef.current) return;

        const book = ePub(fileUrl, { openAs: "epub" });
        bookRef.current = book;

        book.ready.then(() => {
            if (!viewerRef.current) return;

            const rendition = book.renderTo(viewerRef.current, {
                width: "100%",
                height: "100%",
                spread: "auto",
            });
            renditionRef.current = rendition;

            rendition.display(initialLocation || undefined);

            rendition.on("rendered", () => {
                highlights.forEach((h) => {
                    rendition.annotations.highlight(h.location, {}, undefined, "", {
                        fill: colorHex(h.color),
                        "fill-opacity": "0.4",
                    });
                });
            });

            rendition.on("selected", (cfiRange: string, contents: any) => {
                const selection = contents.window.getSelection();
                const text = selection?.toString().trim();
                if (!text) return;

                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const iframeRect = contents.iframeEl.getBoundingClientRect();

                pendingSelection.current = { text, cfi: cfiRange };
                setSelectionPos({
                    x: iframeRect.left + rect.left + rect.width / 2,
                    y: iframeRect.top + rect.top,
                });
            });

            rendition.on("relocated", (location: any) => {
                onLocationChange(location.start.cfi, location.start.percentage * 100);
            });

            // --- Navegação por teclado (setas) ---
            // "keyup" do epub.js dispara pra eventos de teclado capturados
            // DENTRO do iframe de cada capítulo renderizado
            const handleKeyPress = (event: KeyboardEvent) => {
                if (event.key === "ArrowLeft") {
                    rendition.prev();
                } else if (event.key === "ArrowRight") {
                    rendition.next();
                }
            };

            rendition.on("keyup", handleKeyPress);

            // Registra também no documento principal, para quando o foco
            // estiver fora do iframe (ex: cursor sobre a UI ao redor do leitor)
            document.addEventListener("keyup", handleKeyPress);

            // --- Navegação por scroll do mouse ---
            // Debounce simples para não passar várias páginas de uma vez
            // num scroll contínuo (trackpad, principalmente)
            let scrollLock = false;
            const handleWheel = (event: WheelEvent) => {
                if (scrollLock) return;
                scrollLock = true;

                if (event.deltaY > 0) {
                    rendition.next();
                } else if (event.deltaY < 0) {
                    rendition.prev();
                }

                setTimeout(() => {
                    scrollLock = false;
                }, 400);
            };

            // Escuta o wheel tanto fora quanto dentro de cada capítulo renderizado
            viewerRef.current.addEventListener("wheel", handleWheel);
            rendition.on("rendered", (_section: any, contents: any) => {
                contents.window.addEventListener("wheel", handleWheel);
            });

            // Guarda os handlers pra limpar depois
            (rendition as any)._handleKeyPress = handleKeyPress;
            (rendition as any)._handleWheel = handleWheel;
        });

        return () => {
            document.removeEventListener("keyup", (renditionRef.current as any)?._handleKeyPress);
            viewerRef.current?.removeEventListener("wheel", (renditionRef.current as any)?._handleWheel);
            book.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileUrl]);

    const colorHex = (color: string) =>
      ({ yellow: "#fde047", green: "#86efac", blue: "#93c5fd", pink: "#f9a8d4" }[color] || "#fde047");

    return (
        <div className="w-full h-[75vh] relative">
            <div ref={viewerRef} className="w-full h-full" />

            <div className="flex justify-between absolute inset-y-0 w-full pointer-events-none">
                <button
                    onClick={() => renditionRef.current?.prev()}
                    className="pointer-events-auto px-3 text-gray-400 hover:text-gray-700 text-2xl"
                >
                  ‹
                </button>
                <button
                    onClick={() => renditionRef.current?.next()}
                    className="pointer-events-auto px-3 text-gray-400 hover:text-gray-700 text-2xl"
                >
                  ›
                </button>
            </div>

            <SelectionMenu
                position={selectionPos}
                onHighlight={(color) => {
                    if (pendingSelection.current) {
                      const { cfi, text } = pendingSelection.current;
                      renditionRef.current?.annotations.highlight(cfi, {}, undefined, "", {
                        fill: colorHex(color),
                        "fill-opacity": "0.4",
                      });
                      onCreateHighlight(color, text, cfi);
                    }
                    setSelectionPos(null);
                }}
                onAnnotate={() => {
                    if (pendingSelection.current) {
                      onCreateAnnotation(pendingSelection.current.text, pendingSelection.current.cfi);
                    }
                    setSelectionPos(null);
                }}
                onClose={() => setSelectionPos(null)}
            />
        </div>
    );
}