import React, { useState } from "react";
import { Container, Box, Button } from "@mui/material";
import RepositoryCreation from "../../components/RepositoryCreation/repositoryCreation";
import RepositoryList from "../../components/RepositoryList/repositoryList";
import DocumentCreation from "../../components/DocumentCreation/documentCreation";
import useRepositories from "../../hooks/useRepositories";
import useDocuments from "../../hooks/useDocuments";
import { useAuth } from "../../services/auth";

const HomePage = () => {
  const { logout } = useAuth();
  const {
    repositoryList,
    createRepository,
    message,
    getEnvelopesByRepository,
  } = useRepositories();
  const {
    isModalOpen,
    openModal,
    closeModal,
    newEnvelope,
    updateNewEnvelope,
    addSignatory,
    updateSignatory,
    createEnvelope,
  } = useDocuments();

  const [newRepositoryName, setNewRepositoryName] = useState("");
  const [envelopes, setEnvelopes] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const handleCreateRepository = () => {
    createRepository(newRepositoryName);
  };

  const handleAccordionChange = async (repositoryId) => {
    if (!envelopes[repositoryId]) {
      const repositoryEnvelopes = await getEnvelopesByRepository(repositoryId);
      setEnvelopes((prevEnvelopes) => ({
        ...prevEnvelopes,
        [repositoryId]: repositoryEnvelopes,
      }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <Button onClick={logout} variant="contained" color="primary">
          Sair
        </Button>
      </Box>

      <Box display="flex" gap={0} marginBottom={2}>
        <RepositoryCreation
          createRepository={handleCreateRepository}
          setNewRepositoryName={setNewRepositoryName}
        />{" "}
        <Button variant="contained" color="primary" onClick={openModal}>
          Criar Novo Envelope
        </Button>
      </Box>

      {message && <p>{message}</p>}

      <RepositoryList
        repositoryList={repositoryList}
        envelopes={envelopes}
        handleAccordionChange={handleAccordionChange}
      />

      <DocumentCreation
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        newEnvelope={newEnvelope}
        updateNewEnvelope={updateNewEnvelope}
        addSignatory={addSignatory}
        updateSignatory={updateSignatory}
        createEnvelope={createEnvelope}
      />
    </Container>
  );
};

export default HomePage;
