import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { Button, TextField } from "@mui/material";
import { LoginContainer, FormBox, StyledTypography } from "./login.styles";

export const LoginPage = () => {
  const { signIn, signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

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
