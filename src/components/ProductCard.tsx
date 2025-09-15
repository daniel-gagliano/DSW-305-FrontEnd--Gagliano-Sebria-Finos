// src/components/ProductCard.tsx
import { Link } from "react-router-dom";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
};

const ProductCard = ({ id, name, price, imageUrl }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <img src={imageUrl} alt={name} className="rounded-lg mb-4 w-full h-48 object-cover" />
      <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
      <span className="block font-bold text-indigo-600 mb-4">${price}</span>
      <Link
        to={`/product/${id}`}
        className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded-lg text-center hover:bg-indigo-700 transition"
      >
        Ver detalle
      </Link>
    </div>
  );
};

export default ProductCard;
