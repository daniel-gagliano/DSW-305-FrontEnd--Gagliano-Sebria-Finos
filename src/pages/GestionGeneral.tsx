import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, MapPin, DollarSign, CreditCard, Map, Package } from 'lucide-react';

// Tipos
interface Articulo {
  id_articulo: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  ar_ca?: { categoria: Categoria }[];
}

interface Categoria {
  id_categoria: number;
  nom_categoria: string;
  desc_categoria: string;
}

interface Localidad {
  id_localidad: number;
  nombre: string;
  codigo_postal: string;
  cod_provincia: number;
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

type Section = 'articulos' | 'categorias' | 'localidades' | 'provincias' | 'descuentos' | 'metodos';

const API_URL = 'http://localhost:3000';

const GestionGeneral: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('articulos');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para cada entidad
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, [activeSection]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeSection === 'articulos') {
        await fetchArticulos();
        await fetchCategorias();
      } else if (activeSection === 'categorias') {
        await fetchCategorias();
      } else if (activeSection === 'localidades') {
        await fetchLocalidades();
        await fetchProvincias();
      } else if (activeSection === 'provincias') {
        await fetchProvincias();
      } else if (activeSection === 'descuentos') {
        await fetchDescuentos();
      } else if (activeSection === 'metodos') {
        await fetchMetodosPago();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchArticulos = async () => {
    const response = await fetch(`${API_URL}/articulos`);
    const data = await response.json();
    setArticulos(data);
  };

  const fetchCategorias = async () => {
    const response = await fetch(`${API_URL}/categorias`);
    const data = await response.json();
    setCategorias(data);
  };

  const fetchLocalidades = async () => {
    const response = await fetch(`${API_URL}/localidades`);
    const data = await response.json();
    setLocalidades(data);
  };

  const fetchProvincias = async () => {
    const response = await fetch(`${API_URL}/provincias`);
    const data = await response.json();
    setProvincias(data);
  };

  const fetchDescuentos = async () => {
    const response = await fetch(`${API_URL}/descuentos`);
    const data = await response.json();
    setDescuentos(data);
  };

  const fetchMetodosPago = async () => {
    const response = await fetch(`${API_URL}/metodos`);
    const data = await response.json();
    setMetodosPago(data);
  };

  const openModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      if (activeSection === 'articulos') {
        setFormData({
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          stock: item.stock,
          categorias: item.ar_ca?.map((ac: any) => ac.categoria.id_categoria) || []
        });
      } else {
        setFormData({ ...item });
      }
    } else {
      setEditingItem(null);
      setFormData(getEmptyForm());
    }
    setShowModal(true);
  };

  const getEmptyForm = () => {
    if (activeSection === 'articulos') {
      return { nombre: '', descripcion: '', precio: '', stock: '', categorias: [] };
    } else if (activeSection === 'categorias') {
      return { nom_categoria: '', desc_categoria: '' };
    } else if (activeSection === 'localidades') {
      return { nombre: '', codigo_postal: '', cod_provincia: '' };
    } else if (activeSection === 'provincias') {
      return { descripcion: '', costo_envio: '' };
    } else if (activeSection === 'descuentos') {
      return { desc_descuento: '' };
    } else if (activeSection === 'metodos') {
      return { desc_metodo: '' };
    }
    return {};
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
      let dataToSend = { ...formData };

      // Convertir tipos según la sección
      if (activeSection === 'articulos') {
        dataToSend.precio = parseFloat(dataToSend.precio);
        dataToSend.stock = parseInt(dataToSend.stock);
      } else if (activeSection === 'provincias') {
        dataToSend.costo_envio = parseFloat(dataToSend.costo_envio);
      } else if (activeSection === 'localidades') {
        dataToSend.cod_provincia = parseInt(dataToSend.cod_provincia);
      }

      if (editingItem) {
        await fetch(`${API_URL}${endpoint}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
        alert('Actualizado correctamente');
      } else {
        await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
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
    if (!confirm('¿Eliminar este registro?')) return;

    setLoading(true);
    try {
      const endpoint = getEndpoint();
      const id = getItemId(item);
      await fetch(`${API_URL}${endpoint}/${id}`, { method: 'DELETE' });
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
    if (activeSection === 'articulos') return '/articulos';
    if (activeSection === 'categorias') return '/categorias';
    if (activeSection === 'localidades') return '/localidades';
    if (activeSection === 'provincias') return '/provincias';
    if (activeSection === 'descuentos') return '/descuentos';
    if (activeSection === 'metodos') return '/metodos';
    return '';
  };

  const getItemId = (item: any) => {
    if (!item) return null;
    if (activeSection === 'articulos') return item.id_articulo;
    if (activeSection === 'categorias') return item.id_categoria;
    if (activeSection === 'localidades') return item.id_localidad;
    if (activeSection === 'provincias') return item.cod_provincia;
    if (activeSection === 'descuentos') return item.cod_descuento;
    if (activeSection === 'metodos') return item.id_metodo;
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (id: number) => {
    const categorias = formData.categorias || [];
    if (categorias.includes(id)) {
      setFormData({ ...formData, categorias: categorias.filter((c: number) => c !== id) });
    } else {
      setFormData({ ...formData, categorias: [...categorias, id] });
    }
  };

  const getCurrentData = () => {
    if (activeSection === 'articulos') return articulos;
    if (activeSection === 'categorias') return categorias;
    if (activeSection === 'localidades') return localidades;
    if (activeSection === 'provincias') return provincias;
    if (activeSection === 'descuentos') return descuentos;
    if (activeSection === 'metodos') return metodosPago;
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión Administrativa</h1>
          <p className="text-gray-600">Panel de administración completo</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap border-b border-gray-200">
            <button
              onClick={() => setActiveSection('articulos')}
              className={`flex items-center gap-2 px-4 py-3 font-medium ${
                activeSection === 'articulos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              <Package size={18} />
              Artículos
            </button>
            <button
              onClick={() => setActiveSection('categorias')}
              className={`flex items-center gap-2 px-4 py-3 font-medium ${
                activeSection === 'categorias' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              <Package size={18} />
              Categorías
            </button>
            <button
              onClick={() => setActiveSection('localidades')}
              className={`flex items-center gap-2 px-4 py-3 font-medium ${
                activeSection === 'localidades' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              <MapPin size={18} />
              Localidades
            </button>
            <button
              onClick={() => setActiveSection('provincias')}
              className={`flex items-center gap-2 px-4 py-3 font-medium ${
                activeSection === 'provincias' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              <Map size={18} />
              Provincias
            </button>
            <button
              onClick={() => setActiveSection('descuentos')}
              className={`flex items-center gap-2 px-4 py-3 font-medium ${
                activeSection === 'descuentos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              <DollarSign size={18} />
              Descuentos
            </button>
            <button
              onClick={() => setActiveSection('metodos')}
              className={`flex items-center gap-2 px-4 py-3 font-medium ${
                activeSection === 'metodos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              <CreditCard size={18} />
              Métodos de Pago
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {activeSection === 'articulos' && 'Listado de Artículos'}
              {activeSection === 'categorias' && 'Listado de Categorías'}
              {activeSection === 'localidades' && 'Listado de Localidades'}
              {activeSection === 'provincias' && 'Listado de Provincias'}
              {activeSection === 'descuentos' && 'Listado de Descuentos'}
              {activeSection === 'metodos' && 'Listado de Métodos de Pago'}
            </h2>
            <button
              onClick={() => openModal()}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
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
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                    {activeSection === 'articulos' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Precio</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Stock</th>
                      </>
                    )}
                    {activeSection === 'categorias' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Descripción</th>
                      </>
                    )}
                    {activeSection === 'localidades' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Código Postal</th>
                      </>
                    )}
                    {activeSection === 'provincias' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Costo Envío</th>
                      </>
                    )}
                    {(activeSection === 'descuentos' || activeSection === 'metodos') && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Descripción</th>
                    )}
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {activeSection === 'articulos' && articulos.map((item) => (
                    <tr key={item.id_articulo} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{item.id_articulo}</td>
                      <td className="px-4 py-3 font-medium">{item.nombre}</td>
                      <td className="px-4 py-3">${item.precio}</td>
                      <td className="px-4 py-3">{item.stock}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeSection === 'categorias' && categorias.map((item) => (
                    <tr key={item.id_categoria} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{item.id_categoria}</td>
                      <td className="px-4 py-3 font-medium">{item.nom_categoria}</td>
                      <td className="px-4 py-3">{item.desc_categoria}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeSection === 'localidades' && localidades.map((item) => (
                    <tr key={item.id_localidad} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{item.id_localidad}</td>
                      <td className="px-4 py-3 font-medium">{item.nombre}</td>
                      <td className="px-4 py-3">{item.codigo_postal}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeSection === 'provincias' && provincias.map((item) => (
                    <tr key={item.cod_provincia} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{item.cod_provincia}</td>
                      <td className="px-4 py-3 font-medium">{item.descripcion}</td>
                      <td className="px-4 py-3">${item.costo_envio}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeSection === 'descuentos' && descuentos.map((item) => (
                    <tr key={item.cod_descuento} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{item.cod_descuento}</td>
                      <td className="px-4 py-3 font-medium">{item.desc_descuento}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeSection === 'metodos' && metodosPago.map((item) => (
                    <tr key={item.id_metodo} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{item.id_metodo}</td>
                      <td className="px-4 py-3 font-medium">{item.desc_metodo}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
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
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingItem ? 'Editar' : 'Agregar'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {activeSection === 'articulos' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Descripción *</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion || ''}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Precio *</label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio || ''}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Categorías *</label>
                    <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                      {categorias.map(cat => (
                        <label key={cat.id_categoria} className="flex items-center gap-2 p-2 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={formData.categorias?.includes(cat.id_categoria) || false}
                            onChange={() => handleCategoryToggle(cat.id_categoria)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{cat.nom_categoria}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'categorias' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <input
                      type="text"
                      name="nom_categoria"
                      value={formData.nom_categoria || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Descripción *</label>
                    <textarea
                      name="desc_categoria"
                      value={formData.desc_categoria || ''}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}

              {activeSection === 'localidades' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Código Postal *</label>
                    <input
                      type="text"
                      name="codigo_postal"
                      value={formData.codigo_postal || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Provincia *</label>
                    <select
                      name="cod_provincia"
                      value={formData.cod_provincia || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Selecciona</option>
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
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <input
                      type="text"
                      name="descripcion"
                      value={formData.descripcion || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Costo Envío *</label>
                    <input
                      type="number"
                      name="costo_envio"
                      value={formData.costo_envio || ''}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}

              {activeSection === 'descuentos' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Descripción *</label>
                  <input
                    type="text"
                    name="desc_descuento"
                    value={formData.desc_descuento || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              )}

              {activeSection === 'metodos' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Descripción *</label>
                  <input
                    type="text"
                    name="desc_metodo"
                    value={formData.desc_metodo || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-2 border rounded-lg hover:bg-gray-50"
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