"use client";

import GridDisplay from "../gridDisplay/GridDisplay";
import AllItems from "../allItems/AllItems";
import SortButton from "../sortButton/SortButton";

import { DEFAULT_HOMEPAGE_CATEGORY } from "@/constants";
import { useState } from "react";
import Title from "../title/Title";

type Props = {
  title: string;
  category?: string;
  limit?: number;
};

function ItemsAndTitle({
  title,
  category = DEFAULT_HOMEPAGE_CATEGORY,
  limit,
}: Props): JSX.Element {
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
    <div className="bg-white">
      <Title title={title} />
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
        <AllItems
          gridDisplay={gridDisplay}
          sortPriceDescending={sortPriceDescending}
          category={category}
          limit={limit}
        />
      </div>
    </div>
  );
}

export default ItemsAndTitle;
