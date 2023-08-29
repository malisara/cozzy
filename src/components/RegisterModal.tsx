import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { AiOutlineClose } from "react-icons/ai";
import ReactModal from "react-modal";

type Props = {
  modalIsOpen: boolean;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

function RegisterModal({ modalIsOpen, setModalIsOpen }: Props) {
  return (
    <div>
      <ReactModal
        isOpen={modalIsOpen}
        className="transition-opacity ease-in-out duration-600"
        ariaHideApp={false}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <div
          className="px-4 py-10 bg-white/60 w-[80%] lg:w-[45%] h-60
           top-[15rem] transform -translate-x-1/2 text-center
           rounded-lg border border-gray-400 absolute left-1/2 "
        >
          <button
            className="absolute top-4 right-4 hover:text-base-secondary
             text-gray-700 text-2xl"
            onClick={() => {
              setModalIsOpen(false);
            }}
          >
            <AiOutlineClose />
          </button>
          <div
            className="text-base font-bold mb-4 flex
           flex-col gap-5 text-gray-600"
          >
            Awesome, your account is up and running.
            <p className="text-2xl">Welcome to the family!</p>
            <Link
              href={"/login"}
              className="underline text-base-secondary
               hover:text-base-secondary/75"
            >
              Login here
            </Link>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}

export default RegisterModal;
