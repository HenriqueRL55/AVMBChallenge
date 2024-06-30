import React, { useState } from "react";
import RepositoryCreation from "../../components/RepositoryCreation/repositoryCreation.component";
import RepositoryList from "../../components/RepositoryList/repositoryList.component";
import DocumentCreation from "../../components/DocumentCreation/documentCreation.component";
import DocumentStatus from "../../components/DocumentStatus/documentStatus.component";
import DocumentQuery from "../../components/DocumentQuery/documentQuery.component";
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
import AlertMessage from "../../components/AlertMessage/alertMessage.component";

const HomePage = () => {
  const { logout } = useAuth();
  const { repositoryList, createRepository, getEnvelopesByRepository } =
    useRepositories();
  const {
    isModalOpen,
    openModal,
    closeModal,
    newEnvelope,
    updateNewEnvelope,
    addSignatory,
    updateSignatory,
    createEnvelope,
    getDadosEnvelope,
  } = useDocuments();

  const [newRepositoryName, setNewRepositoryName] = useState("");
  const [envelopes, setEnvelopes] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [documentInfo, setDocumentInfo] = useState(null);
  const [isModalOpenQuery, setIsModalOpenQuery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await getDadosEnvelope(searchTerm);
      if (response) {
        setDocumentInfo(response);
        setIsModalOpenQuery(true);
      } else {
        setMessage("Documento não encontrado.");
      }
    } catch (error) {
      setMessage("Erro ao consultar documento.");
    } finally {
      setLoading(false);
    }
  };

  const closeModalQuery = () => {
    setIsModalOpenQuery(false);
    setDocumentInfo(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const removeSignatory = (index) => {
    const updatedSignatories = newEnvelope.signatories.filter(
      (_, i) => i !== index
    );
    updateNewEnvelope("signatories", updatedSignatories);
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
          <DocumentQuery
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
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
        <DocumentStatus
          isModalOpen={isModalOpenQuery}
          closeModal={closeModalQuery}
          documentInfo={documentInfo}
          loading={loading}
          message={message}
        />
        <AlertMessage
          open={Boolean(message)}
          onClose={() => setMessage("")}
          message={message}
        />
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
        removeSignatory={removeSignatory}
        createEnvelope={createEnvelope}
        repositoryList={repositoryList}
      />
    </HomeContainer>
  );
};

export default HomePage;
