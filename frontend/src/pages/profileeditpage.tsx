import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {UserCircleIcon,CameraIcon,LockClosedIcon,TrashIcon,XCircleIcon,CheckCircleIcon,ExclamationTriangleIcon,ArrowLeftIcon} from '@heroicons/react/24/outline';
import { api } from '../config/api';
import type { User } from '../interfaces/user';
import type { ErrorAPI } from '../interfaces/errorapi';
import DeleteAccountModal from '../components/profile/deleteaccountmodal';
import ChangePasswordModal from '../components/profile/chancepasswordmodal';
import { handleApiError } from '../config/catch';


export default function ProfileEditPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<ErrorAPI | null>(null);
    const [photoVersion, setPhotoVersion] = useState(() => Date.now());

    const [name, setName] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<ErrorAPI | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const avatarObjectUrl = useRef<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get<User>('/user/me');
                if (!cancelled) {
                    setUser(data);
                    setName(data.name);
                }
            } catch (err: any) {
                handleApiError(err, setLoadError);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        return () => {
            if (avatarObjectUrl.current) URL.revokeObjectURL(avatarObjectUrl.current);
        };
    }, []);

    const isDirty = user !== null && (name.trim() !== user.name || avatarFile !== null);
    
    const avatarSrc = avatarPreview
    ?? (user?.profilePicture ? `${api.defaults.baseURL}/user/profilephoto?v=${photoVersion}` : null);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !name.trim()) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            if (avatarFile) {
                const photoForm = new FormData();
                photoForm.append('file', avatarFile);
                await api.post<User>('/user/profilephoto', photoForm, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setPhotoVersion(Date.now());
            }

            const { data: updated } = await api.put<User>('/user/update', {
                name: name.trim(),
            });

            setUser(updated);
            setAvatarFile(null);
            setAvatarPreview(null);
            setSaveSuccess(true);
        } catch (err: any) {
           handleApiError(err, setSaveError);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setAvatarFile(file);
            setSaveSuccess(false);

            if (avatarObjectUrl.current) {
                URL.revokeObjectURL(avatarObjectUrl.current);
            }
            avatarObjectUrl.current = URL.createObjectURL(file);
            setAvatarPreview(avatarObjectUrl.current);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center gap-3 text-gray-400">
                <div className="h-8 w-8 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin" />
                <p className="text-sm">Carregando perfil...</p>
            </div>
        );
    }

    if (loadError || !user) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16 text-center">
                <ExclamationTriangleIcon className="h-10 w-10 text-red-400 mx-auto mb-3" />
                <p className="text-gray-600">{`${loadError?.error}: ${loadError?.message}`}</p>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 mb-6 transition-colors cursor-pointer"
            >
                <ArrowLeftIcon className="h-4 w-4" />
                Voltar
            </button>

            <h2 className="text-2xl font-bold text-green-700 mb-6">Editar Perfil</h2>

            <form
                onSubmit={handleSave}
                className="bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-100"
            >
                <div className="flex justify-center">
                    <label htmlFor="avatar-upload" className="relative cursor-pointer group">
                        {avatarPreview || user.profilePicture ? (
                            <img
                                src={avatarSrc ?? ''}
                                alt="Foto de perfil"
                                className="h-24 w-24 rounded-full object-cover border-2 border-gray-200 group-hover:opacity-75 transition-opacity"
                            />
                        ) : (
                            <UserCircleIcon className="h-24 w-24 text-gray-300 group-hover:opacity-75 transition-opacity" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/30 transition-colors">
                            <CameraIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="absolute bottom-0 right-0 bg-green-600 rounded-full p-1.5 border-2 border-white">
                            <CameraIcon className="h-3.5 w-3.5 text-white" />
                        </span>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setSaveSuccess(false);
                        }}
                        placeholder="Seu nome"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <div className="relative">
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full border rounded-md px-3 py-2 pr-9 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <LockClosedIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">O e-mail não pode ser alterado.</p>
                </div>

                {saveError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                        <XCircleIcon className="w-4 h-4 shrink-0" />
                        {`${saveError?.error}: ${saveError?.message}`}
                    </div>
                )}

                {saveSuccess && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                        <CheckCircleIcon className="w-4 h-4 shrink-0" />
                        Perfil atualizado com sucesso.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSaving || !isDirty || !name.trim()}
                    className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isSaving ? 'Salvando...' : 'Salvar alterações'}
                </button>
            </form>

            {/* Zona sensível */}
            <div className="mt-8 bg-white shadow-md rounded-lg border border-gray-100 divide-y divide-gray-100">
                <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    <span className="flex items-center gap-3 text-gray-700">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        Alterar senha
                    </span>
                    <span className="text-gray-300">›</span>
                </button>

                <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition-colors cursor-pointer group"
                >
                    <span className="flex items-center gap-3 text-red-600">
                        <TrashIcon className="h-5 w-5" />
                        Excluir conta
                    </span>
                    <span className="text-red-200 group-hover:text-red-300">›</span>
                </button>
            </div>

            {isPasswordModalOpen && (
                <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />
            )}

            {isDeleteModalOpen && (
                <DeleteAccountModal
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDeleted={() => navigate('/login')}
                />
            )}
        </div>
    );
}