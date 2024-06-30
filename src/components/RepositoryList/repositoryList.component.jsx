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
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import {
  TypographyCreation,
  WhiteExpandMoreIcon,
} from "./respositoryList.style";
import SignatariosModal from "../SignatariosModal/signatariosModal.component";

const RepositoryList = ({ repositoryList, envelopes, handleAccordionChange }) => {
  const [loadingEnvelopes, setLoadingEnvelopes] = useState({});
  const [selectedEnvelope, setSelectedEnvelope] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  };

  const closeSignatariosModal = () => {
    setIsModalOpen(false);
    setSelectedEnvelope(null);
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
                  {envelopes[repository.id] && envelopes[repository.id].length > 0 ? (
                    envelopes[repository.id].map((envelope) => (
                      <ListItem key={envelope.id} secondaryAction={
                        <IconButton edge="end" onClick={() => openSignatariosModal(envelope.id)}>
                          <Edit />
                        </IconButton>
                      }>
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
        open={isModalOpen}
        onClose={closeSignatariosModal}
        envelopeId={selectedEnvelope}
      />
    </>
  );
};

export default RepositoryList;
