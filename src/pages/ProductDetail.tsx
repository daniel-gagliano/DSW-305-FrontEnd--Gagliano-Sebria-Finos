import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../store/cartContext";

interface Articulo {
  id_articulo: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [producto, setProducto] = useState<Articulo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:3000/articulos/${id}`);
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await response.json();
        setProducto(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const handleAddToCart = () => {
    if (producto && cantidad > 0 && cantidad <= producto.stock) {
      addItem({
        id_articulo: producto.id_articulo,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad
      });
      setShowMsg(true);
      setTimeout(() => setShowMsg(false), 2000);
    } else if (producto && cantidad > producto.stock) {
      // ← NUEVO: Alerta si intenta agregar más del stock
      alert(`Solo hay ${producto.stock} unidades disponibles`);
    }
  };

  // ← NUEVA FUNCIÓN: Manejar cambio de cantidad con validación
  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) {
      setCantidad(1);
    } else if (producto && val > producto.stock) {
      setCantidad(producto.stock);
      alert(`Stock máximo: ${producto.stock} unidades`);
    } else {
      setCantidad(val);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-very-dark)] flex items-center justify-center">
        <p className="text-[var(--color-pale)] text-xl">Cargando producto...</p>
      </div>
    );
  }

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

  // ← NUEVA VARIABLE: Calcular si está casi sin stock
  const isLowStock = producto.stock > 0 && producto.stock < 10;

  return (
    <div className="min-h-screen bg-[var(--color-very-dark)] py-8">
      <div className="container mx-auto mt-20 px-6 max-w-6xl">
        <Link 
          to="/productos" 
          className="inline-block mb-6 text-[var(--color-sky)] hover:text-[var(--color-pale)] transition"
        >
          ← Volver a productos
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--color-navy)] p-8 rounded-lg shadow-lg">
          
          {/* Columna izquierda: Imagen */}
          <div className="flex items-center justify-center relative">
            <div className="w-full h-96 rounded-lg bg-[var(--color-midblue)] flex items-center justify-center text-white font-bold text-6xl shadow-lg">
              {producto.nombre.slice(0, 1).toUpperCase()}
            </div>
            
            {/* ← NUEVO: Badge de stock en la imagen */}
            {producto.stock === 0 && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                SIN STOCK
              </div>
            )}
            {isLowStock && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                ¡Últimas {producto.stock}!
              </div>
            )}
          </div>

          {/* Columna derecha: Información */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-[var(--color-pale)]">
                {producto.nombre}
              </h1>

              <p className="text-[var(--color-pale)]/80 text-lg mb-6 leading-relaxed">
                {producto.descripcion}
              </p>

              <div className="mb-4">
                <span className="text-[var(--color-pale)]/70 text-lg">Precio:</span>
                <p className="text-5xl font-bold text-[var(--color-sky)] mt-1">
                  ${producto.precio.toFixed(2)}
                </p>
              </div>

              {/* ← MEJORADO: Mostrar stock con estilos según disponibilidad */}
              <div className="mb-6">
                <span className="text-[var(--color-pale)]/70 text-lg">Stock disponible:</span>
                {producto.stock === 0 ? (
                  <div className="mt-2 bg-red-900/30 border border-red-500 rounded-lg p-3">
                    <p className="text-xl font-bold text-red-400">Sin stock</p>
                    <p className="text-sm text-red-300">Este producto no está disponible</p>
                  </div>
                ) : isLowStock ? (
                  <div className="mt-2 bg-yellow-900/30 border border-yellow-500 rounded-lg p-3">
                    <p className="text-xl font-bold text-yellow-400">¡Últimas {producto.stock} unidades!</p>
                    <p className="text-sm text-yellow-300">Aprovecha antes de que se agoten</p>
                  </div>
                ) : (
                  <p className="text-2xl font-semibold text-green-400 mt-1">
                    {producto.stock} unidades
                  </p>
                )}
              </div>
            </div>

            {/* Selector de cantidad y botón agregar */}
            <div className="space-y-4">
              {producto.stock > 0 && (
                <div>
                  <label className="block text-[var(--color-pale)] mb-2 text-lg">
                    Cantidad:
                  </label>
                  <div className="flex items-center gap-3">
                    {/* ← NUEVO: Botones - y + */}
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="bg-[var(--color-midblue)] text-[var(--color-pale)] px-4 py-2 rounded-lg font-bold hover:brightness-110"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={producto.stock}
                      value={cantidad}
                      onChange={handleCantidadChange}
                      className="w-24 p-2 rounded bg-[var(--color-pale)] text-[var(--color-very-dark)] text-center text-lg font-semibold"
                    />
                    <button
                      onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                      className="bg-[var(--color-midblue)] text-[var(--color-pale)] px-4 py-2 rounded-lg font-bold hover:brightness-110"
                    >
                      +
                    </button>
                    <span className="text-[var(--color-pale)]/70 text-sm">
                      (máx: {producto.stock})
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={producto.stock === 0}
                  className="flex-1 py-3 px-6 bg-[var(--color-sky)] text-[var(--color-very-dark)] rounded-lg text-lg font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500"
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