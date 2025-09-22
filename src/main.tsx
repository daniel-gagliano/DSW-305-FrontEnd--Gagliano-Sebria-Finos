import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login.tsx";
import Cart from "./pages/Cart.tsx";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* 👈 agregar ruta */}
        <Route path="/cart" element={<Cart />} />

        

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
