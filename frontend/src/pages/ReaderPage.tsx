import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, BookmarkSquareIcon } from "@heroicons/react/24/outline";

import PdfReader from "../components/reader/notes/PdfReader";
import EpubReader from "../components/reader/notes/EpubReader";


import type { Annotation } from "../interfaces/Annotation";
import type { Highlight } from "../interfaces/Highlight";
import type { Book } from "../interfaces/Book";
import { api } from "../config/api";
import AnnotationSidebar from "../components/reader/notes/AnnotationSidebar";


export default function ReaderPage() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState<Book | null>(null);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [location, setLocation] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [annotationDraft, setAnnotationDraft] = useState<{ text: string; location: string } | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Carrega metadados do livro (obrigatório pra tela funcionar)
    useEffect(() => {
        const load = async () => {
            try {
                const bookRes = await api.get<Book>(`/books/${bookId}`);
                setBook(bookRes.data);
            } catch (err) {
                setLoadError("Não foi possível carregar o livro.");
            }
        };
        load();
    }, [bookId]);

    // Carrega grifos, anotações e progresso — opcional por enquanto,
    // já que esses endpoints ainda não existem no backend.
    // Promise.allSettled evita que a falha de um derrube os outros.
    useEffect(() => {
        const loadExtras = async () => {
            const [hlRes, annRes, progressRes] = await Promise.allSettled([
                api.get<Highlight[]>(`/books/${bookId}/highlights`),
                api.get<Annotation[]>(`/books/${bookId}/annotations`),
                api.get(`/books/${bookId}/progress`),
            ]);

            if (hlRes.status === "fulfilled") setHighlights(hlRes.value.data);
            if (annRes.status === "fulfilled") setAnnotations(annRes.value.data);
            if (progressRes.status === "fulfilled") {
                setLocation(progressRes.value.data?.location ?? null);
            }
            // Se algum falhar (endpoint ainda não existe), a tela segue
            // funcionando normalmente com listas vazias / sem progresso salvo.
        };
        loadExtras();
    }, [bookId]);

    // Carrega o arquivo binário (PDF/EPUB) autenticado, via blob
    useEffect(() => {
        let objectUrl: string | undefined;

        const loadFile = async () => {
            try {
                const response = await api.get(`/books/${bookId}/file`, {
                    responseType: "blob",
                });
                objectUrl = URL.createObjectURL(response.data);
                setFileUrl(objectUrl);
            } catch (err) {
                setLoadError("Não foi possível carregar o arquivo do livro.");
            }
        };

        loadFile();

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [bookId]);

    // Salva progresso com debounce sempre que a localização muda
    useEffect(() => {
        if (!location) return;
        const timeout = setTimeout(() => {
            api.put(`/books/${bookId}/progress`, { location });
        }, 1000);
        return () => clearTimeout(timeout);
    }, [location, bookId]);

    const createHighlight = useCallback(
        async (color: string, text: string, loc: string) => {
            const res = await api.post<Highlight>(`/books/${bookId}/highlights`, { color, text, location: loc });
            setHighlights((prev) => [...prev, res.data]);
        },
        [bookId]
    );

    const createAnnotation = useCallback((text: string, loc: string) => {
        setAnnotationDraft({ text, location: loc });
        setSidebarOpen(true);
    }, []);

    const saveAnnotation = async (note: string) => {
        if (!annotationDraft) return;
        const res = await api.post<Annotation>(`/books/${bookId}/annotations`, {
            note,
            location: annotationDraft.location,
        });
        setAnnotations((prev) => [...prev, res.data]);
        setAnnotationDraft(null);
    };

    const deleteHighlight = async (id: string) => {
        await api.delete(`/books/${bookId}/highlights/${id}`);
        setHighlights((prev) => prev.filter((h) => h.id !== id));
    };

    const deleteAnnotation = async (id: string) => {
        await api.delete(`/books/${bookId}/annotations/${id}`);
        setAnnotations((prev) => prev.filter((a) => a.id !== id));
    };

    if (loadError) {
        return (
            <div className="p-8 text-center text-red-500">
                {loadError}
            </div>
        );
    }

    // Só renderiza o leitor quando TANTO os metadados quanto o arquivo estiverem prontos
    if (!book || !fileUrl) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">
                Carregando livro...
            </div>
        );
    }

    const isPdf = book.fileType?.toLowerCase().includes("pdf");

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <header className="flex items-center justify-between px-4 h-14 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shrink-0">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <ArrowLeftIcon className="h-5 w-5" />
                    Biblioteca
                </button>
                <h1 className="font-medium text-gray-800 dark:text-white truncate max-w-[50%]">{book.title} - {book.author}</h1>
                <button onClick={() => setSidebarOpen((v) => !v)} className="text-gray-600 dark:text-gray-300">
                    <BookmarkSquareIcon className="h-6 w-6" />
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto flex justify-center py-6">
                    {isPdf ? (
                        <PdfReader
                            fileUrl={fileUrl}
                            highlights={highlights}
                            initialPage={location ? Number(location.replace("page:", "")) : 1}
                            onPageChange={(p) => setLocation(`page:${p}`)}
                            onCreateHighlight={createHighlight}
                            onCreateAnnotation={createAnnotation}
                        />
                    ) : (
                        <EpubReader
                            fileUrl={fileUrl}
                            highlights={highlights}
                            initialLocation={location}
                            onLocationChange={(cfi) => setLocation(cfi)}
                            onCreateHighlight={createHighlight}
                            onCreateAnnotation={createAnnotation}
                        />
                    )}
                </main>

                {sidebarOpen && (
                    <AnnotationSidebar
                        highlights={highlights}
                        annotations={annotations}
                        draft={annotationDraft}
                        onSaveDraft={saveAnnotation}
                        onDeleteHighlight={deleteHighlight}
                        onDeleteAnnotation={deleteAnnotation}
                        onJumpTo={(loc) => setLocation(loc)}
                        onClose={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}