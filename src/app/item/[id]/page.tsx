"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import Button from "@/components/button/Button";
import Loading from "@/components/loading/Loading";
import NoItems from "@/components/noItems/NoItems";
import Reviews from "@/components/reviews/Reviews";
import Sizes from "@/components/sizes/Sizes";
import { getItem } from "@/fetchers/fetchItems";

function DetailView(): JSX.Element {
  const params = useParams();
  const [quantity, setQuantity] = useState<number>(1);
  const quantityBtnStyle = "hover:text-black";
  const { data, error, isLoading } = getItem(params.id);

  if (error) return <NoItems />;
  if (isLoading || !data) return <Loading />;

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
      {data && (
        <div className="flex flex-col md:flex-row items-center">
          {/* left side  */}
          <div className="basis-1/2 flex justify-center">
            <Image src={data.image} alt="" width={250} height={250} />
          </div>

          {/* right side */}
          <div
            className="basis-1/2 flex flex-wrap flex-col items-center
            md:items-start text-center md:text-start"
          >
            {/* title */}
            <div
              className="text-base-secondary text-2xl mt-10 md:mt-0 
            font-bold"
            >
              {data.title.toUpperCase()}
            </div>

            {/* reviews */}
            <div className="mt-5">
              {data.rate !== undefined && data.rate_count !== undefined && (
                <Reviews stars={data.rate} reviews={data.rate_count} />
              )}
            </div>

            {/* description */}
            <div className="mt-10 order-last lg:order-none">
              {data.description}
            </div>

            {/* price */}
            <div
              className="mt-5 text-yellow-500/70 
            font-bold text-3xl"
            >
              {data.price}€
            </div>

            {/* sizes */}
            <div className="flex w-full lg:mt-5 flex-col">
              <Sizes />

              {/* quantity form */}
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
                <Button text={"Add to basket"} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailView;
