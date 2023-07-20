"use client";
import { TfiViewGrid, TfiViewList } from "react-icons/tfi";

type Props = {
  onDisplayChange: (value: boolean) => void;
  gridDisplay: boolean;
};

function GridDisplay({ onDisplayChange, gridDisplay }: Props): JSX.Element {
  const chosenIcon = "bg-gray-200 py-2 px-2 border border-black duration-300";

  return (
    <div className="flex h-fit items-center gap-3">
      <p className="font-bold text-sm uppercase text-black">Display:</p>
      <button
        onClick={() => onDisplayChange(true)}
        className={gridDisplay ? chosenIcon : ""}
      >
        <TfiViewGrid />
      </button>
      <button
        onClick={() => onDisplayChange(false)}
        className={!gridDisplay ? chosenIcon : ""}
      >
        <TfiViewList />
      </button>
    </div>
  );
}

export default GridDisplay;
