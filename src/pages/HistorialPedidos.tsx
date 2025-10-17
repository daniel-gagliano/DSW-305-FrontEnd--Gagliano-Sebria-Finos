import { useState, useEffect } from 'react';
import axios from 'axios';

// Define la interfaz para un pedido - Ahora incluye localidad y provincia
interface Pedido {
  nro_pedido: number;
  precio_total: number;
  fecha_pedido: string;
  direccion: string;
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
      descripcion: string;
      precio: number;
      stock: number;
    };
  }[];
}

const HistorialPedidos = () => {
  // El useState define el estado para almacenar los pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  // El loading indica si está cargando los datos
  const [loading, setLoading] = useState(true);
  // El error almacena mensajes de error si algo falla
  const [error, setError] = useState<string | null>(null);

  // El useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    const fetchPedidos = async () => {
      // Obtiene el ID del usuario desde el localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Debes iniciar sesión para ver tu historial de pedidos.');
        setLoading(false);
        return;
      }

      try {
        // Hace la petición GET al endpoint de pedidos por usuario
        const response = await axios.get(`http://localhost:3000/pedidos/usuario/${userId}`);
        // Guarda los pedidos en el estado
        setPedidos(response.data);
      } catch (err) {
        setError('No se pudieron cargar los pedidos.');
      } finally {
        // Siempre establece loading en false al terminar
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  // Renderiza un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-very-dark)] flex items-center justify-center">
        <p className="text-[var(--color-pale)] text-xl">Cargando pedidos...</p>
      </div>
    );
  }

  // Renderiza un mensaje de error si algo falló
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-very-dark)] flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-very-dark)] py-8">
      <div className="container mx-auto mt-20 p-6 max-w-5xl">
        {/* Título principal de la página */}
        <h1 className="text-3xl font-bold mb-6 text-[var(--color-pale)]">Historial de Pedidos</h1>
        
        {/* Verifica si hay pedidos o muestra mensaje vacío */}
        {pedidos.length === 0 ? (
          <div className="bg-[var(--color-navy)] p-8 rounded-lg text-center">
            <p className="text-[var(--color-pale)] text-lg">No has realizado ningún pedido todavía.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* El map itera sobre cada pedido y crea una card */}
            {pedidos.map((pedido) => (
              <div 
                key={pedido.nro_pedido} 
                className="bg-[var(--color-navy)] p-6 rounded-lg shadow-lg border border-[var(--color-midblue)] hover:border-[var(--color-sky)] transition"
              >
                {/* Header del pedido con número y fecha */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--color-pale)]/20">
                  <h2 className="text-2xl font-bold text-[var(--color-sky)]">
                    Pedido #{pedido.nro_pedido}
                  </h2>
                  <span className="text-[var(--color-pale)] text-lg">
                    {/* El toLocaleDateString formatea la fecha de manera legible */}
                    {new Date(pedido.fecha_pedido).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Información de envío */}
                <div className="mb-4 space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--color-pale)] mb-3">
                    📦 Información de Envío
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[var(--color-pale)]">
                    <div>
                      <span className="text-[var(--color-pale)]/70">Provincia:</span>
                      <span className="ml-2 font-semibold">{pedido.localidad.provincia.descripcion}</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-pale)]/70">Localidad:</span>
                      <span className="ml-2 font-semibold">
                        {pedido.localidad.nombre} (CP: {pedido.localidad.codigo_postal})
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-[var(--color-pale)]/70">Dirección:</span>
                      <span className="ml-2 font-semibold">{pedido.direccion}</span>
                    </div>
                  </div>
                </div>

                {/* Lista de productos */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[var(--color-pale)] mb-3">
                    🛍️ Productos
                  </h3>
                  <ul className="space-y-2">
                    {/* El map itera sobre cada línea de pedido */}
                    {pedido.linea_pedido.map((linea, index) => (
                      <li 
                        key={index} 
                        className="flex justify-between items-center bg-[var(--color-midblue)] p-3 rounded text-[var(--color-pale)]"
                      >
                        <div>
                          <span className="font-semibold text-lg">{linea.articulo.nombre}</span>
                          <span className="text-[var(--color-pale)]/70 ml-2">x{linea.cantidad}</span>
                        </div>
                        <span className="font-bold text-lg text-[var(--color-sky)]">
                          ${linea.sub_total.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total del pedido */}
                <div className="flex justify-end items-center pt-4 border-t border-[var(--color-pale)]/20">
                  <span className="text-[var(--color-pale)] text-xl mr-3">Total:</span>
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

export default HistorialPedidos;