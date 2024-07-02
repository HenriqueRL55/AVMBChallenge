// React Hooks
import React, { useState } from "react";

// React Router Dom
import { useNavigate } from "react-router-dom";

// Autenticação
import { useAuth } from "../../services/auth";

// Material UI
import { Button, TextField, Typography } from "@mui/material";

// Estilização
import { RegisterContainer, FormBox } from "./register.styles";

// Componente de página de registro
export const RegisterPage = () => {
  const { signUp } = useAuth(); 
  const navigate = useNavigate(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 

  // Função para registrar um novo usuário
  const handleRegister = async () => {
    try {
      await signUp(email, password);
      navigate("/home"); // Navega para a página inicial após o registro
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RegisterContainer maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Registrar
      </Typography>
      <FormBox>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
        >
          Registrar-se
        </Button>
      </FormBox>
    </RegisterContainer>
  );
};

export default RegisterPage;
