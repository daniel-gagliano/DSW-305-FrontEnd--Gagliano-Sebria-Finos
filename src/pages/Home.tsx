// src/pages/Home.tsx
import Navbar from "../components/Navbar";

type Product = {
  id: number;
  name: string;
  price: number;
  freeShipping?: boolean;
  installment?: string;
};

// 9 productos de ejemplo
const products: Product[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: `Producto ${i + 1}`,
  price: 1000 + i * 100,
  freeShipping: i % 2 === 0,
  installment: `3x $${Math.floor((1000 + i * 100) / 3)}`,
}));

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full py-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Todos los Productos</h2>
          <select className="border border-gray-300 rounded px-3 py-1">
            <option>Más Vendidos</option>
            <option>Menor Precio</option>
            <option>Mayor Precio</option>
          </select>
        </div>

        {/* Grid responsive que ocupa todo el ancho */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col"
            >
              {/* Rectángulo de color */}
              <div
                className="h-40 w-full rounded mb-4"
                style={{ backgroundColor: `hsl(${(product.id * 40) % 360}, 70%, 70%)` }}
              ></div>

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
      </div>
    </div>
  );
};

export default Home;
