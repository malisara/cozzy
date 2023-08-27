import Image from "next/image";

import Item from "@/models/item";
import { shortenTitle } from "@/utils/functions";

type Props = {
  item: Item;
  quantity: number;
};

function BasketPopover({ item, quantity }: Props): JSX.Element {
  return (
    <div
      className="fixed top-[70px] right-5 p-2 bg-white
     shadow-md rounded-md z-50"
    >
      <div className="flex items-center">
        <div className="w-14 h-fit mr-2">
          <Image src={item.image} alt={item.title} width={50} height={50} />
        </div>
        <div className="text-sm">
          <div className="font-semibold">{shortenTitle(item.title, 20)}</div>
          <div>
            Quantity:
            {quantity}
          </div>
          <div>
            Price:
            {item.price}€
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasketPopover;
