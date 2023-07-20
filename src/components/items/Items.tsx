"use client";
import { useEffect, useState } from "react";
import SingleItem from "../singleItem/SingleItem";
import Item from "@/models/item";

type Props = {
  gridDisplay: boolean;
  sortPriceDescending: boolean;
  category?: string;
};

function Items({
  gridDisplay,
  sortPriceDescending,
  category,
}: Props): JSX.Element {
  const lineDisplayStyle = "flex-nowrap overflow-x-auto"; // TODO
  const gridDisplayStyle = "flex-wrap justify-center";
  const [itemsToDisplay, setItemsToDisplay] = useState<Item[]>([]);

  useEffect(() => {
    let apiUrl = "https://fakestoreapi.com/products";

    if (category) {
      apiUrl += `/category/${category}`;
    }
    fetch(`${apiUrl}`)
      .then((response) => response.json())
      .then((data) => {
        const items: Item[] = data.map((itemObj: any) => {
          return new Item(
            itemObj.id,
            itemObj.title,
            itemObj.price,
            itemObj.image
          );
        });

        setItemsToDisplay(sortItems(items));
      });
  }, []);

  useEffect(() => {
    const items = [...itemsToDisplay];
    setItemsToDisplay(sortItems(items));
  }, [sortPriceDescending]);

  function sortItems(items: Item[]): Item[] {
    if (sortPriceDescending === true) {
      items.sort((a, b) => b.price - a.price);
    } else {
      items.sort((a, b) => a.price - b.price);
    }
    return items;
  }

  return (
    <div
      className={`${
        gridDisplay ? gridDisplayStyle : lineDisplayStyle
      } flex gap-[5rem]`}
    >
      {itemsToDisplay.map((item: any) => {
        return <SingleItem item={item} key={item.id} />;
      })}
    </div>
  );
}

export default Items;
