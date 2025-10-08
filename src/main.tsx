import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import { CartProvider } from "./store/cartContext";
import HistorialPedidos from "./pages/HistorialPedidos"; // <-- 1. IMPORTAR LA NUEVA PÁGINA

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        {/* Navbar siempre visible y fija */}
        <Navbar />

        {/* Añadimos padding-top para que el contenido no quede debajo del navbar fijo */}
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/historial-pedidos" element={<HistorialPedidos />} /> {/* <-- 2. AÑADIR LA NUEVA RUTA */}
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);