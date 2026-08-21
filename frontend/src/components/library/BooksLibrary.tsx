import { useEffect, useRef } from "react";


import type { MyBooks } from "../../interfaces/MyBooks";
import BookCard from "./BookCard";
import { useNavigate } from "react-router-dom";

export default function BooksLibrary({ mybooks, error, loading, hasMore, onLoadMore}: { mybooks: MyBooks; error: string; loading: boolean; hasMore: boolean; onLoadMore: () => void}) {

    const navigate = useNavigate();
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onLoadMore();
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [onLoadMore]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mybooks.content.length === 0 && !loading ? (
                    <p className="empty">Nenhum livro encontrado... {error}</p>
                ) : (
                    mybooks.content.map((book) => (
                        <BookCard
                            key={book.id}
                            titulo={book.title}
                            autor={book.author}
                            capa={book.coverUrl}
                            onClick={() => navigate(`/reader/${book.id}`)}
                        />
                    ))
                )}
            </div>

            {hasMore && <div ref={sentinelRef} className="h-10" />}

            {loading && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                    Carregando mais livros...
                </p>
            )}
        </div>
    );
}
