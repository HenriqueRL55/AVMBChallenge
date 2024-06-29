import { useState, useEffect } from "react";
import { db, auth } from "../services/firebase";
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import fetchService from "../services/api/documentAPI";
import { readFileAsBase64 } from "../utils/fileUtils";

const useDocuments = () => {
  const [documentList, setDocumentList] = useState([]);
  const [message, setMessage] = useState("");

  const documentsCollectionRef = collection(db, "documentList");

  const getDocumentList = async () => {
    try {
      const data = await getDocs(documentsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocumentList(filteredData);
    } catch (error) {
      setMessage("Erro ao buscar a lista de documentos");
      console.error("Error fetching document list:", error);
    }
  };

  useEffect(() => {
    getDocumentList();
  }, []);

  const createEnvelope = async (newDocumentTitle, newDocumentFile, newDocumentReceiver, newDocumentSignatory) => {
    if (!newDocumentFile) {
      setMessage("Por favor, selecione um arquivo para o documento.");
      return;
    }

    try {
      const base64File = await readFileAsBase64(newDocumentFile);

      const envelopeParams = {
        descricao: newDocumentTitle,
        documentos: [
          {
            nome: newDocumentFile.name,
            conteudo: base64File,
          }
        ],
        signatarios: [
          {
            nome: newDocumentSignatory,
            email: newDocumentReceiver,
            tipoAcao: 1,
            opcaoAutenticacao: 1,
            ordem: 1
          }
        ]
      };

      const requestBody = {
        token: "f+DbjFvlxGF5QypP2huHk2OOJfr1FyeQ79p1tt3JCiIoH93GbnkwxF6S60yFQoZwYCzUwZVb-Lk9KvOx1EDnvhGs8MXNidUcPQw5+EclkXS1jSzvfVEfoyCiWb7+8ScBa4qjsdt6Loe9UxdLSsMXyKnFROFIMGxC",
        params: envelopeParams
      };

      const envelopeResponse = await fetchService('inserirEnvelope', requestBody);
      if (envelopeResponse?.response) {
        setMessage("Envelope criado e enviado com sucesso!");
        await addDoc(documentsCollectionRef, {
          ...envelopeResponse.response,
          userId: auth?.currentUser.uid,
        });
        getDocumentList();
      } else if (envelopeResponse?.error) {
        setMessage(`Erro ao criar envelope: ${JSON.stringify(envelopeResponse.error)}`);
      }
    } catch (error) {
      setMessage("Erro ao ler o arquivo");
      console.error("Error reading file:", error);
    }
  };

  const deleteDocument = async (id) => {
    try {
      const documentDoc = doc(db, "documentList", id);
      await deleteDoc(documentDoc);
      setMessage("Documento deletado com sucesso!");
      getDocumentList();
    } catch (error) {
      setMessage("Erro ao deletar documento");
      console.error("Error deleting document:", error);
    }
  };

  const updateDocumentTitle = async (id, updateDocumentTitle) => {
    try {
      const documentDoc = doc(db, "documentList", id);
      await updateDoc(documentDoc, {
        nome: updateDocumentTitle,
      });
      setMessage("Título do documento atualizado com sucesso!");
      getDocumentList();
    } catch (error) {
      setMessage("Erro ao atualizar título do documento");
      console.error("Error updating document title:", error);
    }
  };

  return {
    documentList,
    message,
    createEnvelope,
    deleteDocument,
    updateDocumentTitle,
  };
};

export default useDocuments;
