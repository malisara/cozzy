import { Dispatch, SetStateAction } from "react";

import { SIZES } from "@/constants";

//This component only sets chosen size, and doesn't handle it
//further because API doesn't support sizing
//in-stock data and sizing options are therefore hard coded

const notInStockStyle = "disabled bg-gray-300";
const inStockStyle =
  "hover:bg-base-secondary hover:text-white\
 border-base-secondary text-base-secondary";

type Props = {
  chosenSize: number;
  setChosenSize: Dispatch<SetStateAction<number>>;
  inStock: boolean[];
};

function Sizes({ chosenSize, setChosenSize, inStock }: Props): JSX.Element {
  return (
    <div
      className="flex gap-2 mt-10 mx-auto lg:mx-0"
      data-testid="sizesContainer"
    >
      {SIZES.map((size, index) => {
        return (
          <button
            key={index}
            className={`rounded-md px-4 py-1 font-l border w-fit lg:w-[4rem] 
            ${inStock ? inStockStyle : notInStockStyle}
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
