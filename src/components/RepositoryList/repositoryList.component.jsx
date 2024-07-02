import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
} from '@mui/material';
import RepositoryAccordion from '../RepositoryAccordion/repositoryAccordion.component';
import SignatariosModal from '../SignatariosModal/signatariosModal.component';
import ForwardAssignModal from '../ForwardAssignModal/forwardAssignModal.component';
import DeleteConfirmModal from '../DocumentDelete/documentDeleteModal.component';
import useDocuments from '../../hooks/useDocuments';
import { getStatusDescription } from '../../hooks/useDocuments';

const RepositoryList = ({
  repositoryList,
  envelopes,
  handleAccordionChange,
}) => {
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

  useEffect(() => {
    if (selectedEnvelope) {
      fetchSignatarios(selectedEnvelope);
    }
  }, [selectedEnvelope]);

  const fetchSignatarios = async (envelopeId) => {
    try {
      const response = await getSignatariosPorEnvelope(envelopeId);
      setSignatarios(response || []);
    } catch (error) {
      console.error('Erro ao buscar signatários:', error);
    }
  };

  const handleChange = (repositoryId) => (event, isExpanded) => {
    setExpanded(isExpanded ? repositoryId : false);
    setLoadingEnvelopes((prev) => ({ ...prev, [repositoryId]: true }));
    handleAccordionChange(repositoryId).finally(() => {
      setLoadingEnvelopes((prev) => ({ ...prev, [repositoryId]: false }));
    });
  };

  const openSignatariosModal = (envelopeId) => {
    setSelectedEnvelope(envelopeId);
    setIsSignatariosModalOpen(true);
  };

  const closeSignatariosModal = () => {
    setIsSignatariosModalOpen(false);
    setSelectedEnvelope(null);
  };

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

  const openForwardAssignModal = async (envelope) => {
    if (envelope.status !== '1') {
      setAlertSeverity('warning');
      setMessage('Esse envelope já foi encaminhado para assinatura.');
      return;
    }
    await fetchSignatarios(envelope.id);
    if (!signatarios || signatarios.length === 0) {
      setAlertSeverity('warning');
      setMessage('Não foi possível enviar pois não há signatários vinculados a esse envelope.');
      return;
    }
    setSelectedEnvelope(envelope.id);
    setIsForwardAssignModalOpen(true);
  };

  const closeForwardAssignModal = () => {
    setIsForwardAssignModalOpen(false);
    setSelectedEnvelope(null);
  };

  const handleDownload = async (envelope) => {
    try {
      const { envelopeContent, nomeArquivo, mimeType } = await downloadPDFEnvelope(envelope.hashSHA256);
      if (envelopeContent) {
        const link = document.createElement('a');
        link.href = `data:${mimeType};base64,${envelopeContent}`;
        link.download = nomeArquivo;
        link.click();
        setAlertSeverity('success');
        setMessage('Download iniciado.');
      } else {
        setAlertSeverity('warning');
        setMessage('Conteúdo do envelope não encontrado.');
      }
    } catch (error) {
      setAlertSeverity('error');
      setMessage('Erro ao baixar o envelope.');
      console.error('Erro ao baixar o envelope:', error);
    }
  };

  const handleDelete = async (envelopeId, status) => {
    if (status === '2') {
      setAlertSeverity('warning');
      setMessage('Não é possível excluir um envelope aguardando assinatura.');
      return;
    }
    setSelectedEnvelope(envelopeId);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await expurgarEnvelope(selectedEnvelope);
      setAlertSeverity('success');
      setMessage('Envelope excluído com sucesso!');
    } catch (error) {
      setAlertSeverity('error');
      setMessage('Erro ao excluir envelope.');
      console.error('Erro ao excluir envelope:', error);
    } finally {
      setIsDeleteConfirmModalOpen(false);
      setSelectedEnvelope(null);
    }
  };

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
