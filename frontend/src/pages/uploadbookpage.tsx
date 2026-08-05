import { useState } from "react";
import { api } from "../config/api";

export default function UploadBookPage() {
    const [arquive, setArquive] = useState<File | null>(null);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!arquive) return;
        const formData = new FormData();
        formData.append('file', arquive);

        try {
            await api.post('/books/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (err) {
            console.error('Erro ao enviar o arquivo:', err);
        }
    };
    
    return (
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-2xl font-bold text-green-700 mb-6">Upload de Arquivo</h2>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 space-y-4"
            >
                <div>
                <label className="block text-gray-700 font-medium mb-2">Selecione o arquivo</label>
                <input
                    type="file"
                    accept=".pdf,.epub,.doc,.docx"
                    onChange={(e) => setArquive(e.target.files?.[0] ?? null)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                />
                </div>

                <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition"
                >
                Enviar
                </button>
            </form>
        </div>
    );
}