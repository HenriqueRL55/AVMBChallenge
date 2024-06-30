import React from "react";
import {
  FormContainer,
  Input,
  CreateButton,
} from "./repositoryCreation.styles";

const RepositoryCreation = ({ createRepository, setNewRepositoryName }) => {
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
