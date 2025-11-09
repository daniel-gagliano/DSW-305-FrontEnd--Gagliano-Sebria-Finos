import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import axiosClient from "../api/axiosClient";

interface Categoria {
  id_categoria: number;
  nom_categoria: string;
  desc_categoria: string;
}

interface ArCa {
  categoria: Categoria;
}

interface Articulo {
  id_articulo: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  ar_ca: ArCa[];
}

const Home = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filtros
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  // Traer artículos del backend
useEffect(() => {
  const obtenerArticulos = async () => {
    try {
      const response = await axiosClient.get("/articulos");
      setArticulos(response.data); }

      catch (error) { console.error("Error:", error); }
      finally { setLoading(false); }
  };

  obtenerArticulos(); 
}, []);

  //Obtener categorías únicas
  const categorias = useMemo(() => {
    const setCategorias = new Set<string>();
    articulos.forEach((art) => {
      art.ar_ca.forEach((rel) => {
        if (rel.categoria && rel.categoria.nom_categoria)
          setCategorias.add(rel.categoria.nom_categoria);
      });
    });
    return ["Todas", ...Array.from(setCategorias)];
  }, [articulos]);

  // Filtrar y ordenar
  const articulosFiltrados = useMemo(() => 
  {
    let filtrados = [...articulos];

    // Buscar por nombre
    if (searchTerm.trim() !== "") {
      filtrados = filtrados.filter((a) =>
        a.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== "Todas") {
      filtrados = filtrados.filter((a) =>
        a.ar_ca.some(
          (rel) => rel.categoria.nom_categoria === selectedCategory
        )
      );
    }

    // Ordenar por precio
    if (sortOrder === "asc") {
      filtrados.sort((a, b) => a.precio - b.precio);
    } else if (sortOrder === "desc") {
      filtrados.sort((a, b) => b.precio - a.precio);
    }

    return filtrados;
  }, [articulos, sortOrder, searchTerm, selectedCategory]);

  //  Renderizado
  return (
    <div className="min-h-screen app-bg">
      <div className="w-full py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-pale)]">
            Todos los Productos
          </h2>

          <div className="flex flex-wrap gap-3">
            {/* Filtro por nombre */}
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="border rounded px-3 py-1 bg-[var(--color-pale)] text-[var(--color-very-dark)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filtro por categoría */}
            <select
              className="border rounded px-3 py-1 bg-[var(--color-pale)] text-[var(--color-very-dark)]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Ordenar por precio */}
            <select
              className="border rounded px-3 py-1 bg-[var(--color-pale)] text-[var(--color-very-dark)]"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}>

              <option value="asc">Menor Precio</option>
              <option value="desc">Mayor Precio</option>
            </select>
          </div>
        </div>

        {loading ?
        ( <div className="text-center text-lg">Cargando productos...</div>) : articulosFiltrados.length === 0 ? (
          
          <div className="text-center text-lg text-[var(--color-pale)]">
            No se encontraron productos.
          </div> ) : ( 
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {articulosFiltrados.map((articulo) => (
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
