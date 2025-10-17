import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../store/cartContext";

// Define la interfaz del producto
interface Articulo {
  id_articulo: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
}

const ProductDetail = () => {
  // El useParams obtiene el ID del producto desde la URL
  const { id } = useParams<{ id: string }>();
  // El navigate permite redirigir programáticamente
  const navigate = useNavigate();
  // El useCart obtiene la función para agregar al carrito
  const { addItem } = useCart();
  
  // Estados para manejar el producto, carga y errores
  const [producto, setProducto] = useState<Articulo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [showMsg, setShowMsg] = useState(false);

  // El useEffect se ejecuta cuando el componente se monta o cambia el ID
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        // Hace la petición GET al endpoint de artículos por ID
        const response = await fetch(`http://localhost:3000/articulos/${id}`);
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        // Parsea la respuesta JSON y guarda el producto
        const data = await response.json();
        setProducto(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]); // El efecto se ejecuta cada vez que cambia el ID

  // Función que maneja agregar el producto al carrito
  const handleAddToCart = () => {
    if (producto && cantidad > 0 && cantidad <= producto.stock) {
      // Llama a la función addItem del contexto del carrito
      addItem({
        id_articulo: producto.id_articulo,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad
      });
      // Muestra mensaje de confirmación
      setShowMsg(true);
      // Oculta el mensaje después de 2 segundos
      setTimeout(() => setShowMsg(false), 2000);
    }
  };

  // Muestra un mensaje de carga mientras obtiene los datos
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-very-dark)] flex items-center justify-center">
        <p className="text-[var(--color-pale)] text-xl">Cargando producto...</p>
      </div>
    );
  }

  // Muestra un mensaje de error si algo falló
  if (error || !producto) {
    return (
      <div className="min-h-screen bg-[var(--color-very-dark)] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-xl">{error || "Producto no encontrado"}</p>
        <Link 
          to="/productos" 
          className="text-[var(--color-sky)] hover:underline text-lg"
        >
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-very-dark)] py-8">
      <div className="container mx-auto mt-20 px-6 max-w-6xl">
        {/* Botón volver */}
        <Link 
          to="/productos" 
          className="inline-block mb-6 text-[var(--color-sky)] hover:text-[var(--color-pale)] transition"
        >
          ← Volver a productos
        </Link>

        {/* Layout principal: imagen izquierda, info derecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--color-navy)] p-8 rounded-lg shadow-lg">
          
          {/* Columna izquierda: Imagen */}
          <div className="flex items-center justify-center">
            <div className="w-full h-96 rounded-lg bg-[var(--color-midblue)] flex items-center justify-center text-white font-bold text-6xl shadow-lg">
              {/* Muestra la inicial del nombre del producto en grande */}
              {producto.nombre.slice(0, 1).toUpperCase()}
            </div>
          </div>

          {/* Columna derecha: Información */}
          <div className="flex flex-col justify-between">
            {/* Nombre del producto */}
            <div>
              <h1 className="text-4xl font-bold mb-4 text-[var(--color-pale)]">
                {producto.nombre}
              </h1>

              {/* Descripción */}
              <p className="text-[var(--color-pale)]/80 text-lg mb-6 leading-relaxed">
                {producto.descripcion}
              </p>

              {/* Precio */}
              <div className="mb-4">
                <span className="text-[var(--color-pale)]/70 text-lg">Precio:</span>
                <p className="text-5xl font-bold text-[var(--color-sky)] mt-1">
                  ${producto.precio.toFixed(2)}
                </p>
              </div>

              {/* Stock */}
              <div className="mb-6">
                <span className="text-[var(--color-pale)]/70 text-lg">Stock disponible:</span>
                <p className="text-2xl font-semibold text-[var(--color-pale)] mt-1">
                  {producto.stock > 0 ? (
                    <span className="text-green-400">{producto.stock} unidades</span>
                  ) : (
                    <span className="text-red-400">Sin stock</span>
                  )}
                </p>
              </div>
            </div>

            {/* Selector de cantidad y botón agregar */}
            <div className="space-y-4">
              {producto.stock > 0 && (
                <div>
                  <label className="block text-[var(--color-pale)] mb-2 text-lg">
                    Cantidad:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={producto.stock}
                    value={cantidad}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      // Valida que la cantidad esté entre 1 y el stock disponible
                      if (val >= 1 && val <= producto.stock) {
                        setCantidad(val);
                      }
                    }}
                    className="w-24 p-2 rounded bg-[var(--color-pale)] text-[var(--color-very-dark)] text-center text-lg font-semibold"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={producto.stock === 0}
                  className="flex-1 py-3 px-6 bg-[var(--color-sky)] text-[var(--color-very-dark)] rounded-lg text-lg font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {producto.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                </button>

                <button
                  onClick={() => navigate('/cart')}
                  className="py-3 px-6 bg-[var(--color-midblue)] text-[var(--color-pale)] rounded-lg text-lg font-semibold hover:bg-[var(--color-navy)] transition border border-[var(--color-pale)]"
                >
                  Ver carrito
                </button>
              </div>

              {/* Mensaje de confirmación cuando se agrega al carrito */}
              {showMsg && (
                <div className="bg-green-500 text-white p-3 rounded-lg text-center font-semibold animate-fade-in-out">
                  ✓ Producto agregado al carrito
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;