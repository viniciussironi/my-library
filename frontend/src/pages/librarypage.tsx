import { useEffect, useState } from "react";
import { api } from "../config/api";
import type { MyBooks } from "../interfaces/mybooks";
import HeaderLibrary from "../components/headerlibrary";
import Library from "../components/library";

export default function LibraryPage() {
    const [data, setData] = useState<MyBooks>({content: [], pageable: {pageNumber: 0}, totalPages: 0});
    const [error, setError] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchBooks = async () => {
                try {
                    const response = await api.get<MyBooks>("/books/mybooks", {
                        params: {
                            page: page,
                            search: search,
                        },
                    });
                    setData(response.data);
                } catch (error) {
                    setError(error as string);
                }
            };

          fetchBooks();
        }, 500);

      return () => clearTimeout(delayDebounce);
    }, [page, search]); 
  

    return (
        console.log(data),
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <HeaderLibrary onSearchChange={setSearch} />
            <Library mybooks={data} error={error} onPageChange={setPage} />
            <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-4 text-center">
                <p>&copy; 2026 Biblioteca Virtual</p>
            </footer>
        </div>
    )
}