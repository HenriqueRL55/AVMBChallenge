import React from "react";
import { CreateButton, FormContainer, Input } from "./documentQuery.styles";

const DocumentQuery = ({ setSearchTerm, handleSearch }) => {
  return (
    <FormContainer>
      <Input
        label="Nome do Envelope"
        variant="outlined"
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />
      <CreateButton variant="contained" onClick={handleSearch}>
        Consultar
      </CreateButton>
    </FormContainer>
  );
};

export default DocumentQuery;
