import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpenIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    Bars3Icon,
    ArrowUpTrayIcon,
    DocumentCheckIcon,
    XCircleIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import type { User } from '../interfaces/user';
import { api } from '../config/api';

const ALLOWED_EXTENSIONS = ['.pdf', '.epub'];

export default function HeaderLibrary(
{
    user,
    onSearchChange,
    onUploadSuccess,
}: {
    user: User;
    onSearchChange: (search: string) => void;
    onUploadSuccess?: () => void;
}) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState('');

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const profileRef = useRef<HTMLDivElement>(null);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        onSearchChange(value);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isUploading) closeUploadModal();
        };
        if (isUploadOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isUploadOpen, isUploading]);

    const isValidFile = (file: File) =>
        ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

    const selectFile = (file: File | null) => {
        if (!file) {
            setArquivo(null);
            return;
        }
        if (!isValidFile(file)) {
            setError('Formato não suportado. Envie um arquivo PDF ou EPUB.');
            setArquivo(null);
            return;
        }
        setError(null);
        setArquivo(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
        selectFile(e.dataTransfer.files?.[0] ?? null);
    };

    const closeUploadModal = () => {
        if (isUploading) return;
        setIsUploadOpen(false);
        setArquivo(null);
        setError(null);
        setUploadProgress(0);
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!arquivo) return;

        const formData = new FormData();
        formData.append('file', arquivo);

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            await api.post('/books/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (!progressEvent.total) return;
                    setUploadProgress(
                        Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    );
                },
            });
            setIsUploading(false);
            setIsUploadOpen(false);
            setArquivo(null);
            setUploadProgress(0);
            onUploadSuccess?.();
        } catch (err) {
            console.error('Erro ao enviar o arquivo:', err);
            setError('Não foi possível enviar o arquivo. Tente novamente.');
            setIsUploading(false);
        }
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
                                onClick={() => handleSearchChange('')}
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

                    <button
                        type="button"
                        onClick={() => setIsUploadOpen(true)}
                        className="bg-white text-green-600 px-3 py-1.5 rounded-md font-medium hover:bg-green-100 active:scale-95 transition-all hidden sm:flex items-center gap-1.5 cursor-pointer"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Adicionar Livro
                    </button>

                    <div className="relative" ref={profileRef}>
                        <img
                            src={`${api.defaults.baseURL}/user/profilephoto`}
                            alt="Avatar do usuário"
                            className="h-10 w-10 rounded-full border-2 border-white cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setProfileOpen(!profileOpen)}
                        />

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-md shadow-lg py-4 px-4 animate-in fade-in slide-in-from-top-1 duration-150">
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
                                    onClick={() => console.log('logout')}
                                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
                                >
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu mobile */}
            <div
                className={`fixed inset-0 z-40 flex transition-opacity duration-300 ${
                    menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div
                    className="flex-1 bg-black bg-opacity-50"
                    onClick={() => setMenuOpen(false)}
                ></div>

                <div
                    className={`bg-green-700 w-64 p-4 space-y-4 text-white transform transition-transform duration-300 ease-in-out ${
                        menuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <button onClick={() => setMenuOpen(false)} className="flex justify-end w-full">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                    <nav className="space-y-2">
                        <a href="/mylibrary" className="block hover:bg-green-600 rounded px-2 py-1">
                            Meus Livros
                        </a>
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                setIsUploadOpen(true);
                            }}
                            className="block w-full text-left hover:bg-green-600 rounded px-2 py-1"
                        >
                            Adicionar Livro
                        </button>
                        <a href="#" className="block hover:bg-green-600 rounded px-2 py-1">Perfil</a>
                        <a href="#" className="block hover:bg-green-600 rounded px-2 py-1">Sair</a>
                    </nav>
                </div>
            </div>

            {/* Modal de upload */}
            {isUploadOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-150"
                    onClick={closeUploadModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white text-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-green-700">Adicionar Livro</h3>
                            <button
                                type="button"
                                onClick={closeUploadModal}
                                disabled={isUploading}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <label
                                htmlFor="header-file-upload"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-lg px-3 py-8 cursor-pointer transition-colors ${
                                    isDragging
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'
                                }`}
                            >
                                {arquivo ? (
                                    <>
                                        <DocumentCheckIcon className="w-8 h-8 text-green-500" />
                                        <span className="text-sm font-medium text-gray-800 text-center break-all">
                                            {arquivo.name}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Clique ou arraste para trocar
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <ArrowUpTrayIcon className="w-8 h-8 text-green-500" />
                                        <span className="text-sm text-gray-600 text-center">
                                            Arraste um arquivo aqui ou clique para selecionar
                                        </span>
                                        <span className="text-xs text-gray-400">PDF ou EPUB</span>
                                    </>
                                )}
                                <input
                                    id="header-file-upload"
                                    type="file"
                                    accept=".pdf,.epub"
                                    onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
                                    className="hidden"
                                    required
                                />
                            </label>

                            {isUploading && (
                                <div className="space-y-1">
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-200 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 text-right">{uploadProgress}%</p>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                    <XCircleIcon className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isUploading || !arquivo}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {isUploading ? `Enviando... ${uploadProgress}%` : 'Enviar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
}