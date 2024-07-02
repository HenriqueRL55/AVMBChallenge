// React
import React from "react";

// Material UI
import { Modal, Box, Button } from "@mui/material";

// Estilização
import { StyledTypography as Typography } from "./forwardAssignModal.styles";

// Componente de modal para encaminhar envelope
const ForwardAssignModal = ({ open, onClose, onConfirm }) => {
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
        <Typography variant="h6">Encaminhar Envelope</Typography>
        <Typography>
          Deseja mesmo encaminhar este envelope para assinatura?
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onClose} variant="outlined" color="primary">
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

export default ForwardAssignModal;
