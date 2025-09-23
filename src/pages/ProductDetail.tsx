// src/pages/ProductDetail.tsx
import { useParams, Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
};

const products: Product[] = [
  { id: 1, name: "Producto 1", price: 1000, description: "Descripción detallada del Producto 1", imageUrl: "https://picsum.photos/seed/1/400/300" },
  { id: 2, name: "Producto 2", price: 2000, description: "Descripción detallada del Producto 2", imageUrl: "https://picsum.photos/seed/2/400/300" },
  { id: 3, name: "Producto 3", price: 1500, description: "Descripción detallada del Producto 3", imageUrl: "https://picsum.photos/seed/3/400/300" },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === Number(id));

  if (!product) return <p className="p-6 text-center text-red-500">Producto no encontrado</p>;

  return (
    <div className="min-h-screen app-bg py-12 px-6 flex flex-col items-center">
      <img src={product.imageUrl} alt={product.name} className="rounded-lg mb-6 w-full max-w-md" />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <span className="text-[var(--color-sky)] font-bold text-xl mb-4">${product.price}</span>
      <p className="text-[var(--color-pale)] mb-6 text-center">{product.description}</p>
      <button className="btn-primary px-6 py-3 rounded hover:bg-[var(--color-navy)] transition mb-4">
        Agregar al carrito
      </button>
      <Link to="/productos" className="text-[var(--color-sky)] hover:underline">
        Volver a productos
      </Link>
    </div>
  );
};

export default ProductDetail;
