import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Send, Delete } from "@mui/icons-material";
import {
  TypographyCreation,
  WhiteExpandMoreIcon,
} from "./respositoryList.style";
import SignatariosModal from "../SignatariosModal/signatariosModal.component";
import ForwardAssignModal from "../ForwardAssignModal/forwardAssignModal.component";
import DeleteConfirmModal from "../DocumentDelete/documentDeleteModal.component";
import useDocuments from "../../hooks/useDocuments";

const RepositoryList = ({
  repositoryList,
  envelopes,
  handleAccordionChange,
}) => {
  const [loadingEnvelopes, setLoadingEnvelopes] = useState({});
  const [selectedEnvelope, setSelectedEnvelope] = useState(null);
  const [isSignatariosModalOpen, setIsSignatariosModalOpen] = useState(false);
  const [isForwardAssignModalOpen, setIsForwardAssignModalOpen] =
    useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [message, setMessage] = useState("");
  const { encaminharEnvelopeParaAssinaturas, expurgarEnvelope } = useDocuments();

  const getStatusDescription = (status) => {
    switch (status) {
      case "1":
        return "Em construção";
      case "2":
        return "Aguardando Assinaturas";
      case "3":
        return "Concluído";
      case "4":
        return "Arquivado";
      case "5":
        return "Cancelado";
      case "6":
        return "Expirado";
      default:
        return "Desconhecido";
    }
  };

  const handleAccordionChangeWrapper = (repositoryId) => {
    setLoadingEnvelopes((prev) => ({ ...prev, [repositoryId]: true }));
    handleAccordionChange(repositoryId).finally(() => {
      setLoadingEnvelopes((prev) => ({ ...prev, [repositoryId]: false }));
    });
  };

  const openSignatariosModal = (envelopeId) => {
    setSelectedEnvelope(envelopeId);
    setIsSignatariosModalOpen(true);
  };

  const closeSignatariosModal = () => {
    setIsSignatariosModalOpen(false);
    setSelectedEnvelope(null);
  };

  const openForwardAssignModal = (envelope) => {
    if (envelope.status !== "1") {
      setMessage("Esse envelope já foi encaminhado para assinatura.");
      return;
    }
    setSelectedEnvelope(envelope.id);
    setIsForwardAssignModalOpen(true);
  };

  const closeForwardAssignModal = () => {
    setIsForwardAssignModalOpen(false);
    setSelectedEnvelope(null);
  };

  const openDeleteConfirmModal = (envelope) => {
    if (envelope.status === "2") {
      setMessage("Não é possível excluir um envelope que está aguardando assinatura.");
      return;
    }
    setSelectedEnvelope(envelope.id);
    setIsDeleteConfirmModalOpen(true);
  };

  const closeDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(false);
    setSelectedEnvelope(null);
  };

  const handleConfirm = async () => {
    try {
      await encaminharEnvelopeParaAssinaturas(selectedEnvelope);
      setMessage("Envelope encaminhado para assinatura com sucesso!");
    } catch (error) {
      setMessage("Erro ao encaminhar envelope para assinatura.");
      console.error("Erro ao encaminhar envelope para assinaturas:", error);
    } finally {
      closeForwardAssignModal();
    }
  };

  const handleDelete = async () => {
    try {
      await expurgarEnvelope(selectedEnvelope);
      setMessage("Envelope excluído com sucesso!");
    } catch (error) {
      setMessage("Erro ao excluir envelope.");
      console.error("Erro ao excluir envelope:", error);
    } finally {
      closeDeleteConfirmModal();
    }
  };

  return (
    <>
      {repositoryList.map((repository) => (
        <Accordion
          key={repository.id}
          onChange={() => handleAccordionChangeWrapper(repository.id)}
        >
          <AccordionSummary expandIcon={<WhiteExpandMoreIcon />}>
            <Typography>{repository.nome}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <TypographyCreation>
                Data de Criação:{" "}
                {new Date(repository.dataHoraCriacao).toLocaleString()}
              </TypographyCreation>
              {loadingEnvelopes[repository.id] ? (
                <TypographyCreation>Carregando envelopes...</TypographyCreation>
              ) : (
                <List>
                  {envelopes[repository.id] &&
                  envelopes[repository.id].length > 0 ? (
                    envelopes[repository.id].map((envelope) => (
                      <ListItem
                        key={envelope.id}
                        secondaryAction={
                          <>
                            <IconButton
                              edge="end"
                              onClick={() => openSignatariosModal(envelope.id)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => openForwardAssignModal(envelope)}
                            >
                              <Send />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => openDeleteConfirmModal(envelope)}
                            >
                              <Delete />
                            </IconButton>
                          </>
                        }
                      >
                        <ListItemText
                          primary={envelope.descricao}
                          secondary={`Status: ${getStatusDescription(
                            envelope.status
                          )} | Criado em: ${new Date(
                            envelope.dataHoraCriacao
                          ).toLocaleString()}`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="Nenhum envelope encontrado neste repositório." />
                    </ListItem>
                  )}
                </List>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
      <SignatariosModal
        open={isSignatariosModalOpen}
        onClose={closeSignatariosModal}
        envelopeId={selectedEnvelope}
      />
      <ForwardAssignModal
        open={isForwardAssignModalOpen}
        onClose={closeForwardAssignModal}
        onConfirm={handleConfirm}
      />
      <DeleteConfirmModal
        open={isDeleteConfirmModalOpen}
        onClose={closeDeleteConfirmModal}
        onConfirm={handleDelete}
      />
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

export default RepositoryList;
