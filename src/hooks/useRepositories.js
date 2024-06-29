import { useState, useEffect } from "react";
import fetchService from "../services/api/documentAPI";

const useRepositories = () => {
  const [repositoryList, setRepositoryList] = useState([]);
  const [message, setMessage] = useState("");

  const getRepositories = async () => {
    try {
      const repositoryParams = {
        idProprietario: 31810,
      };

      const repositoryResponse = await fetchService(
        "getRepositoriosDoUsuario",
        repositoryParams
      );
      if (repositoryResponse?.response) {
        setRepositoryList(repositoryResponse.response);
      } else if (repositoryResponse?.error) {
        setMessage(
          `Erro ao buscar repositórios: ${JSON.stringify(
            repositoryResponse.error
          )}`
        );
      }
    } catch (error) {
      setMessage("Erro ao buscar repositórios");
      console.error("Error fetching repositories:", error);
    }
  };

  const createRepository = async (newRepositoryName) => {
    try {
      const repositoryParams = {
        Repositorio: {
          Usuario: { id: "31810" },
          nome: newRepositoryName,
          compartilharCriacaoDocs: "S",
          compartilharVisualizacaoDocs: "S",
          ocultarEmailSignatarios: "N",
          opcaoValidCodigo: "S",
          opcaoValidCertICP: "S",
          opcaoValidDocFoto: "S",
          opcaoValidDocSelfie: "S",
          opcaoValidTokenSMS: "S",
          opcaoValidLogin: "S",
          opcaoValidReconhecFacial: "S",
          opcaoValidPix: "S",
          lembrarAssinPendentes: "S",
        },
      };

      const repositoryResponse = await fetchService(
        "inserirRepositorio",
        repositoryParams
      );
      if (repositoryResponse?.response) {
        setMessage("Repositório criado com sucesso!");
        getRepositories();
      } else if (repositoryResponse?.error) {
        setMessage(
          `Erro ao criar repositório: ${JSON.stringify(
            repositoryResponse.error
          )}`
        );
      }
    } catch (error) {
      setMessage("Erro ao criar repositório");
      console.error("Error creating repository:", error);
    }
  };

  const getEnvelopesByRepository = async (repositoryId) => {
    try {
      const envelopesParams = {
        idRepositorio: repositoryId,
      };
      const envelopesResponse = await fetchService(
        "getEnvelopesByRepositorioOuPasta",
        envelopesParams
      );
      if (envelopesResponse?.response) {
        const envelopesWithStatus = await Promise.all(
          envelopesResponse.response.map(async (envelope) => {
            const envelopeDetailsParams = {
              idEnvelope: envelope.id,
              getLobs: "N",
            };
            const envelopeDetailsResponse = await fetchService(
              "getDadosEnvelope",
              envelopeDetailsParams
            );
            if (envelopeDetailsResponse?.response) {
              return {
                ...envelope,
                status: envelopeDetailsResponse.response.status,
              };
            }
            return envelope;
          })
        );
        return envelopesWithStatus;
      } else {
        setMessage(
          `Erro ao buscar envelopes: ${JSON.stringify(envelopesResponse.error)}`
        );
        return [];
      }
    } catch (error) {
      setMessage("Erro ao buscar envelopes");
      console.error("Error fetching envelopes:", error);
      return [];
    }
  };

  useEffect(() => {
    getRepositories();
  }, []);

  return {
    repositoryList,
    message,
    createRepository,
    getEnvelopesByRepository,
  };
};

export default useRepositories;
