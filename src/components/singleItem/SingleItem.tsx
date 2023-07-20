"use client";
import Image from "next/image";
import Item from "@/models/item";
import Link from "next/link";

//todo
//add to basket
type Props = {
  item: Item;
};

function SingleItem({ item }: Props): JSX.Element {
  return (
    <div className="flex flex-col w-[20rem] gap-2 text-center flex-shrink-0">
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
      </div>
      <div className="mt-5">{item.title}</div>
      <div className="text-black">{item.price}€</div>
      <button
        className="border border-base-secondary w-full py-2 rounded-md
         mt-auto text-base-secondary transtion-all duration-500 
         hover:bg-base-secondary hover:text-white"
      >
        Add to cart
      </button>
    </div>
  );
}

export default SingleItem;
