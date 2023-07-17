"use client";
import React, { useState } from "react";
import { TfiViewGrid, TfiViewList } from "react-icons/tfi";

type Props = {};

function GridDisplay({}: Props) {
  const [gridDisplay, setGridDisplay] = useState<boolean>(true);
  const chosenIcon = "bg-gray-200 py-2 px-2 border border-black text-black";

  return (
    <div className="flex h-fit items-center gap-3">
      <p className="font-bold text-sm uppercase text-black">Display:</p>
      <button
        onClick={() => setGridDisplay(true)}
        className={gridDisplay ? chosenIcon : ""}
      >
        <TfiViewGrid />
      </button>
      <button
        onClick={() => setGridDisplay(false)}
        className={!gridDisplay ? chosenIcon : ""}
      >
        <TfiViewList />
      </button>
    </div>
  );
}

export default GridDisplay;
