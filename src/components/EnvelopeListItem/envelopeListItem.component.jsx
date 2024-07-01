import React from 'react';
import { ListItem, ListItemText, IconButton } from '@mui/material';
import { Edit, Send, Delete, Download } from '@mui/icons-material';

const EnvelopeListItem = ({
  envelope,
  openSignatariosModal,
  openForwardAssignModal,
  handleDownload,
  handleDelete,
  getStatusDescription,
}) => {
  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton edge="end" onClick={() => openSignatariosModal(envelope.id)}>
            <Edit />
          </IconButton>
          <IconButton edge="end" onClick={() => openForwardAssignModal(envelope)}>
            <Send />
          </IconButton>
          {envelope.status === '3' && (
            <IconButton edge="end" onClick={() => handleDownload(envelope)}>
              <Download />
            </IconButton>
          )}
          <IconButton edge="end" onClick={() => handleDelete(envelope.id, envelope.status)}>
            <Delete />
          </IconButton>
        </>
      }
    >
      <ListItemText
        sx={{ marginRight: 2, paddingRight: 2 }}
        primary={envelope.descricao}
        secondary={`Status: ${getStatusDescription(envelope.status)} | Criado em: ${new Date(envelope.dataHoraCriacao).toLocaleString()}`}
      />
    </ListItem>
  );
};

export default EnvelopeListItem;
