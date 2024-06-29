import React, { useState } from "react";
import DocumentForm from "../../components/DocumentForm";
import DocumentList from "../../components/DocumentList";
import useDocuments from "../../hooks/useDocuments";
import { useAuth } from "../../services/auth";
import { Container, Box, Button } from "@mui/material";

const HomePage = () => {
  const { logout } = useAuth();
  const {
    documentList,
    message,
    createEnvelope,
    deleteDocument,
    updateDocumentTitle,
  } = useDocuments();

  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [newDocumentReceiver, setNewDocumentReceiver] = useState("");
  const [newDocumentSignatory, setNewDocumentSignatory] = useState("");
  const [newDocumentFile, setNewDocumentFile] = useState(null);
  const [newDocumentStatus, setNewDocumentStatus] = useState("");
  const [updatedDocumentTitle, setUpdateDocumentTitle] = useState("");

  const handleCreateEnvelope = () => {
    createEnvelope(
      newDocumentTitle,
      newDocumentFile,
      newDocumentReceiver,
      newDocumentSignatory
    );
  };

  return (
    <Container>
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <Button onClick={logout} variant="contained" color="primary">
          Sair
        </Button>
      </Box>

      <DocumentForm
        createEnvelope={handleCreateEnvelope}
        setNewDocumentTitle={setNewDocumentTitle}
        setNewDocumentReceiver={setNewDocumentReceiver}
        setNewDocumentSignatory={setNewDocumentSignatory}
        setNewDocumentFile={setNewDocumentFile}
        setNewDocumentStatus={setNewDocumentStatus}
      />

      {message && <p>{message}</p>}

      <DocumentList
        documentList={documentList}
        deleteDocument={deleteDocument}
        updatedDocumentTitle={updatedDocumentTitle}
        setUpdateDocumentTitle={setUpdateDocumentTitle}
      />
    </Container>
  );
};

export default HomePage;
