import { useRef, useState } from "react";
import { api } from "../config/api";
import { useNavigate } from "react-router-dom";
import { ArrowUpTrayIcon, DocumentCheckIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function UploadBookPage() {
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const ALLOWED_EXTENSIONS = ['.pdf', '.epub'];

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        selectFile(e.target.files?.[0] ?? null);
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!arquivo) return;

        const formData = new FormData();
        formData.append('file', arquivo);

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            await api.post('/books/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (!progressEvent.total) return;
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percent);
                }
            });
            navigate('/mylibrary');
        } catch (err) {
            console.error('Erro ao enviar o arquivo:', err);
            setError('Não foi possível enviar o arquivo. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-2xl font-bold text-green-700 mb-6">Upload de Arquivo</h2>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 space-y-5 border border-gray-100"
            >
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Selecione o arquivo
                    </label>

                    <label
                        htmlFor="file-upload"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-md px-3 py-8 cursor-pointer transition-colors ${
                            isDragging
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'
                        }`}
                    >
                        {arquivo ? (
                            <>
                                <DocumentCheckIcon className="w-8 h-8 text-green-500" />
                                <span className="text-sm font-medium text-gray-800">
                                    {arquivo.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                    Clique ou arraste para trocar o arquivo
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
                            id="file-upload"
                            ref={inputRef}
                            type="file"
                            accept=".pdf,.epub"
                            onChange={handleFileChange}
                            className="hidden"
                            required
                        />
                    </label>
                </div>

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
    );
}