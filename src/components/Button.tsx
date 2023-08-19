type Props = {
  text: string;
  disabled?: boolean;
  handleClick?: () => void;
};

function Button({ text, disabled, handleClick }: Props): JSX.Element {
  const btnStyle = disabled
    ? "bg-gray-300"
    : "border-base-secondary bg-base-secondary hover:opacity-75 rounded-md transtion-all duration-500";

  return (
    <button
      disabled={disabled}
      className={`${btnStyle} border px-3 py-2 text-white`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

export default Button;
