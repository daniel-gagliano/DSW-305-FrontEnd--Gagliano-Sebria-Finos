import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../store/cartContext";
import { useAuth } from "../store/authContext";

const Navbar = () => {
  const { isAuthenticated, userName, userRole } = useAuth();
  const { clear } = useCart();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Redirigir a admin si es admin y está en home
  useEffect(() => {
    if (isAuthenticated && userRole === 'ADMIN' && window.location.pathname === '/') {
      navigate('/gestion-general');
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleLogout = () => {
    try { 
      localStorage.removeItem('cart');
      clear();
    } catch (e) { 
      console.warn('Error limpiando carrito', e);
    }
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[var(--color-midblue)] py-4 px-6 flex justify-between items-center z-50">
      <Link to={userRole === 'ADMIN' ? '/gestion-general' : '/'} className="text-2xl font-bold text-[var(--color-sky)]">
        Mi Tiendita
      </Link>
      <div className="flex items-center gap-6">
        {/* Opciones para NO autenticados */}
        {!isAuthenticated && (
          <>
            <Link to="/productos" className="text-[var(--color-pale)] hover:text-[var(--color-sky)] transition">
              Productos
            </Link>
            <Link to="/cart" className="text-[var(--color-pale)] hover:text-[var(--color-sky)] transition">
              Carrito
            </Link>
          </>
        )}

        {/* Opciones SOLO para CLIENTES */}
        {isAuthenticated && userRole === 'CLIENTE' && (
          <>
            <Link to="/productos" className="text-[var(--color-pale)] hover:text-[var(--color-sky)] transition">
              Productos
            </Link>
            <Link to="/cart" className="text-[var(--color-pale)] hover:text-[var(--color-sky)] transition">
              Carrito
            </Link>
          </>
        )}

        {/* Opción SOLO para ADMIN */}
        {isAuthenticated && userRole === 'ADMIN' && (
          <><Link to="/gestion-general" className="text-[var(--color-pale)] hover:text-[var(--color-sky)] transition">
            Gestión General
          </Link><Link
            to="/historial-ventas"
            className="text-[var(--color-pale)] hover:text-[var(--color-sky)] transition"
          >
              Historial de Ventas
            </Link></>
        )}

        {/* Menú de usuario */}
        {isAuthenticated ? (
          <div className="relative">
            <button 
              onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} 
              className="text-[var(--color-pale)] hover:text-[var(--color-sky)] transition"
            >
              {userName ? `Hola, ${userName}` : 'Mi perfil'}
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--color-navy)] rounded-md shadow-lg py-1 z-50 border border-[var(--color-midblue)]">
                {userRole === 'CLIENTE' && (
                  <Link 
                    to="/historial-pedidos" 
                    className="block px-4 py-2 text-sm text-[var(--color-pale)] hover:bg-[var(--color-midblue)] hover:text-[var(--color-sky)] transition"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Historial de pedidos
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--color-pale)] hover:bg-[var(--color-midblue)] hover:text-[var(--color-sky)] transition"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-[var(--color-pale)] hover:text-[var(--color-sky)] transition">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;