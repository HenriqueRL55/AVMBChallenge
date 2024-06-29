import { useState } from "react";

const useDocuments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEnvelope, setNewEnvelope] = useState({
    file: null,
    description: "",
    repositoryId: "",
    signatories: [{ name: "", email: "" }]
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const updateNewEnvelope = (field, value) => {
    setNewEnvelope((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSignatory = () => {
    setNewEnvelope((prev) => ({
      ...prev,
      signatories: [...prev.signatories, { name: "", email: "" }],
    }));
  };

  const updateSignatory = (index, field, value) => {
    const newSignatories = [...newEnvelope.signatories];
    newSignatories[index][field] = value;
    setNewEnvelope((prev) => ({
      ...prev,
      signatories: newSignatories,
    }));
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    newEnvelope,
    updateNewEnvelope,
    addSignatory,
    updateSignatory
  };
};

export default useDocuments;
