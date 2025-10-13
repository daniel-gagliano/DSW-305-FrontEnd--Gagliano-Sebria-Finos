import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

type DatosPedido = {
  nro_pedido: number;
  precio_total: number;
  metodo_pago: string;
  provincia: string;
  items: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
};

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const datosPedido = location.state as DatosPedido;
  
  const [estado, setEstado] = useState<'pendiente' | 'procesando' | 'confirmado'>('pendiente');
  const [tiempoRestante, setTiempoRestante] = useState(300); // 5 minutos

  // Si no hay datos del pedido, redirigir al carrito
  useEffect(() => {
    if (!datosPedido) {
      navigate('/cart');
    }
  }, [datosPedido, navigate]);

  // Contador regresivo
  useEffect(() => {
    if (estado === 'pendiente' && tiempoRestante > 0) {
      const timer = setTimeout(() => setTiempoRestante(tiempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [tiempoRestante, estado]);

  // Simular pago después de 3 segundos cuando se confirma
  const simularPago = () => {
    setEstado('procesando');
    setTimeout(() => {
      setEstado('confirmado');
    }, 3000);
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Datos para el QR (simulación de datos de pago)
  const datosQR = JSON.stringify({
    pedido: datosPedido?.nro_pedido,
    monto: datosPedido?.precio_total,
    merchant: 'TuTienda',
    timestamp: new Date().toISOString()
  });

  if (!datosPedido) return null;

  return (
    <div className="min-h-screen bg-[var(--color-very-dark)] py-8">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-pale)] mb-2">
            {estado === 'confirmado' ? '¡Pago Confirmado!' : 'Finalizar Compra'}
          </h1>
          {estado === 'pendiente' && (
            <p className="text-[var(--color-sky)]">
              Tiempo restante: {formatearTiempo(tiempoRestante)}
            </p>
          )}
        </div>

        {/* Contenido según estado */}
        {estado === 'confirmado' ? (
          <div className="bg-[var(--color-navy)] rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-[var(--color-pale)] mb-4">
              ¡Pedido Confirmado!
            </h2>
            <p className="text-[var(--color-pale)] mb-2">
              Número de pedido: <strong>#{datosPedido.nro_pedido}</strong>
            </p>
            <p className="text-[var(--color-pale)] mb-6">
              ¡Gracias por tu compra!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[var(--color-sky)] text-[var(--color-very-dark)] rounded-lg hover:opacity-90 transition"
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <>
            {/* Resumen del pedido */}
            <div className="bg-[var(--color-navy)] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-[var(--color-pale)] mb-4">
                Resumen del pedido
              </h2>
              
              <div className="space-y-2 mb-4">
                {datosPedido.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[var(--color-pale)]">
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span>${item.precio * item.cantidad}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--color-pale)]/20 pt-4 space-y-2">
                <div className="flex justify-between text-[var(--color-pale)]">
                  <span>Provincia:</span>
                  <span>{datosPedido.provincia}</span>
                </div>
                <div className="flex justify-between text-[var(--color-pale)]">
                  <span>Método de pago:</span>
                  <span>{datosPedido.metodo_pago}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[var(--color-pale)] mt-4">
                  <span>Total:</span>
                  <span>${datosPedido.precio_total}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-[var(--color-navy)] rounded-lg p-8">
              <h2 className="text-xl font-bold text-[var(--color-pale)] text-center mb-6">
                {estado === 'procesando' ? 'Procesando pago...' : 'Escanea el código QR para pagar'}
              </h2>
              
              <div className="flex justify-center mb-6">
                {estado === 'procesando' ? (
                  <div className="w-64 h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--color-sky)]"></div>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG 
                      value={datosQR} 
                      size={256}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                )}
              </div>

              {estado === 'pendiente' && (
                <>
                  <p className="text-center text-[var(--color-pale)] mb-6">
                    Abre tu app de pagos y escanea este código
                  </p>
                  
                  <button
                    onClick={simularPago}
                    className="w-full py-3 bg-[var(--color-sky)] text-[var(--color-very-dark)] rounded-lg hover:opacity-90 transition font-semibold"
                  >
                    Simular Pago
                  </button>
                  
                  <button
                    onClick={() => navigate('/cart')}
                    className="w-full mt-3 py-3 bg-transparent border border-[var(--color-pale)] text-[var(--color-pale)] rounded-lg hover:bg-[var(--color-pale)]/10 transition"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;