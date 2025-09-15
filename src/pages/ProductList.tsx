import ProductCard from "../components/ProductCard";

const products = [
  { id: 1, name: "Producto 1", price: 1000, imageUrl: "https://picsum.photos/seed/1/400/300" },
  { id: 2, name: "Producto 2", price: 2000, imageUrl: "https://picsum.photos/seed/2/400/300" },
  { id: 3, name: "Producto 3", price: 1500, imageUrl: "https://picsum.photos/seed/3/400/300" },
];

const ProductList = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Todos los Productos</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
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
