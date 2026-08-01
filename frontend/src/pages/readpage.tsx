export default function ReadPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar minimalista */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Biblioteca Virtual</h1>
        <button className="text-green-600 dark:text-green-400">Sair</button>
      </header>

      {/* Área de leitura */}
      <main className="flex-1 container mx-auto px-6 py-10 max-w-3xl">
        <article className="prose dark:prose-invert">
          <h2 className="text-2xl font-bold mb-6">Título do Livro</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Suspendisse varius enim in eros elementum tristique. 
            Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, 
            ut commodo diam libero vitae erat.
          </p>
          <p>
            Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. 
            Nunc ut sem vitae risus tristique posuere.
          </p>
        </article>
      </main>

      {/* Controles de navegação */}
      <footer className="bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center">
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Página anterior
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Próxima página
        </button>
      </footer>
    </div>
  );
}