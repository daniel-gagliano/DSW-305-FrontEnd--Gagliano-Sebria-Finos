// src/components/ProductCard.tsx
import { Link } from "react-router-dom";
import { useCart } from "../store/cartContext";

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

  const handleAdd = () => {
    addItem({ id_articulo: id, nombre: name, precio: price, cantidad: 1 });
  };

  return (
    <div className="bg-[var(--color-pale)] rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col border border-transparent hover:border-[var(--color-sky)]">
      <img src={imageUrl} alt={name} className="rounded-lg mb-4 w-full h-48 object-cover" />
      <h3 className="font-semibold text-lg text-[var(--color-very-dark)]">{name}</h3>
      <span className="block font-bold text-[var(--color-sky)] mb-4">${price}</span>
      <div className="mt-auto flex gap-2">
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
      </div>
    </div>
  );
};

export default ProductCard;
