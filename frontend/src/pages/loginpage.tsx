import { useState } from "react";
import { api } from "../config/api";
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await api.post('/login', { email, password });
            navigate('/mylibrary');
        } catch (err) {
            setError('Credenciais inválidas');
        }
    };
         
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 w-full max-w-sm">
                <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
                Entrar
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Entrar
                </button>
                </form>
                {error && <p className="mt-2 text-center text-red-500">{error}</p>}
                <p className="mt-4 text-center text-gray-600 dark:text-gray-400">Novo aqui?{" "}
                    <a href="#" className="text-green-600 hover:underline">Cadastre-se</a>
                </p>
            </div>
        </div>
    );
}
