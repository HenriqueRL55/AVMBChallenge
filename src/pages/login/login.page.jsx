// React Hooks
import React, { useState, useEffect } from "react";

// React Router Dom
import { useNavigate } from "react-router-dom";

// Autenticação
import { useAuth } from "../../services/auth";

// Material UI
import { Button, TextField } from "@mui/material";

// Estilização
import { LoginContainer, FormBox, StyledTypography } from "./login.styles";

// Componente de página de login
export const LoginPage = () => {
  const { signIn, signInWithGoogle, currentUser } = useAuth(); 
  const navigate = useNavigate(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");

  // Efeito que redireciona para a página inicial se o usuário estiver autenticado
  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  // Função para navegar para a página de registro
  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <LoginContainer>
      <StyledTypography variant="h4" component="h4" gutterBottom>
        Login
      </StyledTypography>
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
          onClick={() => signIn(email, password)}
        >
          Entrar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={signInWithGoogle}
        >
          Entrar com Google
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={goToRegister}
        >
          Registrar-se
        </Button>
      </FormBox>
    </LoginContainer>
  );
};
