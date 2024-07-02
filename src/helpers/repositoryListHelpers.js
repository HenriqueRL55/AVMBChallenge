//Esse arquivo possui como objetivo auxiliar as funções do componente RepositoryList

// Função para buscar signatários de um envelope
export const fetchSignatarios = async (getSignatariosPorEnvelope, envelopeId, setSignatarios) => {
    try {
      const response = await getSignatariosPorEnvelope(envelopeId);
      setSignatarios(response || []);
    } catch (error) {
      console.error('Erro ao buscar signatários:', error);
    }
  };
  
  // Função para download do PDF do envelope
  export const handleDownloadPDF = async (downloadPDFEnvelope, envelope, setAlertSeverity, setMessage) => {
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
  
  // Função para confirmar exclusão de envelope
  export const confirmEnvelopeDelete = async (expurgarEnvelope, selectedEnvelope, setAlertSeverity, setMessage, closeModal) => {
    try {
      await expurgarEnvelope(selectedEnvelope);
      setAlertSeverity('success');
      setMessage('Envelope excluído com sucesso!');
    } catch (error) {
      setAlertSeverity('error');
      setMessage('Erro ao excluir envelope.');
      console.error('Erro ao excluir envelope:', error);
    } finally {
      closeModal();
    }
  };
  