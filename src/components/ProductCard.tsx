import { Link } from "react-router-dom";
import { useCart } from "../store/cartContext";
import { useState, useEffect } from "react";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  description?: string;
  showAdd?: boolean;
};

const ProductCard = ({ id, name, price, stock, imageUrl, showAdd = true }: ProductCardProps) => {
  const { addItem, items } = useCart(); // ← AGREGAR items
  const [showMsg, setShowMsg] = useState(false);
  const [cantidadEnCarrito, setCantidadEnCarrito] = useState(0); // ← NUEVO

  // ← NUEVO: Calcular cuánto hay en el carrito
  useEffect(() => {
    const itemEnCarrito = items.find(item => item.id_articulo === id);
    setCantidadEnCarrito(itemEnCarrito ? itemEnCarrito.cantidad : 0);
  }, [items, id]);

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 10;
  const stockDisponible = stock - cantidadEnCarrito; // ← NUEVO: Stock real disponible

  const handleAdd = () => {
    if (isOutOfStock) {
      alert('Producto sin stock');
      return;
    }
    
    // ← NUEVO: Validar que no supere el stock disponible
    if (stockDisponible <= 0) {
      alert(`Ya tienes el máximo disponible (${stock} unidades) en el carrito`);
      return;
    }
    
    addItem({ id_articulo: id, nombre: name, precio: price, cantidad: 1 });
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 1200);
  };

  return (
    <div className="bg-[var(--color-pale)] rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col border border-transparent hover:border-[var(--color-sky)] relative">
      
      {/* Badges de stock sobre la imagen */}
      {isOutOfStock && (
        <div className="absolute top-6 right-6 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
          SIN STOCK
        </div>
      )}
      {isLowStock && (
        <div className="absolute top-6 right-6 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
          ¡Últimas {stock}!
        </div>
      )}

      {/* Imagen/Placeholder del producto */}
      <div className={`rounded-lg mb-4 w-full h-48 flex items-center justify-center text-white font-bold text-4xl bg-[var(--color-midblue)] ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}>
        {name.slice(0,1).toUpperCase()}
      </div>
      
      <h3 className="font-semibold text-lg text-[var(--color-very-dark)]">{name}</h3>
      <span className="block font-bold text-[var(--color-sky)] mb-2">${price}</span>
      
      {/* Mostrar información de stock */}
      <div className="mb-3">
        {isOutOfStock ? (
          <span className="text-red-600 font-medium text-sm">Sin stock disponible</span>
        ) : stockDisponible <= 0 ? ( 
          // ← NUEVO: Mostrar si ya tiene todo el stock en el carrito
          <span className="text-orange-600 font-medium text-sm">
            Máximo en carrito ({cantidadEnCarrito}/{stock})
          </span>
        ) : isLowStock ? (
          <span className="text-yellow-600 font-medium text-sm">
            Solo quedan {stock} unidades
            {cantidadEnCarrito > 0 && ` (${cantidadEnCarrito} en carrito)`}
          </span>
        ) : (
          <span className="text-green-600 font-medium text-sm">
            Stock: {stock} unidades
            {cantidadEnCarrito > 0 && ` (${cantidadEnCarrito} en carrito)`}
          </span>
        )}
      </div>
      
      <div className="mt-auto flex gap-2 relative">
        <Link
          to={`/product/${id}`}
          className="flex-1 bg-[var(--color-midblue)] text-[var(--color-pale)] py-2 px-4 rounded-lg text-center hover:bg-[var(--color-navy)] transition"
        >
          Ver detalle
        </Link>
        {showAdd && (
          <button
            onClick={handleAdd}
            disabled={isOutOfStock || stockDisponible <= 0} // ← ACTUALIZADO
            className={`py-2 px-4 rounded-lg transition ${
              isOutOfStock || stockDisponible <= 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-[var(--color-sky)] text-[var(--color-very-dark)] hover:brightness-90'
            }`}
          >
            {isOutOfStock ? 'Sin stock' : stockDisponible <= 0 ? 'Máximo' : 'Agregar'}
          </button>
        )}
        {showMsg && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded px-2 py-1 shadow-lg animate-fade-in-out" style={{zIndex:10}}>
            ¡Producto agregado!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;