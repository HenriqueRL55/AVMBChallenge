import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./styles/App.css";
import { AuthProvider, useAuth } from "./services/auth";
import { LoginPage } from "./pages/login/login.page";
import { HomePage } from "./pages/home/home.page";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
