// src/pages/Home.tsx

// Aca esta la logica de la API y la visualizacion de los datos se hacen aca

import Navbar from "../components/Navbar";

type Product = {
  id: number;
  name: string;
  price: number;
  freeShipping?: boolean;
  installment?: string;
};

// 12 productos de ejemplo para llenar 4x3
const products: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Producto ${i + 1}`,
  price: 1000 + i * 100,
  freeShipping: i % 2 === 0,
  installment: `3x $${Math.floor((1000 + i * 100) / 3)}`,
}));

const Home = () => {
  return (
    <div className="min-h-screen app-bg">
      <Navbar />

      <div className="w-full py-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-pale)]">Todos los Productos</h2>
          <select className="border border-transparent rounded px-3 py-1 bg-[var(--color-pale)] text-[var(--color-very-dark)]">
            <option>Más Vendidos</option>
            <option>Menor Precio</option>
            <option>Mayor Precio</option>
          </select>
        </div>

        {/* Grid responsive 4x3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {products.map((product) => (
            <div
              key={product.id}
              className="card p-4 rounded shadow hover:shadow-lg transition flex flex-col"
            >
              {/* Rectángulo de color */}
              <div
                className="h-32 w-full rounded mb-4"
                style={{ backgroundColor: `hsl(${(product.id * 40) % 360}, 70%, 70%)` }}
              ></div>

              {product.freeShipping && (
                <span className="text-sm bg-[var(--color-pale)] text-[var(--color-very-dark)] px-2 py-1 rounded mb-2 inline-block">
                  Envío Gratis
                </span>
              )}
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <span className="font-bold text-[var(--color-sky)] mb-1">${product.price}</span>
              {product.installment && (
                <span className="text-sm text-[var(--color-pale)] mb-2">{product.installment}</span>
              )}
              <button className="mt-auto btn-primary py-2 px-4 rounded hover:bg-[var(--color-navy)] transition">
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
