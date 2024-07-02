// React
import React from "react";

// Estilização
import { CreateButton, FormContainer, Input } from "./documentQuery.styles";

// Componente para consulta de documentos
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
