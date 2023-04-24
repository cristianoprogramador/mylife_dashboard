import { useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    // position: "fixed",
    borderRadius: 10,
    zIndex: 9999,
    overflow: "auto",
    maxHeight: "calc(100vh - 250px)",
  },
};

interface StateProps {
  Data: number;
  Descrição: string;
  Obs: string;
  Tipo: string;
  Valor: number;
  Cartão: string;
}

interface MiniModalProps {
  title: string;
  state: StateProps;
}

export function ModalUpdate({ state, title }: MiniModalProps) {
  console.log(state);
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function handleNavigation() {
    setIsOpen(false);
  }

  function closeModal(address: any) {
    console.log(address);
    setIsOpen(false);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <button onClick={openModal}>
        <AiOutlineEdit size={20} />
      </button>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <div>
            <h2>Endereço do Evento</h2>
            <div>
              <div>Rua: </div>
              <div>Número: </div>
              <div>Bairro: </div>
              <div>Cidade: </div>
            </div>
          </div>
        </div>
        <div>
          <button onClick={() => handleNavigation()}>Fechar</button>
        </div>
      </Modal>
    </>
  );
}
