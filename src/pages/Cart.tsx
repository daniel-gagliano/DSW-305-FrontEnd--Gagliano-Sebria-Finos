import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/cartContext";
import axiosClient from "../api/axiosClient";

type Provincia = {
  cod_provincia: number;
  descripcion: string;
  costo_envio: number;
};

type Metodo = {
  id_metodo: number;
  desc_metodo: string;
};

const Cart: React.FC = () => {
  const { items, updateItem, removeItem, clear, total } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [metodos, setMetodos] = useState<Metodo[]>([]);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
  const [selectedMetodo, setSelectedMetodo] = useState<number | null>(null);
  const [costoEnvio, setCostoEnvio] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, mRes] = await Promise.all([
          axiosClient.get('/provincias'),
          axiosClient.get('/metodos'),
        ]);
        setProvincias(pRes.data || []);
        setMetodos(mRes.data || []);
        if ((pRes.data || []).length > 0) {
          setSelectedProvincia(pRes.data[0].cod_provincia);
          setCostoEnvio(pRes.data[0].costo_envio || 0);
        }
        if ((mRes.data || []).length > 0) {
          setSelectedMetodo(mRes.data[0].id_metodo);
        }
      } catch (e) {
        console.error('Error loading provincias/metodos', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (selectedProvincia) {
      const p = provincias.find(pr => pr.cod_provincia === selectedProvincia);
      setCostoEnvio(p?.costo_envio || 0);
    }
  }, [selectedProvincia, provincias]);

  const handleCantidadChange = (id: number, cantidad: number) => {
    if (cantidad < 1) return;
    updateItem(id, cantidad);
  };

  const handleEliminar = (id: number) => removeItem(id);

  const handleCheckout = async () => {
    console.log('=== INICIANDO CHECKOUT ===');
    
    if (items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const userId = localStorage.getItem('userId');
    console.log('User ID:', userId);
    
    if (!userId) {
      alert('No hay usuario logueado');
      return;
    }

    setLoading(true);
    
    try {
      const linea_pedido = items.map(i => ({ 
        id_articulo: i.id_articulo, 
        cantidad: i.cantidad, 
        sub_total: i.precio * i.cantidad 
      }));

      const payload = {
        id_metodo: selectedMetodo || 1,
        nro_usuario: parseInt(userId),
        id_provincia: selectedProvincia || (provincias[0]?.cod_provincia ?? 1),
        linea_pedido: linea_pedido,
      };

      console.log('Payload a enviar:', payload);

      const res = await axiosClient.post('/pedidos', payload);
      
      console.log('Respuesta del servidor:', res.data);
      console.log('Status:', res.status);

      if (res.status === 200 || res.status === 201) {
        const provinciaSeleccionada = provincias.find(p => p.cod_provincia === selectedProvincia);
        const metodoSeleccionado = metodos.find(m => m.id_metodo === selectedMetodo);
        
        const datosCheckout = {
          nro_pedido: res.data.nro_pedido,
          precio_total: total + costoEnvio,
          metodo_pago: metodoSeleccionado?.desc_metodo || 'No especificado',
          provincia: provinciaSeleccionada?.descripcion || 'No especificada',
          items: items.map(i => ({
            nombre: i.nombre,
            cantidad: i.cantidad,
            precio: i.precio
          }))
        };
        
        console.log('Datos para checkout:', datosCheckout);
        console.log('Navegando a /checkout...');
        
        // Primero navegar, luego limpiar
        navigate('/checkout', { state: datosCheckout });
        
        // Pequeño delay antes de limpiar para asegurar la navegación
        setTimeout(() => {
          clear();
        }, 100);
        
      } else {
        console.error('Status inesperado:', res.status);
        alert('Error al crear el pedido');
      }
    } catch (err: any) {
      console.error('ERROR COMPLETO:', err);
      console.error('Respuesta del error:', err.response?.data);
      alert('Error en el servidor al procesar el pedido: ' + (err.response?.data?.error || err.message));
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
            <div className="bg-[var(--color-navy)] p-4 rounded text-[var(--color-pale)]">
              <label className="block mb-2">Provincia (envío):</label>
              <select 
                value={selectedProvincia ?? ''} 
                onChange={(e) => setSelectedProvincia(parseInt(e.target.value))} 
                className="w-full p-2 rounded bg-[var(--color-pale)] text-[var(--color-very-dark)]"
              >
                {provincias.map(p => (
                  <option key={p.cod_provincia} value={p.cod_provincia}>
                    {p.descripcion} - ${p.costo_envio}
                  </option>
                ))}
              </select>

              <label className="block mt-4 mb-2">Método de pago:</label>
              <select 
                value={selectedMetodo ?? ''} 
                onChange={(e) => setSelectedMetodo(parseInt(e.target.value))} 
                className="w-full p-2 rounded bg-[var(--color-pale)] text-[var(--color-very-dark)]"
              >
                {metodos.map(m => (
                  <option key={m.id_metodo} value={m.id_metodo}>
                    {m.desc_metodo}
                  </option>
                ))}
              </select>

              <div className="mt-3 text-sm">Costo de envío: <strong>${costoEnvio}</strong></div>
            </div>

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
                Total: ${total + costoEnvio}
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-2 bg-[var(--color-sky)] text-[var(--color-very-dark)] rounded hover:opacity-90 transition disabled:opacity-60 font-semibold"
              >
                {loading ? 'Procesando...' : 'Continuar compra'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;