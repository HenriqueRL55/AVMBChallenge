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

const DocumentStatus = ({ isModalOpen, closeModal, documentInfo, loading, message }) => {
  return (
    <>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            width: 400,
            p: 4,
            bgcolor: "background.paper",
            m: "auto",
            mt: 10,
          }}
        >
          {documentInfo && (
            <Box>
              <Typography variant="h6">Informações do Documento</Typography>
              <Typography>ID: {documentInfo.id}</Typography>
              <Typography>Nome: {documentInfo.nome}</Typography>
              <Typography>Status: {documentInfo.status}</Typography>
              <Button onClick={closeModal} variant="contained" sx={{ mt: 2 }}>
                Fechar
              </Button>
            </Box>
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
