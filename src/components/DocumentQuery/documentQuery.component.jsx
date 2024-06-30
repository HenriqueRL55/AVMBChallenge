import React from "react";
import { Box, TextField, Button } from "@mui/material";

const DocumentQuery = ({ setSearchTerm, handleSearch }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
      <TextField
        label="Nome ou ID do Documento"
        variant="outlined"
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Consultar
      </Button>
    </Box>
  );
};

export default DocumentQuery;
