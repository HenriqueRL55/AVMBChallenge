import { useState } from "react";
import fetchService from "../services/api/documentAPI";
import { readFileAsBase64 } from "../utils/fileUtils";

const getStatusDescription = (status) => {
  switch (status) {
    case '1':
      return 'Em construção';
    case '2':
      return 'Aguardando Assinaturas';
    case '3':
      return 'Concluído';
    case '4':
      return 'Arquivado';
    case '5':
      return 'Cancelado';
    case '6':
      return 'Expirado';
    default:
      return 'Desconhecido';
  }
};

const useDocuments = () => {
  const [documentList, setDocumentList] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isCreateEnvelopeModalOpen, setIsCreateEnvelopeModalOpen] = useState(false);
  const [newEnvelope, setNewEnvelope] = useState({
    file: null,
    description: "",
    repositoryId: "",
    repositoryName: "",
    signatories: [],
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  const openCreateEnvelopeModal = () => setIsCreateEnvelopeModalOpen(true);
  const closeCreateEnvelopeModal = () => setIsCreateEnvelopeModalOpen(false);

  const updateNewEnvelope = (field, value) => {
    setNewEnvelope((prevEnvelope) => ({
      ...prevEnvelope,
      [field]: value,
    }));
  };

  const addSignatory = () => {
    setNewEnvelope((prevEnvelope) => ({
      ...prevEnvelope,
      signatories: [...prevEnvelope.signatories, { name: "", email: "" }],
    }));
  };

  const updateSignatory = (index, field, value) => {
    const updatedSignatories = newEnvelope.signatories.map((signatory, i) =>
      i === index ? { ...signatory, [field]: value } : signatory
    );
    setNewEnvelope((prevEnvelope) => ({
      ...prevEnvelope,
      signatories: updatedSignatories,
    }));
  };

  const createEnvelope = async () => {
    if (!newEnvelope.file) {
      setMessage("Por favor, selecione um arquivo para o documento.");
      return;
    }

    try {
      setLoading(true);
      const base64File = await readFileAsBase64(newEnvelope.file);

      const envelopeParams = {
        Envelope: {
          descricao: newEnvelope.description,
          Repositorio: { id: newEnvelope.repositoryId },
          listaDocumentos: {
            Documento: [
              {
                nomeArquivo: newEnvelope.file.name,
                mimeType: newEnvelope.file.type,
                conteudo: base64File,
              },
            ],
          },
          listaSignatariosEnvelope: {
            SignatarioEnvelope: newEnvelope.signatories.map(
              (signatory, index) => ({
                ordem: index + 1,
                ConfigAssinatura: {
                  emailSignatario: signatory.email,
                  nomeSignatario: signatory.name,
                  tipoAssinatura: 1,
                  permitirDelegar: "N",
                  apenasCelular: "N",
                  exigirLogin: "N",
                  exigirCodigo: "N",
                  exigirDadosIdentif: "N",
                  assinaturaPresencial: "N",
                  incluirImagensAutentEnvelope: "N",
                  analisarFaceImagem: "N",
                  percentualPrecisaoFace: 0,
                  intervaloPaginaDesenho: "1,3,4-10",
                },
              })
            ),
          },
          incluirHashTodasPaginas: "S",
          permitirDespachos: "S",
          ignorarNotificacoes: "N",
          ignorarNotificacoesPendentes: "N",
          bloquearDesenhoPaginas: "S",
        },
        gerarTags: "S",
        encaminharImediatamente: "N",
        detectarCampos: "N",
        verificarDuplicidadeConteudo: "N",
        processarImagensEmSegundoPlano: "N",
      };

      const envelopeResponse = await fetchService("inserirEnvelope", envelopeParams);
      if (envelopeResponse?.response) {
        setMessage("Envelope criado com sucesso!");
        closeCreateEnvelopeModal();
      } else if (envelopeResponse?.error) {
        setMessage(`Erro ao criar envelope: ${JSON.stringify(envelopeResponse.error)}`);
      }
    } catch (error) {
      setMessage("Erro ao criar envelope");
      console.error("Error creating envelope:", error);
    } finally {
      setLoading(false);
    }
  };

  const encaminharEnvelopeParaAssinaturas = async (idEnvelope) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchService("encaminharEnvelopeParaAssinaturas", {
        Envelope: { id: idEnvelope },
        agendarEnvio: "N",
        detectarCampos: "N",
        dataEnvioAgendado: null,
        horaEnvioAgendado: null,
      });
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const expurgarEnvelope = async (idEnvelope) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchService("expurgarEnvelope", { idEnvelope });
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const pesquisarEnvelope = async (textoPesquisa) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchService("pesquisarEnvelopes", {
        textoPesquisa,
        pesquisarEmTags: "S",
        pesquisarEmEnvelopes: "S",
        pesquisarEmSignatarios: "S",
        considerarStatus: "S",
        valoresStatus: "1,2",
        maxRegistros: 10,
      });
      if (response?.response) {
        setDocumentList(response.response);
        if (response.response.length > 0) {
          setSelectedDocument(response.response[0]);
          openModal();
        }
      } else {
        setMessage("Nenhum documento encontrado.");
      }
    } catch (err) {
      setError(err);
      setMessage("Erro ao consultar documentos.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSignatariosPorEnvelope = async (idEnvelope) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchService("getSignatariosPorEnvelope", { idEnvelope });
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadPDFEnvelope = async (hashSHA256) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchService("downloadPDFEnvelope", {
        hashSHA256,
        incluirDocs: "N",
        versaoSemCertificado: null,
      });
      return response?.response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const openDocumentDetails = (document) => {
    setSelectedDocument(document);
    openModal();
  };

  return {
    documentList,
    message,
    isModalOpen,
    isCreateEnvelopeModalOpen,
    loading,
    error,
    selectedDocument,
    openModal,
    closeModal,
    openCreateEnvelopeModal,
    closeCreateEnvelopeModal,
    newEnvelope,
    updateNewEnvelope,
    addSignatory,
    updateSignatory,
    createEnvelope,
    encaminharEnvelopeParaAssinaturas,
    expurgarEnvelope,
    pesquisarEnvelope,
    getSignatariosPorEnvelope,
    downloadPDFEnvelope,
    openDocumentDetails,
  };
};

export default useDocuments;
export { getStatusDescription };
