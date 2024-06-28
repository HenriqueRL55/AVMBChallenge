import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db } from "./config/firebase";
import { getDocs, collection } from "firebase/firestore";

function App() {
  const [documentList, setDocumentList] = useState([]);

  const documentsColletionRef = collection(db, "documentList");

  useEffect(() => {
    const getDocumentList = async () => {
      try {
        const data = await getDocs(documentsColletionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setDocumentList(filteredData);
      } catch (error) {
        console.error(error);
      }
    };
    getDocumentList();
  }, []);

  return (
    <>
      <div>
        <Auth />

<div>

<input placeholder="Nome"/>
<input placeholder="Destinatário" type="autocomplete"/>
<input placeholder="Status"/>

<button>Adicionar</button>

</div>

        <div>
          {documentList.map((document) => (
            <div>
              <h1>{document.nome}</h1>
              <p>{document.status}</p>
            </div>
          ))}
          </div>
      </div>
    </>
  );
}

export default App;
