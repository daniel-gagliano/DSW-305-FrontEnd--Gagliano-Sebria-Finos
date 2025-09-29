// Formulario de registro (Register)
// Acá hacemos el POST a /usuarios usando axiosClient que definimos
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Register() {
  // estados de los inputs
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // toast minimal para avisar que el usuario fue creado
  const [toast, setToast] = useState<string | null>(null);

  // handleSubmit valida contraconfirm y manda el POST
  // si sale todo bien, muestra un toast y redirige al login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      // llamo al backend /usuarios con los datos
      const resp = await axiosClient.post('/usuarios', {
        name: nombre,
        email,
        password
      });
      // aviso con un toast y redirijo
      if (resp.status === 201 || resp.status === 200) {
        setToast('Usuario creado');
        setTimeout(() => {
          setToast(null);
          navigate('/login');
        }, 1200);
      }
    } catch (err: any) {
      // muestro lo que venga del back o el message del error
      setError(err?.response?.data?.error || err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen app-bg">
      <div className="w-full max-w-sm p-6 card card--outlined">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-pale)]">Registrarse</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium label-muted">Nombre</label>  
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
               className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
              placeholder=""
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium label-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
              placeholder=""
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium label-muted">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium label-muted">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-2"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-sky)] text-[var(--color-very-dark)] py-2 px-4 rounded-lg hover:bg-[var(--color-navy)] transition"
          >
      {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

    <p className="text-center text-sm text-[var(--color-pale)] mt-4">
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className="text-[var(--color-sky)] hover:underline">
            Iniciar Sesión
          </a>
        </p>
        {toast && (
            <div className="fixed bottom-6 right-6 toast-success">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
