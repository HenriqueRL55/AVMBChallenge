import React, { useState } from "react";

const DocumentList = ({
  documentList,
  deleteDocument,
  updateDocumentTitle,
  setUpdateDocumentTitle,
}) => {
  return (
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
          <button onClick={() => updateDocumentTitle(document.id)}>
            Atualizar Título
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
