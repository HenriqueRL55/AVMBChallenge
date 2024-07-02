// React Hooks
import React, { useState, useEffect } from 'react';
// Material UI
import { Snackbar, Alert } from '@mui/material';
// Componentes Customizados
import RepositoryAccordion from '../RepositoryAccordion/repositoryAccordion.component';
import SignatariosModal from '../SignatariosModal/signatariosModal.component';
import ForwardAssignModal from '../ForwardAssignModal/forwardAssignModal.component';
import DeleteConfirmModal from '../DocumentDelete/documentDeleteModal.component';
// Hooks Customizados
import useDocuments from '../../hooks/useDocuments';
// Funções Auxiliares
import { fetchSignatarios, handleDownloadPDF, confirmEnvelopeDelete } from '../../helpers/repositoryListHelpers';

const RepositoryList = ({ repositoryList, envelopes, handleAccordionChange }) => {
  const [loadingEnvelopes, setLoadingEnvelopes] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState(null);
  const [isSignatariosModalOpen, setIsSignatariosModalOpen] = useState(false);
  const [isForwardAssignModalOpen, setIsForwardAssignModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [signatarios, setSignatarios] = useState([]);
  const {
    encaminharEnvelopeParaAssinaturas,
    expurgarEnvelope,
    getSignatariosPorEnvelope,
    downloadPDFEnvelope,
  } = useDocuments();

  // useEffect para buscar signatários quando um envelope é selecionado
  useEffect(() => {
    if (selectedEnvelope) {
      fetchSignatarios(getSignatariosPorEnvelope, selectedEnvelope, setSignatarios);
    }
  }, [selectedEnvelope]);

  // Função para lidar com a mudança de acordeão
  const handleChange = (repositoryId) => (event, isExpanded) => {
    setExpanded(isExpanded ? repositoryId : false);
    setLoadingEnvelopes((prev) => ({ ...prev, [repositoryId]: true }));
    handleAccordionChange(repositoryId).finally(() => {
      setLoadingEnvelopes((prev) => ({ ...prev, [repositoryId]: false }));
    });
  };

  // Função para abrir o modal de signatários
  const openSignatariosModal = (envelopeId) => {
    setSelectedEnvelope(envelopeId);
    setIsSignatariosModalOpen(true);
  };

  // Função para fechar o modal de signatários
  const closeSignatariosModal = () => {
    setIsSignatariosModalOpen(false);
    setSelectedEnvelope(null);
  };

  // Função para confirmar o encaminhamento de um envelope para assinaturas
  const handleConfirm = async () => {
    if (!signatarios || signatarios.length === 0) {
      setAlertSeverity('warning');
      setMessage('Não foi possível enviar pois não há signatários vinculados a esse envelope.');
      return true;
    }
    try {
      await encaminharEnvelopeParaAssinaturas(selectedEnvelope);
      setAlertSeverity('success');
      setMessage('Envelope encaminhado para assinatura com sucesso!');
    } catch (error) {
      setAlertSeverity('error');
      setMessage('Erro ao encaminhar envelope para assinatura.');
      console.error('Erro ao encaminhar envelope para assinaturas:', error);
    } finally {
      closeForwardAssignModal();
    }
    return false;
  };

  // Função para abrir o modal de encaminhamento de assinaturas
  const openForwardAssignModal = async (envelope) => {
    if (envelope.status !== '1') {
      setAlertSeverity('warning');
      setMessage('Esse envelope já foi encaminhado para assinatura.');
      return;
    }
    await fetchSignatarios(getSignatariosPorEnvelope, envelope.id, setSignatarios);
    if (!signatarios || signatarios.length === 0) {
      setAlertSeverity('warning');
      setMessage('Não foi possível enviar pois não há signatários vinculados a esse envelope.');
      return;
    }
    setSelectedEnvelope(envelope.id);
    setIsForwardAssignModalOpen(true);
  };

  // Função para fechar o modal de encaminhamento de assinaturas
  const closeForwardAssignModal = () => {
    setIsForwardAssignModalOpen(false);
    setSelectedEnvelope(null);
  };

  // Função para iniciar o download do envelope
  const handleDownload = async (envelope) => {
    await handleDownloadPDF(downloadPDFEnvelope, envelope, setAlertSeverity, setMessage);
  };

  // Função para lidar com a exclusão de um envelope
  const handleDelete = async (envelopeId, status) => {
    if (status === '2') {
      setAlertSeverity('warning');
      setMessage('Não é possível excluir um envelope aguardando assinatura.');
      return;
    }
    setSelectedEnvelope(envelopeId);
    setIsDeleteConfirmModalOpen(true);
  };

  // Função para confirmar a exclusão de um envelope
  const confirmDelete = async () => {
    await confirmEnvelopeDelete(expurgarEnvelope, selectedEnvelope, setAlertSeverity, setMessage, closeDeleteConfirmModal);
  };

  // Função para fechar o modal de confirmação de exclusão
  const closeDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(false);
    setSelectedEnvelope(null);
  };

  return (
    <>
      {repositoryList.map((repository) => (
        <RepositoryAccordion
          key={repository.id}
          repository={repository}
          expanded={expanded}
          loadingEnvelopes={loadingEnvelopes}
          envelopes={envelopes}
          handleChange={handleChange}
          openSignatariosModal={openSignatariosModal}
          openForwardAssignModal={openForwardAssignModal}
          handleDownload={handleDownload}
          handleDelete={handleDelete}
        />
      ))}
      <SignatariosModal
        open={isSignatariosModalOpen}
        onClose={closeSignatariosModal}
        envelopeId={selectedEnvelope}
      />
      <ForwardAssignModal
        open={isForwardAssignModalOpen}
        onClose={closeForwardAssignModal}
        onConfirm={handleConfirm}
      />
      <DeleteConfirmModal
        open={isDeleteConfirmModalOpen}
        onClose={closeDeleteConfirmModal}
        onConfirm={confirmDelete}
      />
      {message && (
        <Snackbar
          open={Boolean(message)}
          autoHideDuration={5000}
          onClose={() => setMessage('')}
        >
          <Alert severity={alertSeverity}>{message}</Alert>
        </Snackbar>
      )}
    </>
  );
};

export default RepositoryList;
