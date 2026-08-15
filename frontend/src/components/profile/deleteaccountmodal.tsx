import { useEffect, useState } from "react";
import { api } from "../../config/api";
import type { ErrorAPI } from "../../interfaces/errorapi";
import { XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { handleApiError } from "../../config/catch";

export default function DeleteAccountModal({onClose,onDeleted}: { onClose: () => void; onDeleted: () => void }) {
    
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<ErrorAPI | null>(null);

    const CONFIRM_WORD = 'EXCLUIR';
    const canDelete = confirmText.trim().toUpperCase() === CONFIRM_WORD;

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isDeleting) onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isDeleting, onClose]);

    const handleDelete = async () => {
        if (!canDelete) return;
        setIsDeleting(true);
        setError(null);

        try {
            await api.delete('/user/delete');
            onDeleted();
        } catch (err: any) {
            handleApiError(err, setError);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-150"
            onClick={() => !isDeleting && onClose()}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white text-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
            >
                <div className="flex flex-col items-center text-center mb-4">
                    <div className="bg-red-50 rounded-full p-3 mb-3">
                        <ExclamationTriangleIcon className="h-7 w-7 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Excluir conta</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Essa ação é <span className="font-medium text-red-600">permanente</span> e
                        removerá seus livros, progresso de leitura e anotações. Não é possível
                        desfazer.
                    </p>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Digite <span className="font-mono font-semibold">{CONFIRM_WORD}</span> para
                    confirmar
                </label>
                <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={CONFIRM_WORD}
                    className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-300"
                    autoFocus
                />

                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
                        <XCircleIcon className="w-4 h-4 shrink-0" />
                        {error.message}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting || !canDelete}
                        className="flex-1 bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isDeleting ? 'Excluindo...' : 'Excluir conta'}
                    </button>
                </div>
            </div>
        </div>
    );
}