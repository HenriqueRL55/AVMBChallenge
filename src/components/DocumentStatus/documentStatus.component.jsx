import React from "react";
import {
  Box,
  Button,
  Modal,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { StyledTypography as Typography } from "./documentStatus.styles";
import { getStatusDescription } from "../../hooks/useDocuments";

const DocumentStatus = ({ isModalOpen, closeModal, documentInfo, loading, message }) => {
  return (
    <>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      <Modal open={isModalOpen} onClose={closeModal}>
      <Box
        sx={{
          width: { xs: "90%", sm: "80%", md: "60%", lg: "40%" },
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "background.paper",
          m: "auto",
          mt: { xs: "20%", sm: "15%", md: "10%", lg: "5%" },
          borderRadius: 2,
          boxShadow: 24,
        }}
        >
          {documentInfo ? (
            <Box>
              <Typography variant="h6">Informações do Documento</Typography>
              <Typography>ID: {documentInfo.id}</Typography>
              <Typography>Nome: {documentInfo.descricao}</Typography>
              <Typography>Status: {getStatusDescription(documentInfo.status)}</Typography>
              <Typography>Número de Páginas: {documentInfo.numeroPaginas}</Typography>
              <Button onClick={closeModal} variant="contained" sx={{ mt: 2 }}>
                Fechar
              </Button>
            </Box>
          ) : (
            <Typography>Carregando...</Typography>
          )}
        </Box>
      </Modal>
      {message && (
        <Snackbar
          open={Boolean(message)}
          autoHideDuration={5000}
          onClose={() => setMessage("")}
        >
          <Alert severity="info">{message}</Alert>
        </Snackbar>
      )}
    </>
  );
};

export default DocumentStatus;
