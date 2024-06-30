import React from "react";
import { Modal, Box, Button, Typography as MuiTypography } from "@mui/material";
import { Typography } from "./forwardAssignModal.styles";

const ForwardAssignModal = ({ open, onClose, onConfirm }) => {
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
        <Typography variant="h6">Encaminhar Envelope</Typography>
        <Typography>
          Deseja mesmo encaminhar este envelope para assinatura?
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onClose} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="outlined" color="primary">
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ForwardAssignModal;
