import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// Define la estructura de un artículo para TypeScript
// Asegúrate de que estos campos coincidan con los que devuelve tu backend
interface Articulo {
  id_articulo: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
}

const Home = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const obtenerArticulos = async () => {
      try {
        const response = await fetch("http://localhost:3000/articulos");
        if (!response.ok) {
          throw new Error("Error al obtener los artículos");
        }
        const data: Articulo[] = await response.json();
        setArticulos(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerArticulos();
  }, []);

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

        {loading ? (
          <div className="text-center text-lg">Cargando productos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {articulos.map((articulo) => (
              <div
                key={articulo.id_articulo}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col"
              >
                <div
                  className="h-32 w-full rounded mb-4"
                  style={{ backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}
                ></div>

                <h3 className="font-semibold text-lg mb-1">{articulo.nombre}</h3>
                <span className="font-bold text-indigo-600 mb-1">${articulo.precio}</span>
                <p className="text-sm text-gray-500 mb-2">{articulo.descripcion}</p>
                <p className="text-sm text-gray-500 mb-2">Stock: {articulo.stock}</p>

                <button className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;