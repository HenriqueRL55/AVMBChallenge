// Importações necessárias
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
import { Edit, Delete, Add } from "@mui/icons-material";
import useSignatarios from "../../hooks/useSignatarios";
import { StyledTypography as Typography } from "./signatariosModal.styles";

// Componente do Modal de Signatários
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

  const [editSignatario, setEditSignatario] = useState(null); // Estado para edição de signatário
  const [editData, setEditData] = useState({}); // Estado para dados de edição
  const [newSignatarios, setNewSignatarios] = useState([]); // Estado para novos signatários
  const [warning, setWarning] = useState(""); // Estado para avisos

  // Efeito para buscar signatários quando o modal é aberto
  useEffect(() => {
    if (open) {
      getSignatariosPorEnvelope(envelopeId);
    }
  }, [open, envelopeId]);

  // Função para iniciar a edição de um signatário
  const handleEdit = (signatario) => {
    setEditSignatario(signatario.id);
    setEditData(signatario.ConfigAssinatura);
  };

  // Função para atualizar um signatário
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

  // Função para excluir um signatário
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

  // Função para lidar com mudanças nos campos de edição
  const handleChange = (field, value) => {
    setEditData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Função para adicionar um novo signatário
  const handleAddNewSignatario = () => {
    setNewSignatarios([
      ...newSignatarios,
      { nomeSignatario: "", emailSignatario: "" },
    ]);
  };

  // Função para lidar com mudanças nos campos de novos signatários
  const handleNewSignatarioChange = (index, field, value) => {
    const updatedNewSignatarios = newSignatarios.map((signatario, i) =>
      i === index ? { ...signatario, [field]: value } : signatario
    );
    setNewSignatarios(updatedNewSignatarios);
  };

  // Função para salvar novos signatários
  const handleSaveNewSignatarios = async () => {
    try {
      for (const signatario of newSignatarios) {
        await inserirSignatarioEnvelope({
          Envelope: { id: envelopeId },
          ordem: signatarios.length + 1,
          ConfigAssinatura: {
            ...signatario,
            tipoAssinatura: 1,
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "background.paper",
          m: "auto",
          mt: { xs: "20%", sm: "15%", md: "10%", lg: "5%" },
          borderRadius: 2,
          boxShadow: 24,
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
