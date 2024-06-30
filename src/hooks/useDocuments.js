import { useState } from "react";
import fetchService from "../services/api/documentAPI";
import { readFileAsBase64 } from "../utils/fileUtils";

const useDocuments = () => {
  const [documentList, setDocumentList] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newEnvelope, setNewEnvelope] = useState({
    file: null,
    description: "",
    repositoryId: "",
    repositoryName: "",
    signatories: [],
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
        closeModal();
      } else if (envelopeResponse?.error) {
        setMessage(`Erro ao criar envelope: ${JSON.stringify(envelopeResponse.error)}`);
      }
    } catch (error) {
      setMessage("Erro ao criar envelope");
      console.error("Error creating envelope:", error);
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

  const consultarEnvelope = async (envelopeIdOrName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchService("consultarEnvelope", { envelopeIdOrName });
      return response;
    } catch (err) {
      setError(err);
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

  return {
    documentList,
    message,
    isModalOpen,
    loading,
    error,
    openModal,
    closeModal,
    newEnvelope,
    updateNewEnvelope,
    addSignatory,
    updateSignatory,
    createEnvelope,
    encaminharEnvelopeParaAssinaturas,
    expurgarEnvelope,
    consultarEnvelope,
    getSignatariosPorEnvelope,
  };
};

export default useDocuments;
