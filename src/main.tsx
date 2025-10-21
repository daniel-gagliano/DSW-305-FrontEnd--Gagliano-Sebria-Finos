import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // ← AGREGAR
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import GestionGeneral from "./pages/GestionGeneral"; // ← AGREGAR
import { CartProvider } from "./store/cartContext";
import HistorialPedidos from "./pages/HistorialPedidos";
import { AuthProvider } from "./store/authContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <div className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Ruta protegida solo para CLIENTES */}
              <Route 
                path="/historial-pedidos" 
                element={
                  <ProtectedRoute requiredRole="CLIENTE">
                    <HistorialPedidos />
                  </ProtectedRoute>
                } 
              />
              
              {/* Ruta protegida solo para ADMIN */}
              <Route 
                path="/gestion-general" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <GestionGeneral />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);