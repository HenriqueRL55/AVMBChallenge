import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../../services/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useAuth } from "./../../services/auth";
import fetchService from "../../services/api/documentAPI";

export const HomePage = () => {
  const [documentList, setDocumentList] = useState([]);
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [newDocumentStatus, setNewDocumentStatus] = useState("");
  const [newDocumentReceiver, setNewDocumentReceiver] = useState("");
  const [newDocumentSignatory, setNewDocumentSignatory] = useState("");
  const [newDocumentFile, setNewDocumentFile] = useState(null);
  const [updateDocumentTitle, setUpdateDocumentTitle] = useState("");
  const [message, setMessage] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const { logout } = useAuth();
  const documentsCollectionRef = collection(db, "documentList");

  const getDocumentList = async () => {
    try {
      const data = await getDocs(documentsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocumentList(filteredData);
      console.log("Document list fetched successfully", filteredData);
    } catch (error) {
      console.error("Error fetching document list:", error);
      setMessage("Erro ao buscar a lista de documentos");
    }
  };

  useEffect(() => {
    getDocumentList();
  }, []);

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]); 
      };
      reader.onerror = reject;
      reader.readAsDataURL(file); 
    });
  };

  const createEnvelope = async () => {
    if (!newDocumentFile) {
      setMessage("Por favor, selecione um arquivo para o documento.");
      return;
    }

    try {
      const base64File = await readFileAsBase64(newDocumentFile);

      const envelopeParams = {
        titulo: newDocumentTitle,
        documentos: [
          {
            nome: newDocumentFile.name,
            conteudo: base64File,
            tipo: newDocumentFile.type,
          }
        ]
      };

      const requestBody = {
        token: "f+DbjFvlxGF5QypP2huHk2OOJfr1FyeQ79p1tt3JCiIoH93GbnkwxF6S60yFQoZwYCzUwZVb-Lk9KvOx1EDnvhGs8MXNidUcPQw5+EclkXS1jSzvfVEfoyCiWb7+8ScBa4qjsdt6Loe9UxdLSsMXyKnFROFIMGxC",
        params: envelopeParams
      };

      const envelopeResponse = await fetchService('inserirEnvelope', requestBody);
      if (envelopeResponse?.response) {
        const { idEnvelope } = envelopeResponse.response;
        setApiResponse(envelopeResponse.response);

    
        const signatoryParams = {
          idEnvelope: idEnvelope,
          signatarios: [
            {
              nome: newDocumentSignatory,
              email: newDocumentReceiver,
              tipoAssinatura: 1 
            }
          ]
        };
        const signatoryRequestBody = {
          token: "f+DbjFvlxGF5QypP2huHk2OOJfr1FyeQ79p1tt3JCiIoH93GbnkwxF6S60yFQoZwYCzUwZVb-Lk9KvOx1EDnvhGs8MXNidUcPQw5+EclkXS1jSzvfVEfoyCiWb7+8ScBa4qjsdt6Loe9UxdLSsMXyKnFROFIMGxC",
          params: signatoryParams
        };
        const signatoryResponse = await fetchService('inserirSignatarioEnvelope', signatoryRequestBody);
        if (signatoryResponse?.response) {
          const encaminharParams = { idEnvelope: idEnvelope };
          const encaminharRequestBody = {
            token: "f+DbjFvlxGF5QypP2huHk2OOJfr1FyeQ79p1tt3JCiIoH93GbnkwxF6S60yFQoZwYCzUwZVb-Lk9KvOx1EDnvhGs8MXNidUcPQw5+EclkXS1jSzvfVEfoyCiWb7+8ScBa4qjsdt6Loe9UxdLSsMXyKnFROFIMGxC",
            params: encaminharParams
          };
          const encaminharResponse = await fetchService('encaminharEnvelopeParaAssinaturas', encaminharRequestBody);
          if (encaminharResponse?.response) {
            setMessage("Envelope criado e enviado com sucesso!");
            await addDoc(documentsCollectionRef, {
              ...encaminharResponse.response,
              userId: auth?.currentUser.uid,
            });
            getDocumentList();
          } else if (encaminharResponse?.error) {
            setMessage(`Erro ao encaminhar envelope: ${encaminharResponse.error}`);
          }
        } else if (signatoryResponse?.error) {
          setMessage(`Erro ao inserir signatário: ${signatoryResponse.error}`);
        }
      } else if (envelopeResponse?.error) {
        setMessage(`Erro ao criar envelope: ${envelopeResponse.error}`);
      }
    } catch (error) {
      console.error("Error reading file:", error);
      setMessage("Erro ao ler o arquivo");
    }
  };

  const deleteDocument = async (id) => {
    try {
      const documentDoc = doc(db, "documentList", id);
      await deleteDoc(documentDoc);
      setMessage("Documento deletado com sucesso!");
      getDocumentList();
    } catch (error) {
      console.error("Error deleting document:", error);
      setMessage("Erro ao deletar documento");
    }
  };

  const updatedDocumentTitle = async (id) => {
    try {
      const documentDoc = doc(db, "documentList", id);
      await updateDoc(documentDoc, {
        nome: updateDocumentTitle,
      });
      setMessage("Título do documento atualizado com sucesso!");
      getDocumentList();
    } catch (error) {
      console.error("Error updating document title:", error);
      setMessage("Erro ao atualizar título do documento");
    }
  };

  const uploadFile = async () => {
    if (fileUpload == null) return;
    const fileFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(fileFolderRef, fileUpload);
      setMessage("Arquivo enviado com sucesso!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Erro ao enviar arquivo");
    }
  };

  return (
    <div>
      <button onClick={logout}>Sair</button>

      <div>
        <input
          placeholder="Título"
          onChange={(e) => setNewDocumentTitle(e.target.value)}
        />
        <input
          placeholder="Destinatário"
          onChange={(e) => setNewDocumentReceiver(e.target.value)}
        />
        <input
          placeholder="Signatário"
          onChange={(e) => setNewDocumentSignatory(e.target.value)}
        />
        <input
          type="file"
          placeholder="Arquivo do Documento"
          onChange={(e) => setNewDocumentFile(e.target.files[0])}
        />
        <input
          placeholder="Status"
          onChange={(e) => setNewDocumentStatus(e.target.value)}
        />
        <button onClick={createEnvelope}>Criar Envelope</button>
      </div>

      {message && <p>{message}</p>}

      <div>
        {documentList.map((document) => (
          <div key={document.id}>
            <h1>{document.nome}</h1>
            <p>{document.status}</p>
            <button onClick={() => deleteDocument(document.id)}>Deletar</button>
            <input
              placeholder="Novo Título"
              onChange={(e) => setUpdateDocumentTitle(e.target.value)}
            />
            <button onClick={() => updatedDocumentTitle(document.id)}>
              Atualizar Título
            </button>
          </div>
        ))}
      </div>

      <div>
        {apiResponse && <pre>{JSON.stringify(apiResponse, null, 2)}</pre>}
      </div>
    </div>
  );
};
