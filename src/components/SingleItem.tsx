"use client";

import Image from "next/image";
import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";

import { useGlobalContext } from "@/context/GlobalContext";
import Item from "@/models/item";

type Props = {
  item: Item;
  handleSaveItem: (id: number) => void;
};
function SingleItem({ item, handleSaveItem }: Props): JSX.Element {
  const { savedItems } = useGlobalContext();

  return (
    <div className="flex flex-col w-[20rem] gap-2 text-start flex-shrink-0">
      <div className="w-full h-[19rem] relative">
        <Link href={`/item/${item.id}`}>
          <Image
            src={item.image}
            className="object-contain w-full h-full 
            hover:scale-110 duration-300"
            width={250}
            height={250}
            alt={item.title}
            data-testid="itemImage"
          />
        </Link>
        <button
          className="absolute bottom-0 right-0 p-2"
          onClick={() => handleSaveItem(item.id)}
          data-testid="saveItemBtn"
        >
          <AiFillHeart
            className={`text-2xl hover:fill-red-600  ${
              savedItems.includes(item.id.toString()) && "fill-red-600"
            }
            `}
          />
        </button>
      </div>
      <div className="mt-5">{item.title}</div>
      <div className="text-gray-600 text-xl font-bold">{item.price}€</div>
    </div>
  );
}

export default SingleItem;
