import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const RepositoryList = ({ repositoryList, envelopes, handleAccordionChange }) => {
  return (
    <>
      {repositoryList.map((repository) => (
        <Accordion key={repository.id} onChange={() => handleAccordionChange(repository.id)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{repository.nome}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <Typography>
        
                Data de Criação: {new Date(repository.dataHoraCriacao).toLocaleString()}
              </Typography>
              <List>
                {envelopes[repository.id] && envelopes[repository.id].length > 0 ? (
                  envelopes[repository.id].map((envelope) => (
                    <ListItem key={envelope.id}>
                      <ListItemText primary={envelope.descricao} secondary={new Date(envelope.dataHoraCriacao).toLocaleString()} />
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
