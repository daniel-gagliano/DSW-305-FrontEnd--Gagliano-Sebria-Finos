import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/cartContext";
import axiosClient from "../api/axiosClient";

// Define el tipo de dato para una Provincia
type Provincia = {
  cod_provincia: number;
  descripcion: string;
  costo_envio: number;
};

// Define el tipo de dato para una Localidad
type Localidad = {
  id_localidad: number;
  nombre: string;
  codigo_postal: string;
  cod_provincia: number;
};

// Define el tipo de dato para un Método de Pago
type Metodo = {
  id_metodo: number;
  desc_metodo: string;
};

const Cart: React.FC = () => {
  // El hook useCart obtiene las funciones y datos del contexto del carrito
  const { items, updateItem, removeItem, clear, total } = useCart();
  // El hook useNavigate permite navegar entre páginas programáticamente
  const navigate = useNavigate();
  
  // Estados para manejar la carga y los datos
  const [loading, setLoading] = useState(false);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [metodos, setMetodos] = useState<Metodo[]>([]);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState<number | null>(null);
  const [selectedMetodo, setSelectedMetodo] = useState<number | null>(null);
  const [direccion, setDireccion] = useState<string>(''); // Estado para la dirección
  const [costoEnvio, setCostoEnvio] = useState<number>(0);

  // El useEffect se ejecuta cuando el componente se monta (carga inicial)
  useEffect(() => {
    const load = async () => {
      try {
        // El Promise.all ejecuta ambas peticiones HTTP en paralelo para mayor eficiencia
        const [pRes, mRes] = await Promise.all([
          axiosClient.get('/provincias'),
          axiosClient.get('/metodos'),
        ]);
        
        // El operador || asegura que siempre haya un array, incluso si la respuesta es null/undefined
        setProvincias(pRes.data || []);
        setMetodos(mRes.data || []);
        
        // Si hay provincias disponibles, selecciona automáticamente la primera
        if ((pRes.data || []).length > 0) {
          setSelectedProvincia(pRes.data[0].cod_provincia);
          setCostoEnvio(pRes.data[0].costo_envio || 0);
        }
        
        // Si hay métodos de pago disponibles, selecciona automáticamente el primero
        if ((mRes.data || []).length > 0) {
          setSelectedMetodo(mRes.data[0].id_metodo);
        }
      } catch (e) {
        console.error('Error loading provincias/metodos', e);
      }
    };
    load();
  }, []);

  // Este useEffect se ejecuta cada vez que cambia la provincia seleccionada
  useEffect(() => {
    const cargarLocalidades = async () => {
      if (!selectedProvincia) {
        // Si no hay provincia seleccionada, limpia las localidades
        setLocalidades([]);
        setSelectedLocalidad(null);
        return;
      }

      try {
        // Hace una petición GET al endpoint que filtra localidades por provincia
        const response = await axiosClient.get(`/localidades/provincia/${selectedProvincia}`);
        // El response.data contiene el array de localidades filtradas
        setLocalidades(response.data || []);
        
        // Si hay localidades disponibles, selecciona automáticamente la primera
        if ((response.data || []).length > 0) {
          setSelectedLocalidad(response.data[0].id_localidad);
        } else {
          // Si no hay localidades para esta provincia, limpia la selección
          setSelectedLocalidad(null);
        }
      } catch (error) {
        console.error('Error al cargar localidades:', error);
        setLocalidades([]);
        setSelectedLocalidad(null);
      }
    };

    cargarLocalidades();
  }, [selectedProvincia]); // Este efecto se ejecuta cuando selectedProvincia cambia

  // Este useEffect actualiza el costo de envío cuando cambia la provincia
  useEffect(() => {
    if (selectedProvincia) {
      // El método find busca en el array la provincia que coincida con el código seleccionado
      const p = provincias.find(pr => pr.cod_provincia === selectedProvincia);
      // El operador ?. (optional chaining) evita errores si p es undefined
      setCostoEnvio(p?.costo_envio || 0);
    }
  }, [selectedProvincia, provincias]);

  // Función que maneja el cambio de cantidad de un producto
  const handleCantidadChange = (id: number, cantidad: number) => {
    // Previene que la cantidad sea menor a 1
    if (cantidad < 1) return;
    // Llama a la función updateItem del contexto para actualizar la cantidad
    updateItem(id, cantidad);
  };

  // Función que elimina un producto del carrito
  const handleEliminar = (id: number) => removeItem(id);

  // Función principal que procesa la compra
  const handleCheckout = async () => {
    console.log('=== INICIANDO CHECKOUT ===');
    
    // Validación: verifica que el carrito no esté vacío
    if (items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Obtiene el ID del usuario desde el localStorage del navegador
    const userId = localStorage.getItem('userId');
    console.log('User ID:', userId);
    
    // Validación: verifica que haya un usuario logueado
    if (!userId) {
      alert('No hay usuario logueado');
      return;
    }

    // Validación: verifica que se haya seleccionado una localidad
    if (!selectedLocalidad) {
      alert('Por favor selecciona una localidad para el envío');
      return;
    }

    // El trim() elimina espacios en blanco al inicio y final
    const direccionLimpia = direccion.trim();
    
    // Validación: verifica que la dirección no esté vacía
    if (!direccionLimpia) {
      alert('Por favor ingresa tu dirección de entrega');
      return;
    }

    // Validación: verifica que la dirección tenga al menos 5 caracteres
    if (direccionLimpia.length < 5) {
      alert('La dirección debe tener al menos 5 caracteres');
      return;
    }

    // Cambia el estado a "cargando" para deshabilitar el botón y mostrar feedback
    setLoading(true);
    
    try {
      // El map transforma cada item del carrito en el formato que espera el backend
      const linea_pedido = items.map(i => ({ 
        id_articulo: i.id_articulo, 
        cantidad: i.cantidad, 
        sub_total: i.precio * i.cantidad 
      }));

      // Construye el objeto payload con todos los datos necesarios para crear el pedido
      const payload = {
        id_metodo: selectedMetodo || 1,
        nro_usuario: parseInt(userId),
        id_localidad: selectedLocalidad,
        direccion: direccionLimpia, // Envía la dirección limpia al backend
        linea_pedido: linea_pedido,
      };

      console.log('Payload a enviar:', payload);

      // Hace la petición POST al endpoint de pedidos
      const res = await axiosClient.post('/pedidos', payload);
      
      console.log('Respuesta del servidor:', res.data);
      console.log('Status:', res.status);

      // Verifica que la respuesta sea exitosa (códigos 200 o 201)
      if (res.status === 200 || res.status === 201) {
        // El find busca la provincia seleccionada en el array de provincias
        const provinciaSeleccionada = provincias.find(p => p.cod_provincia === selectedProvincia);
        // El find busca la localidad seleccionada en el array de localidades
        const localidadSeleccionada = localidades.find(l => l.id_localidad === selectedLocalidad);
        // El find busca el método de pago seleccionado en el array de métodos
        const metodoSeleccionado = metodos.find(m => m.id_metodo === selectedMetodo);
        
        // Construye un objeto con todos los datos para la página de confirmación
        const datosCheckout = {
          nro_pedido: res.data.nro_pedido,
          precio_total: total + costoEnvio,
          metodo_pago: metodoSeleccionado?.desc_metodo || 'No especificado',
          provincia: provinciaSeleccionada?.descripcion || 'No especificada',
          localidad: localidadSeleccionada?.nombre || 'No especificada',
          direccion: direccionLimpia, // Incluye la dirección en los datos de confirmación
          items: items.map(i => ({
            nombre: i.nombre,
            cantidad: i.cantidad,
            precio: i.precio
          }))
        };
        
        console.log('Datos para checkout:', datosCheckout);
        console.log('Navegando a /checkout...');
        
        // Navega a la página de confirmación pasando los datos mediante state
        navigate('/checkout', { state: datosCheckout });
        
        // El setTimeout añade un pequeño retraso antes de limpiar el carrito
        // Esto asegura que la navegación se complete antes de limpiar los datos
        setTimeout(() => {
          clear();
          setDireccion(''); // Limpia el campo de dirección también
        }, 100);
        
      } else {
        console.error('Status inesperado:', res.status);
        alert('Error al crear el pedido');
      }
    } catch (err: any) {
      // El bloque catch maneja cualquier error que ocurra durante el proceso
      console.error('ERROR COMPLETO:', err);
      console.error('Respuesta del error:', err.response?.data);
      // El operador || proporciona un mensaje por defecto si no hay mensaje de error
      alert('Error en el servidor al procesar el pedido: ' + (err.response?.data?.error || err.message));
    } finally {
      // El bloque finally siempre se ejecuta, haya error o no
      // Restaura el estado de loading a false para rehabilitar el botón
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-very-dark)]">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-pale)]">Mi Carrito</h2>

        {/* El operador ternario ? : muestra un mensaje si el carrito está vacío */}
        {items.length === 0 ? (
          <p className="text-center text-[var(--color-pale)]">Tu carrito está vacío</p>
        ) : (
          <div className="space-y-4">
            {/* Sección de datos de envío y pago */}
            <div className="bg-[var(--color-navy)] p-4 rounded text-[var(--color-pale)]">
              {/* SELECT DE PROVINCIA - Sin mostrar el precio */}
              <label className="block mb-2 font-semibold">Provincia:</label>
              <select 
                value={selectedProvincia ?? ''} 
                onChange={(e) => setSelectedProvincia(parseInt(e.target.value))} 
                className="w-full p-2 rounded bg-[var(--color-pale)] text-[var(--color-very-dark)] mb-4"
              >
                {/* El map itera sobre cada provincia y crea un option element */}
                {/* Ya NO se muestra el costo_envio en el option */}
                {provincias.map(p => (
                  <option key={p.cod_provincia} value={p.cod_provincia}>
                    {p.descripcion}
                  </option>
                ))}
              </select>

              {/* SELECT DE LOCALIDAD - Solo se muestra si hay localidades disponibles */}
              {localidades.length > 0 && (
                <>
                  <label className="block mb-2 font-semibold">Localidad:</label>
                  <select 
                    value={selectedLocalidad ?? ''} 
                    onChange={(e) => setSelectedLocalidad(parseInt(e.target.value))} 
                    className="w-full p-2 rounded bg-[var(--color-pale)] text-[var(--color-very-dark)] mb-4"
                  >
                    {/* El map itera sobre cada localidad filtrada y crea un option element */}
                    {localidades.map(l => (
                      <option key={l.id_localidad} value={l.id_localidad}>
                        {l.nombre} (CP: {l.codigo_postal})
                      </option>
                    ))}
                  </select>
                </>
              )}

              {/* Mensaje si no hay localidades para la provincia seleccionada */}
              {selectedProvincia && localidades.length === 0 && (
                <p className="text-yellow-400 mb-4">No hay localidades disponibles para esta provincia</p>
              )}

              {/* CAMPO DE DIRECCIÓN - Nuevo input para capturar la dirección de entrega */}
              <label className="block mb-2 font-semibold">Dirección de entrega:</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej: Calle Falsa 123, Piso 4, Depto B"
                className="w-full p-2 rounded bg-[var(--color-pale)] text-[var(--color-very-dark)] mb-4"
                maxLength={200}
              />
              {/* Mensaje de ayuda debajo del campo de dirección */}
              <p className="text-xs text-gray-400 mb-4">Ingresa tu calle, número, piso y departamento</p>

              {/* SELECT DE MÉTODO DE PAGO */}
              <label className="block mb-2 font-semibold">Método de pago:</label>
              <select 
                value={selectedMetodo ?? ''} 
                onChange={(e) => setSelectedMetodo(parseInt(e.target.value))} 
                className="w-full p-2 rounded bg-[var(--color-pale)] text-[var(--color-very-dark)]"
              >
                {/* El map itera sobre cada método de pago y crea un option element */}
                {metodos.map(m => (
                  <option key={m.id_metodo} value={m.id_metodo}>
                    {m.desc_metodo}
                  </option>
                ))}
              </select>

              {/* Muestra el costo de envío de la provincia seleccionada */}
              <div className="mt-3 text-sm">Costo de envío: <strong>${costoEnvio}</strong></div>
            </div>

            {/* Lista de productos en el carrito */}
            <div className="space-y-4">
              {/* El map itera sobre cada producto y crea un card para cada uno */}
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
                    {/* Input para cambiar la cantidad del producto */}
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
                    {/* Botón para eliminar el producto del carrito */}
                    <button
                      onClick={() => handleEliminar(producto.id_articulo)}
                      className="text-[var(--color-sky)] hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {/* Muestra el total incluyendo el costo de envío */}
              <div className="text-right font-bold text-lg text-[var(--color-pale)]">
                Total: ${total + costoEnvio}
              </div>

              {/* Botón principal para procesar la compra */}
              {/* El disabled se activa si está cargando, no hay localidad o no hay dirección */}
              <button
                onClick={handleCheckout}
                disabled={loading || !selectedLocalidad || !direccion.trim()}
                className="w-full py-2 bg-[var(--color-sky)] text-[var(--color-very-dark)] rounded hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
              >
                {/* El operador ternario cambia el texto del botón según el estado */}
                {loading ? 'Procesando...' : 'Continuar compra'}
              </button>
              
              {/* Mensaje de ayuda si falta algún dato */}
              {(!selectedLocalidad || !direccion.trim()) && (
                <p className="text-sm text-yellow-400 text-center mt-2">
                  {!selectedLocalidad && 'Selecciona una localidad'}
                  {!selectedLocalidad && !direccion.trim() && ' y '}
                  {!direccion.trim() && 'completa tu dirección'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;