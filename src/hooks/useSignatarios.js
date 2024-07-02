// React Hooks
import { useState } from "react";
// API Services
import fetchService from "../services/api/documentAPI";

const useSignatarios = () => {
  const [signatarios, setSignatarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtém os signatários de um envelope específico
  const getSignatariosPorEnvelope = async (idEnvelope) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchService("getSignatariosPorEnvelope", {
        idEnvelope,
      });
      setSignatarios(response.response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os dados de um signatário de envelope
  const atualizarSignatarioEnvelope = async (signatarioEnvelope) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchService("atualizarSignatarioEnvelope", {
        SignatarioEnvelope: signatarioEnvelope,
      });
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Exclui um signatário de envelope
  const excluirSignatarioEnvelope = async (idSignatarioEnv) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchService("excluirSignatarioEnvelope", {
        idSignatarioEnv,
        exclusaoDeGrupo: "N",
      });
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Insere um novo signatário em um envelope
  const inserirSignatarioEnvelope = async (signatarioEnvelope) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchService("inserirSignatarioEnvelope", {
        SignatarioEnvelope: signatarioEnvelope,
      });
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signatarios,
    loading,
    error,
    getSignatariosPorEnvelope,
    atualizarSignatarioEnvelope,
    excluirSignatarioEnvelope,
    inserirSignatarioEnvelope,
  };
};

export default useSignatarios;
