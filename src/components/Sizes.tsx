import { useState } from "react";

const SIZES = ["2XS", "XS", "M", "L", "2XL"];

type Props = {
  chosenSize: number;
  setChosenSize: (index: number) => void;
};

function Sizes({ chosenSize, setChosenSize }: Props): JSX.Element {
  const [available, setAvailable] = useState<boolean[]>( // API doesn't support sizing
    new Array(SIZES.length).fill(false)
  );
  const availableStyle =
    "hover:bg-base-secondary hover:text-white border-base-secondary\
     text-base-secondary";
  const notAvailableStyle = "disabled bg-gray-300"; //should be disabled

  return (
    <div className="flex gap-2 mt-10 mx-auto lg:mx-0">
      {SIZES.map((size, index) => {
        return (
          <button
            key={index}
            className={`rounded-md px-4 py-1 font-l border w-fit lg:w-[4rem] 
            ${available ? availableStyle : notAvailableStyle}
            ${chosenSize === index && "bg-base-secondary text-white"}        
            `}
            onClick={() => {
              setChosenSize(index);
            }}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

export default Sizes;
