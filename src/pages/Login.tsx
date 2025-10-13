import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../store/authContext"; // AGREGAR ESTA LÍNEA

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // AGREGAR ESTA LÍNEA

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const resp = await axiosClient.post('/usuarios/login', { email, password });
      if (resp.status === 200 && resp.data.user) {
        // Usar el método login del contexto en lugar de localStorage directo
        const userName = resp.data.user.name || resp.data.user.email || 'Usuario';
        login(resp.data.user.id.toString(), userName);
        
        // Guardar token si existe
        if (resp.data.token) {
          localStorage.setItem('token', resp.data.token);
        }
        
        setToast('Inicio de sesión exitoso');
        setTimeout(() => {
          setToast(null);
          navigate('/productos');
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Error en el login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen app-bg">
      <div className="w-full max-w-sm p-6 card card--outlined">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-pale)]">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium label-muted">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full input-default shadow-sm focus:border-[var(--color-sky)] focus:ring focus:ring-[var(--color-sky)] focus:ring-opacity-30"
              placeholder="ejemplo@mail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium label-muted">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2 px-4 rounded-lg hover:bg-[var(--color-navy)] transition disabled:opacity-60"
          >
            {loading ? 'Enviando...' : 'Entrar'}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {toast && <div className="fixed bottom-6 right-6 toast-success">{toast}</div>}
        <p className="text-center text-sm text-[var(--color-pale)] mt-4">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-[var(--color-sky)] hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}