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
  const { repositoryList, createRepository, getEnvelopesByRepository } = useRepositories();
  const {
    isModalOpen,
    closeModal,
    isCreateEnvelopeModalOpen,
    closeCreateEnvelopeModal,
    openCreateEnvelopeModal,
    newEnvelope,
    updateNewEnvelope,
    addSignatory,
    updateSignatory,
    createEnvelope,
    pesquisarEnvelope,
    documentList,
    message,
    loading,
    selectedDocument,
    openDocumentDetails,
  } = useDocuments();

  const [newRepositoryName, setNewRepositoryName] = useState("");
  const [envelopes, setEnvelopes] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

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
    await pesquisarEnvelope(searchTerm);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const removeSignatory = (index) => {
    const updatedSignatories = newEnvelope.signatories.filter((_, i) => i !== index);
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
          <ButtonCreate variant="contained" color="primary" onClick={openCreateEnvelopeModal}>
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
        {loading && <p>Loading...</p>}
        {message && <p>{message}</p>}
        {documentList.length > 0 && (
          <div>
            <h3>Resultados da Pesquisa:</h3>
            <ul>
              {documentList.map((document) => (
                <li key={document.id} onClick={() => openDocumentDetails(document)}>
                  <p>ID: {document.id}</p>
                  <p>Descrição: {document.descricao}</p>
                  <p>Status: {document.statusDescr}</p>
                  <p>Usuário: {document.Usuario.nome}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <AlertMessage
          open={Boolean(message)}
          onClose={() => setMessage("")}
          message={message}
        />
      </InsideContainer>
      <DocumentCreation
        isModalOpen={isCreateEnvelopeModalOpen}
        closeModal={closeCreateEnvelopeModal}
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
      {selectedDocument && (
        <DocumentStatus
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          documentInfo={selectedDocument}
          loading={loading}
          message={message}
        />
      )}
    </HomeContainer>
  );
};

export default HomePage;
