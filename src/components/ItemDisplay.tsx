"use client";

import { Dispatch, SetStateAction } from "react";
import { TfiViewGrid, TfiViewList } from "react-icons/tfi";

const chosenIcon = "bg-gray-200 py-2 px-2 border border-black duration-300";

type Props = {
  onDisplayChange: Dispatch<SetStateAction<boolean>>;
  hasGridDisplay: boolean;
};

function ItemDisplay({ onDisplayChange, hasGridDisplay }: Props): JSX.Element {
  return (
    <div className="flex h-fit items-center gap-3">
      <p className="font-bold text-sm uppercase text-black">Display:</p>
      <button
        onClick={() => onDisplayChange(true)}
        className={hasGridDisplay ? chosenIcon : ""}
      >
        <TfiViewGrid />
      </button>
      <button
        onClick={() => onDisplayChange(false)}
        className={!hasGridDisplay ? chosenIcon : ""}
      >
        <TfiViewList />
      </button>
    </div>
  );
}

export default ItemDisplay;
