import React from "react";
import { Modal, Box, Button, Typography as MuiTypography } from "@mui/material";
import { Typography } from "./documentDeleteModal.styles";

const DeleteConfirmModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          p: 4,
          bgcolor: "background.paper",
          m: "auto",
          mt: 10,
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
