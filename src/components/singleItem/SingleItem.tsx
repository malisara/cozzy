"use client";
import Image from "next/image";
import Item from "@/models/item";
import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";

type Props = {
  item: Item;
  handleItemSave: (id: number) => void;
  savedItems: string[];
};

function SingleItem({ item, handleItemSave, savedItems }: Props): JSX.Element {
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
            alt=""
          />
        </Link>
        <button
          className="absolute bottom-0 right-0 p-2"
          onClick={() => handleItemSave(item.id)}
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
