import React, { useState } from "react";
import RepositoryCreation from "../../components/RepositoryCreation/repositoryCreation.component";
import RepositoryList from "../../components/RepositoryList/repositoryList.component";
import DocumentCreation from "../../components/DocumentCreation/documentCreation.component";
import useRepositories from "../../hooks/useRepositories";
import useDocuments from "../../hooks/useDocuments";
import { useAuth } from "../../services/auth";
import {
  HomeContainer,
  LogoutButton,
  InsideContainer,
  RespositoryCreate,
  ListRepository,
  ButtonCreate,
} from "./home.styles";

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
    <HomeContainer>
      <InsideContainer>
        <LogoutButton onClick={logout} variant="contained">
          Sair
        </LogoutButton>
        <RespositoryCreate>
          <RepositoryCreation
            createRepository={handleCreateRepository}
            setNewRepositoryName={setNewRepositoryName}
          />
          <ButtonCreate variant="contained" color="primary" onClick={openModal}>
            Criar Novo Envelope
          </ButtonCreate>
        </RespositoryCreate>
        <ListRepository>
          <RepositoryList
            repositoryList={repositoryList}
            envelopes={envelopes}
            handleAccordionChange={handleAccordionChange}
          />
        </ListRepository>
      </InsideContainer>
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
        repositoryList={repositoryList}
      />
    </HomeContainer>
  );
};

export default HomePage;
