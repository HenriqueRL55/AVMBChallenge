import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import EnvelopeListItem from "../EnvelopeListItem/envelopeListItem.component";

const RepositoryAccordion = ({
  repository,
  expanded,
  loadingEnvelopes,
  envelopes,
  handleChange,
  openSignatariosModal,
  openForwardAssignModal,
  handleDownload,
  handleDelete,
  getStatusDescription,
}) => {
  return (
    <Accordion
      key={repository.id}
      expanded={expanded === repository.id}
      onChange={handleChange(repository.id)}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{repository.nome}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <Typography>
            Data de Criação:{" "}
            {new Date(repository.dataHoraCriacao).toLocaleString()}
          </Typography>
          {loadingEnvelopes[repository.id] ? (
            <Typography>Carregando envelopes...</Typography>
          ) : (
            <List>
              {envelopes[repository.id] &&
              envelopes[repository.id].length > 0 ? (
                envelopes[repository.id].map((envelope) => (
                  <EnvelopeListItem
                    key={envelope.id}
                    envelope={envelope}
                    openSignatariosModal={openSignatariosModal}
                    openForwardAssignModal={openForwardAssignModal}
                    handleDownload={handleDownload}
                    handleDelete={handleDelete}
                    getStatusDescription={getStatusDescription}
                  />
                ))
              ) : (
                <Typography>
                  Nenhum envelope encontrado neste repositório.
                </Typography>
              )}
            </List>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default RepositoryAccordion;
