export default function LibraryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Biblioteca Virtual</h1>
          <input type="text" placeholder="Buscar livros..."
            className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" />
          <button className="ml-4 text-green-600 dark:text-green-400">Login</button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          <div className="flex flex-col items-center">
            <img src="https://via.placeholder.com/150" alt="Capa do Livro"
              className="w-32 h-48 object-cover rounded shadow-sm mb-2" />
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Título do Livro</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">Autor</p>
          </div>

        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-4 text-center">
        <p>&copy; 2026 Biblioteca Virtual</p>
      </footer>
    </div>
  )
}