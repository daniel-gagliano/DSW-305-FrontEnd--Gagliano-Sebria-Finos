import React, { useState } from "react";
import { useCart } from "../store/cartContext";
import axiosClient from "../api/axiosClient";

const Cart: React.FC = () => {
  const { items, updateItem, removeItem, clear, total } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCantidadChange = (id: number, cantidad: number) => {
    if (cantidad < 1) return;
    updateItem(id, cantidad);
  };

  const handleEliminar = (id: number) => removeItem(id);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      // construir linea_pedido según el backend: { id_articulo, cantidad, sub_total }
      const linea_pedido = items.map(i => ({ id_articulo: i.id_articulo, cantidad: i.cantidad, sub_total: i.precio * i.cantidad }));

      const payload = {
        id_metodo: 1, // demo/default
        nro_usuario: 1, // demo user id — replace with auth user id when available
        id_localidad: 1, // demo/default
        linea_pedido
      };

      
      const res = await axiosClient.post('/pedidos', payload);
      if (res.status === 200 || res.status === 201) {
        clear();
        // opcional: redirigir a detalle de pedido o mostrar mensaje
        alert('Pedido creado correctamente');
      } else {
        alert('Error al crear el pedido');
      }
    } catch (err) {
      console.error(err);
      alert('Error en el servidor al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-very-dark)]">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-pale)]">Mi Carrito</h2>

        {items.length === 0 ? (
          <p className="text-center text-[var(--color-pale)]">Tu carrito está vacío</p>
        ) : (
          <div className="space-y-4">
            {items.map((producto) => (
              <div
                key={producto.id_articulo}
                className="flex items-center justify-between bg-[var(--color-navy)] p-4 rounded shadow border border-transparent"
              >
                <div>
                  <h3 className="font-semibold text-[var(--color-pale)]">{producto.nombre}</h3>
                  <span className="text-[var(--color-pale)]">${producto.precio}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={1}
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleCantidadChange(
                        producto.id_articulo,
                        parseInt(e.target.value)
                      )
                    }
                    className="w-16 p-1 border rounded text-center bg-[var(--color-pale)] text-[var(--color-very-dark)]"
                  />
                  <button
                    onClick={() => handleEliminar(producto.id_articulo)}
                    className="text-[var(--color-sky)] hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right font-bold text-lg text-[var(--color-pale)]">
              Total: ${total}
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-2 bg-[var(--color-sky)] text-[var(--color-very-dark)] rounded hover:bg-[var(--color-navy)] transition disabled:opacity-60"
            >
              {loading ? 'Procesando...' : 'Continuar compra'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
