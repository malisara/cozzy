"use client";
import { useState } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import { sortByPricedata } from "./sortData";

type Props = {
  onSortChange: (value: boolean) => void;
};

function SortButton({ onSortChange }: Props): JSX.Element {
  const [[dropDownOpen, filter], setDropDownOpen] = useState<[boolean, number]>(
    [false, 0]
  );

  const filterObject = sortByPricedata.find((item) => item.id === filter);
  const filterTitle = filterObject ? filterObject.title : "";
  const liStyle =
    "block w-full px-4 py-2 text-xs hover:text-black active:no-underline";
  return (
    <div className="relative w-fit">
      <button
        className="flex px-6 py-2 text-sm text-black border
         border-black hover:bg-gray-100"
        onClick={() => setDropDownOpen((prev) => [!prev[0], prev[1]])}
      >
        <span className="uppercase font-bold">sort by:&nbsp; </span>
        {filterTitle}

        <span className="ml-2">
          {dropDownOpen ? <BiUpArrow /> : <BiDownArrow />}
        </span>
      </button>
      {dropDownOpen && (
        <>
          <ul className="absolute rounded-md shadow-lg w-full bg-white">
            {sortByPricedata.map((data) => {
              return (
                <li
                  key={data.id}
                  aria-current={data.id === filter}
                  className={`[&[aria-current='true']]:bg-gray-200
                  [&[aria-current='true']]:text-black
                  text-gray-600`}
                  onClick={() => onSortChange(Boolean(data.id))}
                >
                  <button
                    className={`${liStyle}`}
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
