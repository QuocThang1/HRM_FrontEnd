import { useState } from "react";

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [selectedData, setSelectedData] = useState(null);

  const open = (data = null) => {
    setSelectedData(data);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedData(null);
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    selectedData,
    open,
    close,
    toggle,
  };
};

export default useModal;
