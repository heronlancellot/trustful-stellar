import { useState } from "react";

export const useModal = () => {
  const [modals, setModals] = useState<Record<string, boolean>>({});

  const openModal = (modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  const isOpen = (modalName: string) => !!modals[modalName];

  return {
    modals,
    openModal,
    closeModal,
    isOpen,
  };
};
