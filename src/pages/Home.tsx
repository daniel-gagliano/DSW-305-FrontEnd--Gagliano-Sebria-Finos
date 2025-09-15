// src/pages/Home.tsx
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Bienvenido a Mi E-Commerce
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Encuentra los mejores productos al mejor precio 🚀
        </p>
        <Link
          to="/products"
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
        >
          Ver Productos
        </Link>
      </section>

      {/* Productos destacados */}
      <section className="flex-1 max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Productos Destacados
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {/* Cards de productos */}
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
            >
              <img
                src={`https://picsum.photos/seed/${id}/400/300`}
                alt={`Producto ${id}`}
                className="rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg text-gray-800">
                Producto {id}
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Descripción breve del producto {id}.
              </p>
              <span className="block font-bold text-indigo-600 mb-4">
                ${id * 1000}
              </span>
              <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center py-6">
        <p className="text-sm">
          © {new Date().getFullYear()} Mi E-Commerce. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  )
}

export default Home
