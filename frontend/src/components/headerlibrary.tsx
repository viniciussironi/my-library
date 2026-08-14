import { Bars3Icon, BookOpenIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../interfaces/user';
import { api } from '../config/api';


export default function HeaderLibrary( { user, onSearchChange }:  { user: User, onSearchChange: (search: string) => void }) {
    const [profileOpen, setProfileOpen] = useState(false);  
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearchChange = (value: string) => {
        setSearch(value);
        onSearchChange(value);
    };

    return (
        <header className="bg-green-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            
                <div className="flex items-center space-x-2">
                    <BookOpenIcon className="h-7 w-7 text-white" />
                    <h1 className="text-xl font-semibold">Meus Livros</h1>
                </div>

                <div className="hidden md:flex flex-1 px-4">
                    <div className="relative w-full">
                        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            placeholder="Pesquisar pelo título ou autor"
                            className="w-full pl-10 pr-10 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => handleSearchChange("")}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="md:hidden">
                        <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                    </button>
                
                    <button className="md:hidden" onClick={() => setMenuOpen(true)}>
                        <Bars3Icon className="h-7 w-7 text-white" />
                    </button>

                    {/* Como fazer isso? Direcionar para uma página de adição de livros ou fazer de outra forma */}
                    <button className="bg-white text-green-600 px-3 py-1 rounded-md font-medium hover:bg-green-100 transition hidden sm:block">
                        Adicionar Livro
                    </button>

                    <div className="relative">
                        <img
                            src={`${api.defaults.baseURL}/user/profilephoto`}
                            alt="Avatar do usuário"
                            className="h-10 w-10 rounded-full border-2 border-white cursor-pointer"
                            onClick={() => setProfileOpen(!profileOpen)}
                        />

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-md shadow-lg py-4 px-4">
                                <div className="flex items-center space-x-3 mb-3">
                                    <img
                                        src={`${api.defaults.baseURL}/user/profilephoto`}
                                        alt="Foto de perfil do usuário"
                                        className="h-12 w-12 rounded-full border"
                                    />
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>

                              <Link
                                  to="/profile/edit"
                                  className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                              >
                                  Editar Perfil
                              </Link>
                              <button
                                  onClick={() => console.log("logout")}
                                  className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
                              >
                                  Sair
                              </button>
                          </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 z-40 flex transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div
                    className="flex-1 bg-black bg-opacity-50"
                    onClick={() => setMenuOpen(false)}
                ></div>

                <div className={`bg-green-700 w-64 p-4 space-y-4 text-white transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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