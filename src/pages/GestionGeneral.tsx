import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, MapPin, DollarSign, CreditCard, Map } from 'lucide-react';

// Tipos basados en tu schema de Prisma
interface Localidad {
  id_localidad: number;
  nombre: string;
  codigo_postal: string;
  cod_provincia: number;
  provincia?: Provincia;
}

interface Provincia {
  cod_provincia: number;
  descripcion: string;
  costo_envio: number;
}

interface Descuento {
  cod_descuento: number;
  desc_descuento: string;
}

interface MetodoPago {
  id_metodo: number;
  desc_metodo: string;
}

type Section = 'localidades' | 'provincias' | 'descuentos' | 'metodos';

const API_URL = 'http://localhost:3000'; // Ajusta según tu backend

const GestionGeneral: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('localidades');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para cada entidad
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  
  // Estado para edición
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, [activeSection]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeSection) {
        case 'localidades':
          await fetchLocalidades();
          await fetchProvincias(); // Necesarias para el formulario
          break;
        case 'provincias':
          await fetchProvincias();
          break;
        case 'descuentos':
          await fetchDescuentos();
          break;
        case 'metodos':
          await fetchMetodosPago();
          break;
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocalidades = async () => {
    const response = await fetch(`${API_URL}/localidades`);
    if (!response.ok) throw new Error('Error al cargar localidades');
    const data = await response.json();
    setLocalidades(data);
  };

  const fetchProvincias = async () => {
    const response = await fetch(`${API_URL}/provincias`);
    if (!response.ok) throw new Error('Error al cargar provincias');
    const data = await response.json();
    setProvincias(data);
  };

  const fetchDescuentos = async () => {
    const response = await fetch(`${API_URL}/descuentos`);
    if (!response.ok) throw new Error('Error al cargar descuentos');
    const data = await response.json();
    setDescuentos(data);
  };

  const fetchMetodosPago = async () => {
    const response = await fetch(`${API_URL}/metodos`);
    if (!response.ok) throw new Error('Error al cargar métodos de pago');
    const data = await response.json();
    setMetodosPago(data);
  };

  const openModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData(getEmptyForm());
    }
    setShowModal(true);
  };

  const getEmptyForm = () => {
    switch (activeSection) {
      case 'localidades':
        return { nombre: '', codigo_postal: '', cod_provincia: provincias[0]?.cod_provincia || '' };
      case 'provincias':
        return { descripcion: '', costo_envio: '' };
      case 'descuentos':
        return { desc_descuento: '' };
      case 'metodos':
        return { desc_metodo: '' };
      default:
        return {};
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = getEndpoint();
      const id = getItemId(editingItem);

      // Parsear números si es necesario
      let dataToSend = { ...formData };
      if (activeSection === 'provincias') {
        dataToSend.costo_envio = parseFloat(dataToSend.costo_envio);
      }
      if (activeSection === 'localidades') {
        dataToSend.cod_provincia = parseInt(dataToSend.cod_provincia);
      }

      if (editingItem) {
        // Actualizar
        const response = await fetch(`${API_URL}${endpoint}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
        if (!response.ok) throw new Error('Error al actualizar');
        alert('Actualizado correctamente');
      } else {
        // Crear
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
        if (!response.ok) throw new Error('Error al crear');
        alert('Creado correctamente');
      }

      await loadData();
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    setLoading(true);
    try {
      const endpoint = getEndpoint();
      const id = getItemId(item);

      const response = await fetch(`${API_URL}${endpoint}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar');
      
      alert('Eliminado correctamente');
      await loadData();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const getEndpoint = () => {
    switch (activeSection) {
      case 'localidades': return '/localidades';
      case 'provincias': return '/provincias';
      case 'descuentos': return '/descuentos';
      case 'metodos': return '/metodos';
      default: return '';
    }
  };

  const getItemId = (item: any) => {
    if (!item) return null;
    switch (activeSection) {
      case 'localidades': return item.id_localidad;
      case 'provincias': return item.cod_provincia;
      case 'descuentos': return item.cod_descuento;
      case 'metodos': return item.id_metodo;
      default: return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const getCurrentData = () => {
    switch (activeSection) {
      case 'localidades': return localidades;
      case 'provincias': return provincias;
      case 'descuentos': return descuentos;
      case 'metodos': return metodosPago;
      default: return [];
    }
  };

  const getProvinciaNombre = (cod_provincia: number) => {
    return provincias.find(p => p.cod_provincia === cod_provincia)?.descripcion || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión General</h1>
          <p className="text-gray-600">Administra localidades, provincias, descuentos y métodos de pago</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveSection('localidades')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeSection === 'localidades'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin size={20} />
              Localidades
            </button>
            <button
              onClick={() => setActiveSection('provincias')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeSection === 'provincias'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map size={20} />
              Provincias
            </button>
            <button
              onClick={() => setActiveSection('descuentos')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeSection === 'descuentos'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <DollarSign size={20} />
              Descuentos
            </button>
            <button
              onClick={() => setActiveSection('metodos')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeSection === 'metodos'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard size={20} />
              Métodos de Pago
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {activeSection === 'localidades' && 'Listado de Localidades'}
              {activeSection === 'provincias' && 'Listado de Provincias'}
              {activeSection === 'descuentos' && 'Listado de Descuentos'}
              {activeSection === 'metodos' && 'Listado de Métodos de Pago'}
            </h2>
            <button
              onClick={() => openModal()}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={20} />
              Agregar
            </button>
          </div>

          {loading && <p className="text-center py-8 text-gray-600">Cargando...</p>}

          {!loading && getCurrentData().length === 0 && (
            <p className="text-center py-8 text-gray-600">No hay registros</p>
          )}

          {!loading && getCurrentData().length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {activeSection === 'localidades' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Localidad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Código Postal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Provincia</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Acciones</th>
                      </>
                    )}
                    {activeSection === 'provincias' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Código</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Provincia</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Costo Envío</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Acciones</th>
                      </>
                    )}
                    {activeSection === 'descuentos' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Código</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Descripción</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Acciones</th>
                      </>
                    )}
                    {activeSection === 'metodos' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Descripción</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Acciones</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeSection === 'localidades' && localidades.map((item) => (
                    <tr key={item.id_localidad} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{item.id_localidad}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{item.nombre}</td>
                      <td className="px-6 py-4 text-gray-900">{item.codigo_postal}</td>
                      <td className="px-6 py-4 text-gray-900">{getProvinciaNombre(item.cod_provincia)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeSection === 'provincias' && provincias.map((item) => (
                    <tr key={item.cod_provincia} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{item.cod_provincia}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{item.descripcion}</td>
                      <td className="px-6 py-4 text-gray-900">${item.costo_envio.toLocaleString('es-AR')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeSection === 'descuentos' && descuentos.map((item) => (
                    <tr key={item.cod_descuento} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{item.cod_descuento}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{item.desc_descuento}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeSection === 'metodos' && metodosPago.map((item) => (
                    <tr key={item.id_metodo} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{item.id_metodo}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{item.desc_metodo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Editar' : 'Agregar'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {activeSection === 'localidades' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Rosario"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal *</label>
                    <input
                      type="text"
                      name="codigo_postal"
                      value={formData.codigo_postal || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: 2000"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provincia *</label>
                    <select
                      name="cod_provincia"
                      value={formData.cod_provincia || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona una provincia</option>
                      {provincias.map(p => (
                        <option key={p.cod_provincia} value={p.cod_provincia}>{p.descripcion}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {activeSection === 'provincias' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Provincia *</label>
                    <input
                      type="text"
                      name="descripcion"
                      value={formData.descripcion || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Santa Fe"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Costo de Envío (ARS) *</label>
                    <input
                      type="number"
                      name="costo_envio"
                      value={formData.costo_envio || ''}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="1500"
                    />
                  </div>
                </>
              )}

              {activeSection === 'descuentos' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Descuento *</label>
                  <input
                    type="text"
                    name="desc_descuento"
                    value={formData.desc_descuento || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Descuento Black Friday 20%"
                  />
                </div>
              )}

              {activeSection === 'metodos' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Método *</label>
                  <input
                    type="text"
                    name="desc_metodo"
                    value={formData.desc_metodo || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Tarjeta de Crédito"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionGeneral;