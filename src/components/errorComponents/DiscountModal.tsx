import { Dispatch, SetStateAction, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import ReactModal from "react-modal";

import { useGlobalContext } from "@/context/GlobalContext";
import { DISCOUNT_CODES } from "@/constants";

type Props = {
  modalIsOpen: boolean;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

function DiscountModal({ modalIsOpen, setModalIsOpen }: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const { setDiscount, discount } = useGlobalContext();

  const modalBtnStyle = btnDisabled
    ? "bg-gray-400"
    : "border-base-secondary bg-base-secondary hover:opacity-75 rounded-md \
    transtion-all duration-500 border";

  function handleDiscountCodeChange(
    e: React.FormEvent<HTMLInputElement>
  ): void {
    if (e.currentTarget.value.trim().length > 0) {
      setDiscount(0); //resets invalid code text
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }

  function handleDiscountCodeSubmit(
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ): void {
    e.preventDefault();
    const inputValue = inputRef.current?.value;
    if (inputValue && inputValue in DISCOUNT_CODES) {
      setDiscount(DISCOUNT_CODES[inputValue as keyof typeof DISCOUNT_CODES]);
      setModalIsOpen(false);
    } else {
      setDiscount(-1);
    }
  }

  function closeModal(): void {
    setDiscount(0);
    setModalIsOpen(false);
  }

  return (
    <ReactModal
      isOpen={modalIsOpen}
      className="transition-opacity ease-in-out duration-600"
      ariaHideApp={false}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => setModalIsOpen(false)}
    >
      <div
        className="px-4 py-10 bg-white/60 w-[70%] lg:w-[25%] top-[15rem]
        rounded-lg border border-gray-400 absolute left-1/2 transform
        -translate-x-1/2 text-center"
      >
        <button
          className="absolute top-4 right-4 hover:text-base-secondary
        text-gray-700 text-2xl"
          onClick={closeModal}
        >
          <AiOutlineClose />
        </button>

        <div className="text-xl mb-2">Discount</div>
        <div className="mb-2 text-sm">Enter discount code</div>

        <form className="flex flex-wrap mt-5">
          <input
            ref={inputRef}
            className="border border-gray-400 h-[2.5rem] rounded-lg
            w-[95%] lg:w-[75%] mx-auto px-2"
            onChange={(e) => handleDiscountCodeChange(e)}
            data-testid="discountInput"
          />
          <button
            disabled={btnDisabled}
            className={` ${modalBtnStyle} w-[95%] lg:w-[20%] py-1
           text-white mt-2 lg:mt-0 mx-auto`}
            onClick={(e) => handleDiscountCodeSubmit(e)}
          >
            add
          </button>
        </form>
        {discount === -1 && (
          <div className="mt-2 text-red-400 text-sm">Invalid code</div>
        )}
      </div>
    </ReactModal>
  );
}

export default DiscountModal;
