"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import useSWR from "swr";

import Sizes from "@/components/sizes/Sizes";
import Item from "@/models/item";

import { fetcher } from "@/components/utils/fetchers";
function DetailView(): JSX.Element {
  const params = useParams();
  const [quantity, setQuantity] = useState<number>(1);

  const { data, error, isLoading } = useSWR<any>(
    `https://fakestoreapi.com/products/${params.id}`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const quantityBtnStyle = "hover:text-black";

  const item = new Item(
    data.id,
    data.title,
    data.price,
    data.image,
    data.rating.rate,
    data.rating.count,
    data.description
  );

  function handleSetQuantity(e: React.FormEvent, increase: boolean) {
    e.preventDefault();
    if (increase) {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 0) {
        setQuantity((prev) => prev - 1);
      }
    }
  }
  return (
    <div
      className="mt-[10rem] mx-5 lg:mx-auto lg:w-[60%] overflow-x-hidden
     mb-[7rem]"
    >
      {item && (
        <div className="flex flex-col md:flex-row items-center">
          {/* left side  */}
          <div className="basis-1/2 flex justify-center">
            <Image src={item.image} alt="" width={250} height={250} />
          </div>

          {/* right side */}
          <div className="basis-1/2 flex flex-wrap">
            <div
              className="text-base-secondary text-2xl mt-10 md:mt-0 
            font-bold text-start"
            >
              {item.title.toUpperCase()}
            </div>
            <div className="mt-10">{item.description}</div>

            <div className="mt-5 text-yellow-500/70 font-bold text-2xl">
              {item.price}€
            </div>
            <div className="flex w-full mt-5 flex-col">
              <Sizes />

              <div className="mt-7 flex flex-row h-[3rem]">
                <form
                  className="border-2 w-[55%] py-auto flex 
                items-center px-4"
                >
                  Quantity: {quantity}
                  <div className="flex flex-col justify-end ml-auto">
                    <button
                      className={`${quantityBtnStyle}`}
                      onClick={(event) => handleSetQuantity(event, true)}
                    >
                      <IoIosArrowUp />
                    </button>
                    <button
                      className={`${quantityBtnStyle}`}
                      onClick={(event) => handleSetQuantity(event, false)}
                    >
                      <IoIosArrowDown />
                    </button>
                  </div>
                </form>
                <button
                  className="border border-base-secondary w-fit px-3 py-2 
                  bg-base-secondary text-white hover:opacity-90 rounded
                  transtion-all duration-500"
                >
                  Add to basket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailView;
