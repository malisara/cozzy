"use client";

import GridDisplay from "../gridDisplay/GridDisplay";
import Items from "../items/Items";
import SortButton from "../sortButton/SortButton";

import { useState } from "react";

type Props = {
  category?: string;
  limit?: number;
};

function ItemsDisplay({ category, limit }: Props): JSX.Element {
  const [gridDisplay, setGridDisplay] = useState<boolean>(true);
  const [sortPriceDescending, setsortPriceDescending] =
    useState<boolean>(false);

  function changeItemsDisplay(value: boolean) {
    setGridDisplay(value);
  }

  function changeSorting(value: boolean) {
    setsortPriceDescending(value);
  }

  return (
    <>
      <div
        className="px-4 h-fit w-full flex flex-wrap 
      justify-center gap-6 mb-6"
      >
        <SortButton onSortChange={changeSorting} />
        <GridDisplay
          onDisplayChange={changeItemsDisplay}
          gridDisplay={gridDisplay}
        />
      </div>

      <div className="pt-16 pb-[7rem] px-10 lg:px-[13rem]">
        <Items
          gridDisplay={gridDisplay}
          sortPriceDescending={sortPriceDescending}
          category={category}
          limit={limit}
        />
      </div>
    </>
  );
}

export default ItemsDisplay;
