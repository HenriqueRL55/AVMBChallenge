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

export const HomePage = () => {
  const [documentList, setDocumentList] = useState([]);

  // Criação de um novo documento
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [newDocumentStatus, setNewDocumentStatus] = useState("");
  const [newDocumentReceiver, setNewDocumentReceiver] = useState("");

  // Atualiza um documento
  const [updateDocumentTitle, setUpdateDocumentTitle] = useState("");

  // File upload State
  const [fileUpload, setFileUpload] = useState(null);

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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDocumentList();
  }, []);

  const onSubmitDocument = async () => {
    try {
      await addDoc(documentsCollectionRef, {
        nome: newDocumentTitle,
        status: newDocumentStatus,
        destinatario: newDocumentReceiver,
        userId: auth?.currentUser.uid,
      });
      getDocumentList();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDocument = async (id) => {
    try {
      const documentDoc = doc(db, "documentList", id);
      await deleteDoc(documentDoc);
      getDocumentList();
    } catch (error) {
      console.error(error);
    }
  };

  const updatedDocumentTitle = async (id) => {
    try {
      const documentDoc = doc(db, "documentList", id);
      await updateDoc(documentDoc, {
        nome: updateDocumentTitle,
      });
      getDocumentList();
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async () => {
    if (fileUpload == null) return;
    const fileFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(fileFolderRef, fileUpload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={logout}>Sair</button>

      <div>
        <input
          placeholder="Titulo"
          onChange={(e) => setNewDocumentTitle(e.target.value)}
        />
        <input
          placeholder="Destinatário"
          onChange={(e) => setNewDocumentReceiver(e.target.value)}
        />
        <input
          placeholder="Status"
          onChange={(e) => setNewDocumentStatus(e.target.value)}
        />
        <button onClick={onSubmitDocument}>Adicionar</button>
      </div>

      <div>
        {documentList.map((document) => (
          <div key={document.id}>
            <h1>{document.nome}</h1>
            <p>{document.status}</p>
            <button onClick={() => deleteDocument(document.id)}>Deletar</button>
            <input
              placeholder="Novo Titulo"
              onChange={(e) => setUpdateDocumentTitle(e.target.value)}
            />
            <button onClick={() => updatedDocumentTitle(document.id)}>
              Atualizar Título
            </button>
          </div>
        ))}
      </div>

      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Adicionar Documento</button>
      </div>
    </div>
  );
};
