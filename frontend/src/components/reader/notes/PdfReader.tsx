import { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import SelectionMenu from "./SelectionMenu";
import type { Highlight } from "../../../interfaces/Highlight";


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfReader({
  fileUrl,
  highlights,
  initialPage,
  onPageChange,
  onCreateHighlight,
  onCreateAnnotation,
}: {
  fileUrl: string;
  highlights: Highlight[];
  initialPage: number;
  onPageChange: (page: number) => void;
  onCreateHighlight: (color: string, text: string, location: string) => void;
  onCreateAnnotation: (text: string, location: string) => void;
}) {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(initialPage || 1);
    const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
    const pendingSelection = useRef<{ text: string; location: string } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef(pageNumber);
    const numPagesRef = useRef(numPages);
    useEffect(() => { pageRef.current = pageNumber; }, [pageNumber]);
    useEffect(() => { numPagesRef.current = numPages; }, [numPages]);

    const changePage = useCallback((delta: number) => {
        setPageNumber((prev) => {
          const next = Math.min(Math.max(prev + delta, 1), numPagesRef.current || prev);
          onPageChange(next);
          return next;
        });
    }, [onPageChange]);

    const handleTextSelection = useCallback(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !selection.toString().trim()) {
            setSelectionPos(null);
            return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const location = `page:${pageRef.current}`;
        pendingSelection.current = { text: selection.toString(), location };

        setSelectionPos({ x: rect.left + rect.width / 2, y: rect.top });
    }, []);

    // --- Navegação por teclado (setas) ---
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Não interfere se o usuário estiver digitando em algum input/textarea
            const target = event.target as HTMLElement;
            if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;

            if (event.key === "ArrowLeft") {
                changePage(-1);
            } else if (event.key === "ArrowRight") {
                changePage(1);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [changePage]);

  // --- Navegação por scroll do mouse ---
  useEffect(() => {
    if (!containerRef.current) return;

    let scrollLock = false;
    const handleWheel = (event: WheelEvent) => {
      if (window.getSelection()?.toString()) return;

      if (scrollLock) return;
      scrollLock = true;

      if (event.deltaY > 0) {
        changePage(1);
      } else if (event.deltaY < 0) {
        changePage(-1);
      }

      setTimeout(() => {
        scrollLock = false;
      }, 400);
    };

    const el = containerRef.current;
    el.addEventListener("wheel", handleWheel);
    return () => el.removeEventListener("wheel", handleWheel);
  }, [changePage]);

  const pageHighlights = highlights.filter((h) => h.location === `page:${pageNumber}`);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        className="relative select-text"
        onMouseUp={handleTextSelection}
      >
        <Document file={fileUrl} onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}>
          <Page pageNumber={pageNumber} renderTextLayer renderAnnotationLayer={false} />
        </Document>
      </div>

      <div className="flex items-center gap-4 mt-4 text-gray-700 dark:text-gray-200">
        <button onClick={() => changePage(-1)} disabled={pageNumber <= 1} className="disabled:opacity-30">
          ← Anterior
        </button>
        <span className="text-sm">
          Página {pageNumber} de {numPages}
        </span>
        <button onClick={() => changePage(1)} disabled={pageNumber >= numPages} className="disabled:opacity-30">
          Próxima →
        </button>
      </div>

      <SelectionMenu
        position={selectionPos}
        onHighlight={(color) => {
          if (pendingSelection.current) {
            onCreateHighlight(color, pendingSelection.current.text, pendingSelection.current.location);
          }
          setSelectionPos(null);
          window.getSelection()?.removeAllRanges();
        }}
        onAnnotate={() => {
          if (pendingSelection.current) {
            onCreateAnnotation(pendingSelection.current.text, pendingSelection.current.location);
          }
          setSelectionPos(null);
        }}
        onClose={() => setSelectionPos(null)}
      />
    </div>
  );
}