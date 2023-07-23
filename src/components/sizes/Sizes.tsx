import { useState } from "react";

const sizes = ["2XS", "XS", "M", "L", "2XL"];

function Sizes(): JSX.Element {
  const [chosenSize, setChosenSize] = useState<number>(0);
  const [available, setAvailable] = useState<boolean[]>(
    new Array(sizes.length).fill(false)
  );
  const availableStyle =
    "hover:bg-base-secondary hover:text-white border-base-secondary\
     text-base-secondary";
  const notAvailableStyle = "disabled bg-gray-300"; //should be disabled

  return (
    <div className="flex gap-2 mt-10">
      {sizes.map((size, index) => {
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
