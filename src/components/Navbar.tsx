import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../store/cartContext";
import { useAuth } from "../store/authContext";

const Navbar = () => {
  const { isAuthenticated, userName } = useAuth();
  const { clear } = useCart();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    // Limpiar carrito
    try { 
      localStorage.removeItem('cart');
      clear();
    } catch (e) { 
      console.warn('Error limpiando carrito', e);
    }
    
    // Cerrar sesión
    logout();
    
    // Redirigir a login
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[var(--color-midblue)] py-4 px-6 flex justify-between items-center z-50">
      <Link to="/" className="text-2xl font-bold text-[var(--color-sky)]">
        Tiendubi
      </Link>
      <div className="space-x-4 flex items-center">
        <Link to="/productos" className="text-[var(--color-pale)] hover:text-[var(--color-sky)]">
          Productos
        </Link>
        <Link to="/cart" className="text-[var(--color-pale)] hover:text-[var(--color-sky)]">
          Carrito
        </Link>
        {isAuthenticated ? (
          <div className="relative">
            <button 
              onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} 
              className="text-[var(--color-pale)] hover:text-[var(--color-sky)] ml-2"
            >
              {userName ? `Hola, ${userName}` : 'Mi perfil'}
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link 
                  to="/historial-pedidos" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  Historial de pedidos
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-[var(--color-pale)] hover:text-[var(--color-sky)]">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;