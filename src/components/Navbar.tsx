// src/components/Navbar.tsx
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        Mi Tienda
      </Link>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-indigo-600">
          Home
        </Link>
        <Link to="/products" className="text-gray-700 hover:text-indigo-600">
          Productos
        </Link>
        <Link to="/cart" className="text-gray-700 hover:text-indigo-600">
          Carrito
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
