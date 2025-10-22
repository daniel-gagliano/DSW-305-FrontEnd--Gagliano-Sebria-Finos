import { useState, useEffect } from "react";
import axios from "axios";

interface Pedido {
  nro_pedido: number;
  precio_total: number;
  fecha_pedido: string;
  direccion: string;
  usuario: {
    id: number;
    name: string;
    email: string;
  };
  localidad: {
    id_localidad: number;
    nombre: string;
    codigo_postal: string;
    provincia: {
      cod_provincia: number;
      descripcion: string;
      costo_envio: number;
    };
  };
  linea_pedido: {
    id_articulo: number;
    cantidad: number;
    sub_total: number;
    articulo: {
      id_articulo: number;
      nombre: string;
      precio: number;
    };
  }[];
}

const HistorialVentas = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "ADMIN") {
        setError("Acceso denegado. Solo el administrador puede ver esta página.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/pedidos");
        setPedidos(response.data);
      } catch (err) {
        setError("No se pudieron cargar los pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-very-dark)] flex items-center justify-center">
        <p className="text-[var(--color-pale)] text-xl">Cargando ventas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-very-dark)] flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-very-dark)] py-8">
      <div className="container mx-auto mt-20 p-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-[var(--color-pale)]">
          Historial de Ventas
        </h1>

        {pedidos.length === 0 ? (
          <div className="bg-[var(--color-navy)] p-8 rounded-lg text-center">
            <p className="text-[var(--color-pale)] text-lg">
              No hay pedidos registrados todavía.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div
                key={pedido.nro_pedido}
                className="bg-[var(--color-navy)] p-6 rounded-lg shadow-lg border border-[var(--color-midblue)] hover:border-[var(--color-sky)] transition"
              >
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--color-pale)]/20">
                  <h2 className="text-2xl font-bold text-[var(--color-sky)]">
                    Pedido #{pedido.nro_pedido}
                  </h2>
                  <span className="text-[var(--color-pale)] text-lg">
                    {new Date(pedido.fecha_pedido).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--color-pale)] mb-2">
                    Cliente
                  </h3>
                  <div className="text-[var(--color-pale)]">
                    <p>
                      <span className="text-[var(--color-pale)]/70">ID:</span>{" "}
                      {pedido.usuario.id}
                    </p>
                    <p>
                      <span className="text-[var(--color-pale)]/70">Nombre:</span>{" "}
                      {pedido.usuario.name}
                    </p>
                    <p>
                      <span className="text-[var(--color-pale)]/70">Email:</span>{" "}
                      {pedido.usuario.email}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[var(--color-pale)] mb-2">
                    Envío
                  </h3>
                  <p className="text-[var(--color-pale)]">
                    {pedido.direccion}, {pedido.localidad.nombre} (
                    {pedido.localidad.provincia.descripcion})
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[var(--color-pale)] mb-3">
                    Productos
                  </h3>
                  <ul className="space-y-2">
                    {pedido.linea_pedido.map((linea, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-[var(--color-midblue)] p-3 rounded text-[var(--color-pale)]"
                      >
                        <div>
                          <span className="font-semibold text-lg">
                            {linea.articulo.nombre}
                          </span>
                          <span className="text-[var(--color-pale)]/70 ml-2">
                            x{linea.cantidad}
                          </span>
                        </div>
                        <span className="font-bold text-lg text-[var(--color-sky)]">
                          ${linea.sub_total.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end items-center pt-4 border-t border-[var(--color-pale)]/20">
                  <span className="text-[var(--color-pale)] text-xl mr-3">
                    Total:
                  </span>
                  <span className="font-bold text-3xl text-[var(--color-sky)]">
                    ${pedido.precio_total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialVentas;
