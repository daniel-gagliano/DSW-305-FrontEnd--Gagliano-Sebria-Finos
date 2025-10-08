import { useState, useEffect } from 'react';
import axios from 'axios';

// Define la interfaz para un pedido
interface Pedido {
  nro_pedido: number;
  precio_total: number;
  fecha_pedido: string;
  linea_pedido: {
    id_articulo: number;
    cantidad: number;
    sub_total: number;
  }[];
}

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Debes iniciar sesión para ver tu historial de pedidos.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/pedidos/usuario/${userId}`);
        setPedidos(response.data);
      } catch (err) {
        setError('No se pudieron cargar los pedidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Cargando pedidos...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-20 p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Pedidos</h1>
      {pedidos.length === 0 ? (
        <p>No has realizado ningún pedido todavía.</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.nro_pedido} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Pedido #{pedido.nro_pedido}</h2>
                <span className="text-gray-600">{new Date(pedido.fecha_pedido).toLocaleDateString()}</span>
              </div>
              <p className="text-right font-bold text-xl mb-2">${pedido.precio_total.toFixed(2)}</p>
              <ul>
                {pedido.linea_pedido.map((linea, index) => (
                  <li key={index} className="flex justify-between text-sm text-gray-700">
                    <span>Artículo ID: {linea.id_articulo} (x{linea.cantidad})</span>
                    <span>${linea.sub_total.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialPedidos;