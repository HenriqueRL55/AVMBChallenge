import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from '@mui/system';

const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxWidth: "400px",
  margin: "0 auto",
});

const Input = styled(TextField)({
  marginBottom: "16px",
});

const UploadButton = styled(Button)({
  marginBottom: "16px",
});

const CreateButton = styled(Button)({
  alignSelf: "center",
});

const DocumentForm = ({
  createEnvelope,
  setNewDocumentTitle,
  setNewDocumentReceiver,
  setNewDocumentSignatory,
  setNewDocumentFile,
  setNewDocumentStatus,
}) => {
  return (
    <FormContainer>
      <Input
        label="Título"
        variant="outlined"
        fullWidth
        onChange={(e) => setNewDocumentTitle(e.target.value)}
      />
      <Input
        label="Destinatário"
        variant="outlined"
        fullWidth
        onChange={(e) => setNewDocumentReceiver(e.target.value)}
      />
      <Input
        label="Signatário"
        variant="outlined"
        fullWidth
        onChange={(e) => setNewDocumentSignatory(e.target.value)}
      />
      <UploadButton
        variant="contained"
        component="label"
      >
        Adicionar arquivo
        <input
          type="file"
          hidden
          onChange={(e) => setNewDocumentFile(e.target.files[0])}
        />
      </UploadButton>
      <Input
        label="Status"
        variant="outlined"
        fullWidth
        onChange={(e) => setNewDocumentStatus(e.target.value)}
      />
      <CreateButton
        variant="contained"
        color="primary"
        onClick={createEnvelope}
      >
        Criar Envelope
      </CreateButton>
    </FormContainer>
  );
};

export default DocumentForm;
