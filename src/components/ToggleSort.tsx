"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

export const filters = [
  { id: 0, title: "lower price first" },
  { id: 1, title: "highest price first" },
];

type Props = {
  onSortChange: Dispatch<SetStateAction<boolean>>;
};

function SortButton({ onSortChange }: Props): JSX.Element {
  const [[dropDownOpen, currentFilterId], setDropDownOpen] = useState<
    [boolean, number]
  >([false, 0]);

  const currentFilter = filters.find((sort) => sort.id === currentFilterId);

  return (
    <div className="relative w-fit">
      <button
        className="flex px-6 py-2 text-sm text-black border
         border-black hover:bg-gray-100"
        onClick={() => setDropDownOpen((prev) => [!prev[0], prev[1]])}
        data-testid="sortByPriceBtn"
      >
        <span className="uppercase font-bold">sort by:&nbsp; </span>
        {currentFilter && currentFilter.title}
        <span className="ml-2">
          {dropDownOpen ? <BiUpArrow /> : <BiDownArrow />}
        </span>
      </button>
      {dropDownOpen && (
        <>
          <ul className="absolute rounded-md shadow-lg w-full bg-white">
            {filters.map((data) => {
              return (
                <li
                  key={data.id}
                  aria-current={data.id === currentFilterId}
                  className={`[&[aria-current='true']]:bg-gray-200
                  [&[aria-current='true']]:text-black
                  text-gray-600`}
                  onClick={() => onSortChange(Boolean(data.id))}
                >
                  <button
                    className="block w-full px-4 py-2 text-xs\
                     hover:text-black active:no-underline"
                    onClick={() => setDropDownOpen(() => [false, data.id])}
                  >
                    {data.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default SortButton;
