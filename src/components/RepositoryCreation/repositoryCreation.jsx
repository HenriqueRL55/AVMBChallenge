import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from '@mui/system';

const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "16px",
  maxWidth: "600px",
  margin: "20px auto",
  alignItems: "center",
});

const Input = styled(TextField)({
  flex: 1,
});

const CreateButton = styled(Button)({
  flexShrink: 0,
});

const RepositoryCreation = ({
  createRepository,
  setNewRepositoryName,
}) => {
  return (
    <FormContainer>
      <Input
        label="Nome do Repositório"
        variant="outlined"
        onChange={(e) => setNewRepositoryName(e.target.value)}
      />
      <CreateButton
        variant="contained"
        color="primary"
        onClick={createRepository}
      >
        Criar Repositório
      </CreateButton>
    </FormContainer>
  );
};

export default RepositoryCreation;
