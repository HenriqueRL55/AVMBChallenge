// React
import React from "react";

// React DOM
import ReactDOM from "react-dom/client";

// Componente principal da aplicação
import App from "./App.jsx";

// Estilos globais
import "./styles/index.css";

// Renderiza a aplicação React na raiz do documento HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
