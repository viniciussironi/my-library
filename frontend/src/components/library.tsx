import type { MyBooks } from "../interfaces/mybooks";
import BookCard from "./bookcard";

export default function Library({ mybooks, error, onPageChange }: { mybooks: MyBooks, error:string, onPageChange: (page: number) => void }) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Grid de livros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mybooks.content.length === 0 ? (
            <p className='empty'>Nenhum livro encontrado... {error}</p>
            ) : (
            mybooks.content.map((book) => (
                <BookCard
                    titulo={book.title}
                    autor={book.author}
                    capa={''}
                />
                ))
            )}
            </div>

            {/* Paginação */}
            <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                onClick={() => onPageChange(mybooks.pageable.pageNumber - 1)}
                disabled={mybooks.pageable.pageNumber === 1}
                className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 transition"
                >
                Anterior
                </button>

                {/* Números das páginas */}
                <span className="text-gray-700 font-medium">
                Página {mybooks.pageable.pageNumber} de {mybooks.totalPages}
                </span>

                <button
                onClick={() => onPageChange(mybooks.pageable.pageNumber + 1)}
                disabled={mybooks.pageable.pageNumber === mybooks.totalPages}
                className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 transition"
                >
                Próxima
                </button>
            </div>
        </div>    
   )
}