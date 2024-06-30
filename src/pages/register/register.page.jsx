import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { Button, TextField, Typography } from "@mui/material";
import { RegisterContainer, FormBox } from "./register.styles";

export const RegisterPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await signUp(email, password);
      navigate("/home");
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
