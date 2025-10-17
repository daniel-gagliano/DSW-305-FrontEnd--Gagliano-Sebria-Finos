import { Link } from "react-router-dom";
import { useCart } from "../store/cartContext";
import { useState } from "react";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  showAdd?: boolean;
};

const ProductCard = ({ id, name, price, imageUrl, showAdd = true }: ProductCardProps) => {
  const { addItem } = useCart();
  const [showMsg, setShowMsg] = useState(false);

  const handleAdd = () => {
    addItem({ id_articulo: id, nombre: name, precio: price, cantidad: 1 });
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 1200);
  };

  return (
    <div className="bg-[var(--color-pale)] rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col border border-transparent hover:border-[var(--color-sky)]">
      {/* Siempre muestra un rectángulo de color sólido con la inicial del producto */}
      <div className="rounded-lg mb-4 w-full h-48 flex items-center justify-center text-white font-bold text-4xl bg-[var(--color-midblue)]">
        {name.slice(0,1).toUpperCase()}
      </div>
      
      <h3 className="font-semibold text-lg text-[var(--color-very-dark)]">{name}</h3>
      <span className="block font-bold text-[var(--color-sky)] mb-4">${price}</span>
      
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
            className="bg-[var(--color-sky)] text-[var(--color-very-dark)] py-2 px-4 rounded-lg hover:brightness-90 transition"
          >
            Agregar
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