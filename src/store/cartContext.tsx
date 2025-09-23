import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id_articulo: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id_articulo: number) => void;
  updateItem: (id_articulo: number, cantidad: number) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const found = prev.find(p => p.id_articulo === item.id_articulo);
      if (found) {
        return prev.map(p => p.id_articulo === item.id_articulo ? { ...p, cantidad: p.cantidad + item.cantidad } : p);
      }
      return [...prev, item];
    });
  };

  const removeItem = (id_articulo: number) => {
    setItems(prev => prev.filter(p => p.id_articulo !== id_articulo));
  };

  const updateItem = (id_articulo: number, cantidad: number) => {
    setItems(prev => prev.map(p => p.id_articulo === id_articulo ? { ...p, cantidad } : p));
  };

  const clear = () => setItems([]);

  const total = items.reduce((s, it) => s + it.precio * it.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItem, clear, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
