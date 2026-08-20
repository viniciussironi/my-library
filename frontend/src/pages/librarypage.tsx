import { useCallback, useEffect, useState } from "react";
import { api } from "../config/api";



import HeaderLibrary from "../components/library/headerlibrary";
import SortLibrary from "../components/library/sortlibrary";
import BooksLibrary from "../components/library/BooksLibrary";
import type { MyBooks } from "../interfaces/MyBooks";
import type { User } from "../interfaces/User";
import type { SortOption } from "../interfaces/SortOption";

export default function LibraryPage() {
    const [mybooks, setMyBooks] = useState<MyBooks>({content: [], pageable: {pageNumber: 0}, totalPages: 0});
    const [user, setUser] = useState<User>({id: 0, name: "", email: "", profilePicture: ""});
    const [error, setError] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [sort, setSort] = useState<SortOption>("added_desc");

    // Reseta a paginação sempre que a busca muda
    useEffect(() => {
        setPage(0);
        setHasMore(true);
    }, [search]);

    // Carregar livros
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchBooks = async () => {
                try {
                    setLoading(true);
                    const response = await api.get<MyBooks>("/books/mybooks", {
                        params: {
                            page: page,
                            search: search,
                        },
                    });

                    setMyBooks((prev) =>
                        page === 0
                            ? response.data
                            : {
                                  ...response.data,
                                  content: [...prev.content, ...response.data.content],
                              }
                    );

                    setHasMore(page + 1 < response.data.totalPages);
                } catch (error) {
                    setError(error as string);
                } finally {
                    setLoading(false);
                }
            };

            fetchBooks();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [page, search]);

    // Carregar usuário
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get<User>("/user/me");
                setUser(response.data);
            } catch (error) {
                setError(error as string);
            }
        };

        fetchUser();
    }, []);

    // Chamado pelo Library quando o sentinel entra na tela
    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setPage((prev) => prev + 1);
        }
    }, [loading, hasMore]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <HeaderLibrary user={user} onSearchChange={setSearch} />
            <SortLibrary sort={sort} onChange={setSort} />
            <BooksLibrary
                mybooks={mybooks}
                error={error}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
            />
            <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-4 text-center">
                <p>&copy; 2026 Biblioteca Virtual</p>
            </footer>
        </div>
    )
}