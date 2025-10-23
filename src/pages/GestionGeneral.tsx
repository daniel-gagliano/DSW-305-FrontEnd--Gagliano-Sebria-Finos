import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, MapPin, DollarSign, CreditCard, Map, Package } from 'lucide-react';

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

  const renderTableRows = () => {
    const data = getCurrentData();
    
    return data.map((item: any) => {
      let id, cells;
      
      if (activeSection === 'articulos') {
        id = item.id_articulo;
        cells = (
          <>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>{item.id_articulo}</td>
            <td className="px-4 py-3 font-medium" style={{ color: '#c7d5e0' }}>{item.nombre}</td>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>${item.precio}</td>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>{item.stock}</td>
          </>
        );
      } else if (activeSection === 'categorias') {
        id = item.id_categoria;
        cells = (
          <>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>{item.id_categoria}</td>
            <td className="px-4 py-3 font-medium" style={{ color: '#c7d5e0' }}>{item.nom_categoria}</td>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>{item.desc_categoria}</td>
          </>
        );
      } else if (activeSection === 'localidades') {
        id = item.id_localidad;
        cells = (
          <>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>{item.id_localidad}</td>
            <td className="px-4 py-3 font-medium" style={{ color: '#c7d5e0' }}>{item.nombre}</td>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>{item.codigo_postal}</td>
          </>
        );
      } else if (activeSection === 'provincias') {
        id = item.cod_provincia;
        cells = (
          <>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>{item.cod_provincia}</td>
            <td className="px-4 py-3 font-medium" style={{ color: '#c7d5e0' }}>{item.descripcion}</td>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>${item.costo_envio}</td>
          </>
        );
      } else if (activeSection === 'descuentos') {
        id = item.cod_descuento;
        cells = (
          <>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>{item.cod_descuento}</td>
            <td className="px-4 py-3 font-medium" style={{ color: '#c7d5e0' }}>{item.desc_descuento}</td>
          </>
        );
      } else {
        id = item.id_metodo;
        cells = (
          <>
            <td className="px-4 py-3" style={{ color: '#c7d5e0' }}>{item.id_metodo}</td>
            <td className="px-4 py-3 font-medium" style={{ color: '#c7d5e0' }}>{item.desc_metodo}</td>
          </>
        );
      }

      return (
        <tr key={id} className="transition-colors" style={{ borderBottom: '1px solid #2a475e' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#243447'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {cells}
          <td className="px-4 py-3">
            <div className="flex justify-end gap-2">
              <button onClick={() => openModal(item)} className="p-2 rounded transition-colors" style={{ color: '#66c0f4' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a475e'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(item)} className="p-2 rounded transition-colors" style={{ color: '#ff6b6b' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a475e'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#171a21' }}>
      <div className="max-w-7xl mx-auto">
        <div className="rounded-lg shadow-lg p-6 mb-6" style={{ backgroundColor: '#1b2838' }}>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#c7d5e0' }}>Gestión Administrativa</h1>
          <p style={{ color: '#8f98a0' }}>Panel de administración completo</p>
        </div>

        <div className="rounded-lg shadow-lg mb-6" style={{ backgroundColor: '#1b2838' }}>
          <div className="flex flex-wrap" style={{ borderBottom: '1px solid #2a475e' }}>
            {[
              { key: 'articulos', label: 'Artículos', icon: Package },
              { key: 'categorias', label: 'Categorías', icon: Package },
              { key: 'localidades', label: 'Localidades', icon: MapPin },
              { key: 'provincias', label: 'Provincias', icon: Map },
              { key: 'descuentos', label: 'Descuentos', icon: DollarSign },
              { key: 'metodos', label: 'Métodos de Pago', icon: CreditCard }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as Section)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                  activeSection === key ? 'border-b-2' : ''
                }`}
                style={{
                  borderColor: activeSection === key ? '#66c0f4' : 'transparent',
                  color: activeSection === key ? '#66c0f4' : '#8f98a0',
                  backgroundColor: 'transparent'
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: '#1b2838' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#c7d5e0' }}>
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
              className="px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
              style={{ backgroundColor: '#66c0f4', color: '#171a21' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#5ab3e8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#66c0f4'; }}
            >
              <Plus size={20} />
              Agregar
            </button>
          </div>

          {loading && <p className="text-center py-8" style={{ color: '#8f98a0' }}>Cargando...</p>}
          {!loading && getCurrentData().length === 0 && <p className="text-center py-8" style={{ color: '#8f98a0' }}>No hay registros</p>}

          {!loading && getCurrentData().length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#2a475e', borderBottom: '1px solid #3a5771' }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>ID</th>
                    {activeSection === 'articulos' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Precio</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Stock</th>
                      </>
                    )}
                    {activeSection === 'categorias' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Descripción</th>
                      </>
                    )}
                    {activeSection === 'localidades' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Código Postal</th>
                      </>
                    )}
                    {activeSection === 'provincias' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Costo Envío</th>
                      </>
                    )}
                    {(activeSection === 'descuentos' || activeSection === 'metodos') && (
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Descripción</th>
                    )}
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase" style={{ color: '#8f98a0' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody style={{ borderColor: '#2a475e' }}>
                  {renderTableRows()}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
          <div className="rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1b2838' }}>
            <div className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid #2a475e' }}>
              <h2 className="text-xl font-bold" style={{ color: '#c7d5e0' }}>{editingItem ? 'Editar' : 'Agregar'}</h2>
              <button onClick={closeModal} className="p-2 rounded transition-colors" style={{ color: '#8f98a0' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a475e'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {activeSection === 'articulos' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Nombre *</label>
                    <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleInputChange} required
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Descripción *</label>
                    <textarea name="descripcion" value={formData.descripcion || ''} onChange={handleInputChange} required rows={3}
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Precio *</label>
                    <input type="number" name="precio" value={formData.precio || ''} onChange={handleInputChange} required step="0.01"
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Stock *</label>
                    <input type="number" name="stock" value={formData.stock || ''} onChange={handleInputChange} required
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Categorías *</label>
                    <div className="rounded-lg p-3 max-h-40 overflow-y-auto" style={{ border: '1px solid #3a5771', backgroundColor: '#2a475e' }}>
                      {categorias.map(cat => (
                        <label key={cat.id_categoria} className="flex items-center gap-2 p-2 rounded transition-colors cursor-pointer"
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1b2838'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <input type="checkbox" checked={formData.categorias?.includes(cat.id_categoria) || false}
                            onChange={() => handleCategoryToggle(cat.id_categoria)} className="w-4 h-4"
                          />
                          <span className="text-sm" style={{ color: '#c7d5e0' }}>{cat.nom_categoria}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'categorias' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Nombre *</label>
                    <input type="text" name="nom_categoria" value={formData.nom_categoria || ''} onChange={handleInputChange} required
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Descripción *</label>
                    <textarea name="desc_categoria" value={formData.desc_categoria || ''} onChange={handleInputChange} required rows={3}
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                    />
                  </div>
                </>
              )}

              {activeSection === 'localidades' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Nombre *</label>
                    <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleInputChange} required
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Código Postal *</label>
                    <input type="text" name="codigo_postal" value={formData.codigo_postal || ''} onChange={handleInputChange} required
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Provincia *</label>
                    <select name="cod_provincia" value={formData.cod_provincia || ''} onChange={handleInputChange} required
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
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
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Nombre *</label>
                    <input type="text" name="descripcion" value={formData.descripcion || ''} onChange={handleInputChange} required
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Costo Envío *</label>
                    <input type="number" name="costo_envio" value={formData.costo_envio || ''} onChange={handleInputChange} required step="0.01"
                      className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                    />
                  </div>
                </>
              )}

              {activeSection === 'descuentos' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Descripción *</label>
                  <input type="text" name="desc_descuento" value={formData.desc_descuento || ''} onChange={handleInputChange} required
                    className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                  />
                </div>
              )}

              {activeSection === 'metodos' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#c7d5e0' }}>Descripción *</label>
                  <input type="text" name="desc_metodo" value={formData.desc_metodo || ''} onChange={handleInputChange} required
                    className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: '#2a475e', color: '#c7d5e0', border: '1px solid #3a5771' }}
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={closeModal}
                  className="flex-1 px-6 py-2 rounded-lg transition-colors"
                  style={{ border: '1px solid #3a5771', color: '#c7d5e0', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a475e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Cancelar
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 px-6 py-2 rounded-lg disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: '#66c0f4', color: '#171a21' }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#5ab3e8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#66c0f4'; }}
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