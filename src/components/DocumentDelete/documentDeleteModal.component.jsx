// React
import React from "react";

// Material UI
import { Modal, Box, Button, Typography as MuiTypography } from "@mui/material";

// Estilização
import { Typography } from "./documentDeleteModal.styles";

// Componente de modal para confirmação de exclusão de envelope
const DeleteConfirmModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
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
        <Typography variant="h6">Excluir Envelope</Typography>
        <Typography>
          Deseja mesmo excluir este envelope? Esta ação não pode ser desfeita.
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onClose} variant="contained" color="primary">
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="contained" color="primary">
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmModal;
