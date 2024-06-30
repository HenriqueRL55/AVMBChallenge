import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete, Add, Send } from "@mui/icons-material";
import useSignatarios from "../../hooks/useSignatarios";
import { StyledTypography as Typography } from "./signatariosModal.styles";

const SignatariosModal = ({ open, onClose, envelopeId }) => {
  const {
    signatarios,
    loading,
    error,
    getSignatariosPorEnvelope,
    atualizarSignatarioEnvelope,
    excluirSignatarioEnvelope,
    inserirSignatarioEnvelope,
    encaminharEnvelopeParaAssinaturas,
  } = useSignatarios();
  const [editSignatario, setEditSignatario] = useState(null);
  const [editData, setEditData] = useState({});
  const [newSignatarios, setNewSignatarios] = useState([]);
  const [warning, setWarning] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getSignatariosPorEnvelope(envelopeId);
    }
  }, [open, envelopeId]);

  const handleEdit = (signatario) => {
    setEditSignatario(signatario.id);
    setEditData(signatario.ConfigAssinatura);
  };

  const handleUpdate = async () => {
    try {
      await atualizarSignatarioEnvelope({
        id: editSignatario,
        Envelope: { id: envelopeId },
        ordem: 1,
        status: 1,
        ConfigAssinatura: editData,
      });
      setEditSignatario(null);
      getSignatariosPorEnvelope(envelopeId);
    } catch (error) {
      console.error("Erro ao atualizar signatário:", error);
    }
  };

  const handleDelete = async (id) => {
    if (signatarios.length === 1) {
      setWarning("Não é possível ficar sem signatários");
      setTimeout(() => {
        setWarning("");
      }, 5000);
      return;
    }
    try {
      await excluirSignatarioEnvelope(id);
      getSignatariosPorEnvelope(envelopeId);
    } catch (error) {
      console.error("Erro ao excluir signatário:", error);
    }
  };

  const handleChange = (field, value) => {
    setEditData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleAddNewSignatario = () => {
    setNewSignatarios([
      ...newSignatarios,
      { nomeSignatario: "", emailSignatario: "" },
    ]);
  };

  const handleNewSignatarioChange = (index, field, value) => {
    const updatedNewSignatarios = newSignatarios.map((signatario, i) =>
      i === index ? { ...signatario, [field]: value } : signatario
    );
    setNewSignatarios(updatedNewSignatarios);
  };

  const handleSaveNewSignatarios = async () => {
    try {
      for (const signatario of newSignatarios) {
        await inserirSignatarioEnvelope({
          Envelope: { id: envelopeId },
          ordem: signatarios.length + 1, // Ajustar conforme necessário
          ConfigAssinatura: {
            ...signatario,
            tipoAssinatura: 1, // Ajustar conforme necessário
            permitirDelegar: "N",
            apenasCelular: "N",
            exigirLogin: "N",
            exigirCodigo: "N",
            exigirDadosIdentif: "N",
            assinaturaPresencial: "N",
            incluirImagensAutentEnvelope: "N",
            analisarFaceImagem: "N",
            percentualPrecisaoFace: 0,
            intervaloPaginaDesenho: "1,3,4-10",
          },
        });
      }
      setNewSignatarios([]);
      getSignatariosPorEnvelope(envelopeId);
    } catch (error) {
      console.error("Erro ao inserir signatário:", error);
    }
  };

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const handleConfirm = async () => {
    try {
      await encaminharEnvelopeParaAssinaturas(envelopeId);
      setIsConfirmModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Erro ao encaminhar envelope para assinaturas:", error);
    }
  };

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
        <Typography variant="h6">Signatários</Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error.message}</Typography>}
        {warning && (
          <Snackbar
            open={Boolean(warning)}
            autoHideDuration={5000}
            onClose={() => setWarning("")}
          >
            <Alert severity="warning">{warning}</Alert>
          </Snackbar>
        )}
        {signatarios && Array.isArray(signatarios) && signatarios.length > 0 ? (
          signatarios.map((signatario) => (
            <Box key={signatario.id} display="flex" alignItems="center" mb={1}>
              <Typography variant="body1">
                {signatario.ConfigAssinatura.nomeSignatario || "Sem Nome"} (
                {signatario.ConfigAssinatura.emailSignatario})
              </Typography>
              <IconButton onClick={() => handleEdit(signatario)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(signatario.id)}>
                <Delete />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography>Nenhum signatário encontrado.</Typography>
        )}
        {editSignatario && (
          <Box>
            <TextField
              label="Nome"
              value={editData.nomeSignatario || ""}
              onChange={(e) => handleChange("nomeSignatario", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={editData.emailSignatario || ""}
              onChange={(e) => handleChange("emailSignatario", e.target.value)}
              fullWidth
              margin="normal"
            />
            {/* Adicione outros campos de configuração conforme necessário */}
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Atualizar
            </Button>
            <Button
              onClick={() => setEditSignatario(null)}
              variant="outlined"
              color="secondary"
            >
              Cancelar
            </Button>
          </Box>
        )}
        {newSignatarios.map((signatario, index) => (
          <Box key={index}>
            <TextField
              label="Nome"
              value={signatario.nomeSignatario}
              onChange={(e) =>
                handleNewSignatarioChange(
                  index,
                  "nomeSignatario",
                  e.target.value
                )
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={signatario.emailSignatario}
              onChange={(e) =>
                handleNewSignatarioChange(
                  index,
                  "emailSignatario",
                  e.target.value
                )
              }
              fullWidth
              margin="normal"
            />
          </Box>
        ))}
        <Box display="flex" justifyContent="center" mt={2}>
          <IconButton onClick={handleAddNewSignatario} color="primary">
            <Add />
          </IconButton>
        </Box>
        {newSignatarios.length > 0 && (
          <Box mt={2}>
            <Button
              onClick={handleSaveNewSignatarios}
              variant="contained"
              color="primary"
              fullWidth
            >
              Salvar Novos Signatários
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default SignatariosModal;
