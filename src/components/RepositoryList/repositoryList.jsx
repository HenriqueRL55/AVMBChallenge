import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const RepositoryList = ({
  repositoryList,
  envelopes,
  handleAccordionChange,
}) => {
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

  return (
    <>
      {repositoryList.map((repository) => (
        <Accordion
          key={repository.id}
          onChange={() => handleAccordionChange(repository.id)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{repository.nome}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <Typography>
                Data de Criação:{" "}
                {new Date(repository.dataHoraCriacao).toLocaleString()}
              </Typography>
              <List>
                {envelopes[repository.id] &&
                envelopes[repository.id].length > 0 ? (
                  envelopes[repository.id].map((envelope) => (
                    <ListItem key={envelope.id}>
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
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default RepositoryList;
