import React, { useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

const Cart = () => {
  // ejemplo de productos en el carrito
  const [carrito, setCarrito] = useState<Producto[]>([
    { id: 1, nombre: "Producto 1", precio: 1000, cantidad: 2 },
    { id: 2, nombre: "Producto 2", precio: 500, cantidad: 1 },
  ]);

  const handleCantidadChange = (id: number, cantidad: number) => {
    setCarrito((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad } : p))
    );
  };

  const handleEliminar = (id: number) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Mi Carrito</h2>

        {carrito.length === 0 ? (
          <p className="text-center text-gray-600">Tu carrito está vacío</p>
        ) : (
          <div className="space-y-4">
            {carrito.map((producto) => (
              <div
                key={producto.id}
                className="flex items-center justify-between bg-white p-4 rounded shadow"
              >
                <div>
                  <h3 className="font-semibold">{producto.nombre}</h3>
                  <span className="text-gray-600">${producto.precio}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={1}
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleCantidadChange(
                        producto.id,
                        parseInt(e.target.value)
                      )
                    }
                    className="w-16 p-1 border rounded text-center"
                  />
                  <button
                    onClick={() => handleEliminar(producto.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right font-bold text-lg">
              Total: ${total}
            </div>

            <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
