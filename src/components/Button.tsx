"use client";

import { useRouter } from "next/navigation";

type Props = {
  text: string;
  disabled?: boolean;
  handleClick?: () => void;
  redirect?: string;
};

function Button({ text, disabled, handleClick, redirect }: Props): JSX.Element {
  const router = useRouter();

  const btnStyle = disabled
    ? "bg-gray-300"
    : "border-base-secondary bg-base-secondary hover:opacity-75 rounded-md transtion-all duration-500";

  function handleButtonClick() {
    if (handleClick !== undefined) {
      handleClick();
    }
    if (redirect !== undefined) {
      router.push(redirect);
    }
  }

  return (
    <button
      disabled={disabled}
      className={`${btnStyle} border px-3 py-2 text-white text-sm sm:text-base`}
      onClick={handleButtonClick}
    >
      {text}
    </button>
  );
}

export default Button;
