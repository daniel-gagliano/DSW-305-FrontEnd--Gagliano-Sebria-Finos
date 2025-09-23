import { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";

// datos de ejemplo (más adelante vendrán del backend)
const initialProducts = [
  { id: 1, name: "Producto 1", price: 1000, imageUrl: "https://picsum.photos/seed/1/400/300" },
  { id: 2, name: "Producto 2", price: 2000, imageUrl: "https://picsum.photos/seed/2/400/300" },
  { id: 3, name: "Producto 3", price: 1500, imageUrl: "https://picsum.photos/seed/3/400/300" },
];

const ProductList = () => {
  // estado con los productos (si en futuro vienen del back, reemplazar acá)
  const [products] = useState(initialProducts);
  // estado de orden: 'none' | 'asc' | 'desc'
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  // lista ordenada memoizada para no reordenar en cada render innecesariamente
  const sorted = useMemo(() => {
    if (sortOrder === 'none') return products;
    const copy = [...products];
    copy.sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));
    return copy;
  }, [products, sortOrder]);

  return (
  <div className="min-h-screen app-bg py-12 px-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Todos los Productos</h1>

      {/* Controles de filtrado/ordenamiento */}
      <div className="mb-6 flex items-center gap-4">
  <label className="text-sm label-muted">Ordenar por precio:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="none">Sin orden</option>
          <option value="asc">Menor precio</option>
          <option value="desc">Mayor precio</option>
        </select>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {sorted.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

// Esta línea es clave
export default ProductList;
