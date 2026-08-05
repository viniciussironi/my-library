import { Bars3Icon, BookOpenIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';


export default function HeaderLibrary() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* Logo + Título */}
        <div className="flex items-center space-x-2">
          <BookOpenIcon className="h-7 w-7 text-white" />
          <h1 className="text-xl font-semibold">Meus Livros</h1>
        </div>

        {/* Barra de busca (visível apenas em md+) */}
        <div className="hidden md:flex flex-1 px-4">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar livros..."
              className="w-full pl-10 pr-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Ações + Avatar */}
        <div className="flex items-center space-x-4">
          {/* Ícone de busca para mobile */}
          <button className="md:hidden">
            <MagnifyingGlassIcon className="h-6 w-6 text-white" />
          </button>

          {/* Botão hamburguer para mobile */}
          <button className="md:hidden" onClick={() => setMenuOpen(true)}>
            <Bars3Icon className="h-7 w-7 text-white" />
          </button>

          {/* Botão de adicionar livro (desktop) */}
          <button className="bg-white text-green-600 px-3 py-1 rounded-md font-medium hover:bg-green-100 transition hidden sm:block">
            Adicionar Livro
          </button>

          {/* Avatar sempre visível */}
          <img
            src="https://via.placeholder.com/40"
            alt="Avatar do usuário"
            className="h-10 w-10 rounded-full border-2 border-white cursor-pointer"
          />
        </div>
      </div>

      {/* Menu lateral com animação de entrada/saída */}
      <div
        className={`fixed inset-0 z-40 flex transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Overlay escuro */}
        <div
          className="flex-1 bg-black bg-opacity-50"
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Painel lateral */}
        <div
          className={`bg-green-700 w-64 p-4 space-y-4 text-white transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <button onClick={() => setMenuOpen(false)} className="flex justify-end w-full">
            <XMarkIcon className="h-6 w-6" />
          </button>
          <nav className="space-y-2">
            <a href="#" className="block hover:bg-green-600 rounded px-2 py-1">Meus Livros</a>
            <a href="#" className="block hover:bg-green-600 rounded px-2 py-1">Adicionar Livro</a>
            <a href="#" className="block hover:bg-green-600 rounded px-2 py-1">Perfil</a>
            <a href="#" className="block hover:bg-green-600 rounded px-2 py-1">Sair</a>
          </nav>
        </div>
      </div>
    </header>
  );
}