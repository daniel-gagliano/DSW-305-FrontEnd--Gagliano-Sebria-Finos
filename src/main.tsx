import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import GestionGeneral from "./pages/GestionGeneral";
import { CartProvider } from "./store/cartContext";
import HistorialPedidos from "./pages/HistorialPedidos";
import { AuthProvider } from "./store/authContext";
import HistorialVentas from "./pages/HistorialVentas.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <div className="pt-20">
            <Routes>
              {/* Rutas públicas (sin autenticación) */}
              <Route path="/login" element={<Login />} />
              <Route path="/productos" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas SOLO para NO autenticados o CLIENTES */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute allowedRoles={['CLIENTE', 'public']}>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/productos" 
                element={
                  <ProtectedRoute allowedRoles={['CLIENTE', 'public']}>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/product/:id" 
                element={
                  <ProtectedRoute allowedRoles={['CLIENTE', 'public']}>
                    <ProductDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute allowedRoles={['CLIENTE', 'public']}>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute allowedRoles={['CLIENTE']}>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas SOLO para CLIENTES autenticados */}
              <Route 
                path="/historial-pedidos" 
                element={
                  <ProtectedRoute allowedRoles={['CLIENTE']}>
                    <HistorialPedidos />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas SOLO para ADMIN */}
              <Route 
                path="/gestion-general" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <GestionGeneral />                    
                  </ProtectedRoute>
                } 
              />
                            <Route 
                path="/historial-ventas" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <HistorialVentas />                    
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