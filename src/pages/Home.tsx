import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

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
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const sortedArticulos = React.useMemo(() => {
    if (sortOrder === 'none') return articulos;
    const copy = [...articulos];
    copy.sort((a, b) => (sortOrder === 'asc' ? a.precio - b.precio : b.precio - a.precio));
    return copy;
  }, [articulos, sortOrder]);

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
    <div className="min-h-screen app-bg">
      <div className="w-full py-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-pale)]">Todos los Productos</h2>
          <select
            className="border border-transparent rounded px-3 py-1 bg-[var(--color-pale)] text-[var(--color-very-dark)]"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
          >
            <option value="none">Más Vendidos</option>
            <option value="asc">Menor Precio</option>
            <option value="desc">Mayor Precio</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-lg">Cargando productos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {sortedArticulos.map((articulo) => (
              <ProductCard
                key={articulo.id_articulo}
                id={articulo.id_articulo}
                name={articulo.nombre}
                price={articulo.precio}
                stock={articulo.stock} 
                imageUrl={"/placeholder.png"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;