// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../store/cartContext";


const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));

  useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem('isLoggedIn'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const { clear } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // clear cart in localStorage as well
  try { localStorage.removeItem('cart'); } catch (e) { console.warn('Could not remove cart from localStorage', e); }
  try { clear(); } catch (e) { console.warn('Could not clear cart context', e); }
    // refresh page to reset state
    window.location.href = '/login';
  };

  // El return debe envolver el JSX
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[var(--color-midblue)] py-4 px-6 flex justify-between items-center z-50">
      <Link to="/" className="text-2xl font-bold text-[var(--color-sky)]">
        Tiendubi
      </Link>
      <div className="space-x-4">
        <Link to="/productos" className="text-[var(--color-pale)] hover:text-[var(--color-sky)]">
          Productos
        </Link>
        <Link to="/cart" className="text-[var(--color-pale)] hover:text-[var(--color-sky)]">
          Carrito
        </Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-[var(--color-pale)] hover:text-[var(--color-sky)] ml-2">Cerrar sesión</button>
        ) : (
          <Link to="/login" className="text-[var(--color-pale)] hover:text-[var(--color-sky)]">Iniciar Sesión</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
