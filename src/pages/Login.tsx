// este componente es el formulario de login/registro rápido
import { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient"; // cliente central para llamar al back

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // no redirigimos por ahora, solo mostramos el toast

  // handleSubmit: cuando el usuario aprieta Entrar
  // ahora usamos el endpoint POST /usuarios/login que valida credenciales
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // hago POST /usuarios/login con email y password
      const resp = await axiosClient.post('/usuarios/login', { email, password });
      if (resp.status === 200) {
        // muestro un toast corto
        setToast('Inicio de sesión exitoso');
        setTimeout(() => setToast(null), 1200);
      }
    } catch (err: any) {
      //mensaje amigable si algo sale mal
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
            className="w-full btn-primary py-2 px-4 rounded-lg hover:bg-[var(--color-navy)] transition"
          >
      {loading ? 'Enviando...' : 'Entrar'}
          </button>
        </form>
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  {toast && <div className="fixed bottom-6 right-6 toast-success">{toast}</div>}
        <p className="text-center text-sm text-[var(--color-pale)] mt-4">
          ¿No tenés cuenta?{" "}
          <Link to="/Register" className="text-[var(--color-sky)] hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
