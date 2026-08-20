import { useEffect, useState } from "react";
import { api } from "../../config/api";
import type { ErrorAPI } from "../../interfaces/ErrorApi";
import { CheckCircleIcon, LockClosedIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { handleApiError } from "../../config/catch";

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<ErrorAPI | null>(null);
    const [success, setSuccess] = useState(false);

    const passwordsMismatch =
        newPassword1.length > 0 && newPassword2.length > 0 && newPassword1 !== newPassword2;

    const isValid =
        currentPassword.length > 0 &&
        newPassword1.length >= 8 &&
        newPassword1.length <= 32 &&
        newPassword1 === newPassword2;

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isSaving) onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isSaving, onClose]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid) return;

        setIsSaving(true);
        setError(null);

        try {
            await api.put('/user/update/password', {
                currentPassword,
                newPassword1,
                newPassword2,
            });
            setSuccess(true);
            setTimeout(onClose, 1200);
        } catch (err: any) {
            handleApiError(err, setError);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-150"
            onClick={() => !isSaving && onClose()}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white text-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
            >
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                        <LockClosedIcon className="h-5 w-5" />
                        Alterar Senha
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha atual</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
                        <input
                            type="password"
                            value={newPassword1}
                            onChange={(e) => setNewPassword1(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            required
                            minLength={8}
                            maxLength={32}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar nova senha
                        </label>
                        <input
                            type="password"
                            value={newPassword2}
                            onChange={(e) => setNewPassword2(e.target.value)}
                            placeholder="Repita a nova senha"
                            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                                passwordsMismatch
                                    ? 'border-red-300 focus:ring-red-300'
                                    : 'focus:ring-green-400'
                            }`}
                            required
                            minLength={8}
                            maxLength={32}
                        />
                        {passwordsMismatch && (
                            <p className="text-xs text-red-500 mt-1">As senhas não coincidem.</p>
                        )}
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                            <XCircleIcon className="w-4 h-4 shrink-0" />
                            {error.listErrors ? error.listErrors.map((fieldError) => (
                                <div key={fieldError.field}>
                                    {fieldError.field}: {fieldError.message}
                                </div>
                            )) : (
                                <div>
                                    {error.message}
                                </div>
                            )}
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                            <CheckCircleIcon className="w-4 h-4 shrink-0" />
                            Senha alterada com sucesso.
                        </div>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || !isValid}
                            className="flex-1 bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                        >
                            {isSaving ? 'Salvando...' : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}