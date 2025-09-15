// src/pages/Home.tsx
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  freeShipping?: boolean;
  installment?: string;
};

// Productos simulados
const products: Product[] = [
  { id: 1, name: "Playa Azul", price: 1990, imageUrl: "https://picsum.photos/seed/1/400/400", freeShipping: true, installment: "3x $663.33" },
  { id: 2, name: "Sayulita", price: 1990, imageUrl: "https://picsum.photos/seed/2/400/400", freeShipping: true, installment: "3x $663.33" },
  { id: 3, name: "Poncho Kids", price: 960, imageUrl: "https://picsum.photos/seed/3/400/400", freeShipping: true, installment: "3x $320" },
  { id: 4, name: "Poncho Teens", price: 990, imageUrl: "https://picsum.photos/seed/4/400/400", freeShipping: true, installment: "3x $330" },
  // agregá más productos
];

const colors = ["Amarillo", "Azul", "Beige", "Celeste", "Gris", "Lila", "Naranja", "Negro"];
const sizes = ["S", "M", "L", "XL"];

const Home = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex max-w-7xl mx-auto py-12 px-6">
        {/* Sidebar filtros */}
        <aside className="w-64 mr-8">
          <h2 className="font-bold mb-4">Filtros</h2>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Color</h3>
            {colors.map((color) => (
              <label key={color} className="block mb-1">
                <input
                  type="checkbox"
                  value={color}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(selectedColor === color ? null : color)}
                  className="mr-2"
                />
                {color}
              </label>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Talla</h3>
            {sizes.map((size) => (
              <label key={size} className="block mb-1">
                <input
                  type="checkbox"
                  value={size}
                  checked={selectedSize === size}
                  onChange={() => setSelectedSize(selectedSize === size ? null : size)}
                  className="mr-2"
                />
                {size}
              </label>
            ))}
          </div>
        </aside>

        {/* Grid productos */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Todos los Productos</h2>
            <select className="border border-gray-300 rounded px-3 py-1">
              <option>Más Vendidos</option>
              <option>Menor Precio</option>
              <option>Mayor Precio</option>
            </select>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col">
                <img src={product.imageUrl} alt={product.name} className="h-64 w-full object-cover rounded mb-4" />
                {product.freeShipping && (
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded mb-2 inline-block">
                    Envío Gratis
                  </span>
                )}
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <span className="font-bold text-indigo-600 mb-1">${product.price}</span>
                {product.installment && (
                  <span className="text-sm text-gray-500 mb-2">{product.installment}</span>
                )}
                <button className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
