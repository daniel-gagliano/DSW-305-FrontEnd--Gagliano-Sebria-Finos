// src/components/Navbar.tsx
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    // dejo el navbar fixed arriba con z-index para que siempre quede visible
    <nav className="fixed top-0 left-0 right-0 bg-[var(--color-midblue)] py-4 px-6 flex justify-between items-center z-50">
      <Link to="/" className="text-2xl font-bold text-[var(--color-sky)]">
        Tiendubi
      </Link>
      <div className="space-x-4">
          <Link to="/login" className="text-[var(--color-pale)] hover:text-[var(--color-sky)]">
            Iniciar Sesión
          </Link>
          <Link to="/productos" className="text-[var(--color-pale)] hover:text-[var(--color-sky)]">
            Productos
        </Link>
        <Link to="/cart" className="text-[var(--color-pale)] hover:text-[var(--color-sky)]">
          Carrito
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
