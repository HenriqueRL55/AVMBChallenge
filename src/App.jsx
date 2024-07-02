// React
import React from "react";

// React Router Dom
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Estilos
import "./styles/App.css";

// Contexto de Autenticação
import { AuthProvider, useAuth } from "./services/auth";

// Páginas
import { LoginPage } from "./pages/login/login.page";
import { RegisterPage } from "./pages/register/register.page";
import HomePage from "./pages/home/home.page";

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Hook de autenticação

  // Se o usuário estiver autenticado, renderiza o componente filho, caso contrário, redireciona para a página de login
  return currentUser ? children : <Navigate to="/login" />;
};

// Componente principal da aplicação
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota para a página de login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rota para a página de registro */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rota protegida para a página inicial */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          
          {/* Redireciona para a página de login se a rota não for encontrada */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
