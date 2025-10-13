import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout"; // <-- AGREGAR ESTA LÍNEA
import { CartProvider } from "./store/cartContext";
import HistorialPedidos from "./pages/HistorialPedidos";
import { AuthProvider } from "./store/authContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* AGREGAR */}
        <CartProvider>
          <Navbar />
          <div className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} /> {/* <-- AGREGAR ESTA RUTA */}
              <Route path="/historial-pedidos" element={<HistorialPedidos />} />
            </Routes>
          </div>

        </CartProvider>
      </AuthProvider> {/* AGREGAR */}
    </BrowserRouter>
  </React.StrictMode>

);