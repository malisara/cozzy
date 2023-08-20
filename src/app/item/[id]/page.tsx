"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import Button from "@/components/Button";
import Loading from "@/components/Loading";
import NoItemsError from "@/components/errorComponents/NoItemsError";
import Reviews from "@/components/Reviews";
import Sizes from "@/components/Sizes";
import { LS_KEY_BASKET, SHOPPING_BAG_NUMBER, USERT_ID } from "@/constants";
import { getItem } from "@/fetchers/fetchItems";
import { BasketItem } from "@/models/basket";
import { updateBasketData } from "@/utils/updateBasket";

function DetailView(): JSX.Element {
  const params = useParams();
  const [quantity, setQuantity] = useState<number>(1);
  const [chosenSize, setChosenSize] = useState<number>(0);

  const { data, error, isLoading } = getItem(params.id);

  if (error) return <NoItemsError />;
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

  function handleAddItemToBasket() {
    let basketItemsLs = JSON.parse(localStorage.getItem(LS_KEY_BASKET) || "[]");
    const basketItemIndex = basketItemsLs.findIndex(
      (item: BasketItem) => item.productId === Number(params.id)
    );

    if (basketItemIndex === -1) {
      // add new item to LS
      basketItemsLs.push({ productId: Number(params.id), quantity: quantity });
    } else {
      // increase quantity of existing object in LS
      basketItemsLs[basketItemIndex].quantity += quantity;
    }

    updateBasketData(USERT_ID, SHOPPING_BAG_NUMBER, basketItemsLs);
  }

  return (
    <div
      className="mt-[10rem] mx-5 lg:mx-auto lg:w-[60%]
       overflow-x-hidden mb-[7rem]"
    >
      <div className="flex flex-col md:flex-row items-center">
        {/* left side  */}
        <div className="basis-1/2 flex justify-center">
          <Image
            src={data.image}
            alt={`${data.title}`}
            width={250}
            height={250}
          />
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
            <Sizes chosenSize={chosenSize} setChosenSize={setChosenSize} />

            {/* quantity form */}
            <div className="mt-7 flex flex-row h-[3rem]">
              <form
                className="border-2 w-[55%] py-auto flex 
                items-center px-4"
              >
                Quantity: {quantity}
                <div className="flex flex-col justify-end ml-auto">
                  <button
                    className="hover:text-black"
                    onClick={(event) => handleSetQuantity(event, true)}
                  >
                    <IoIosArrowUp />
                  </button>
                  <button
                    className="hover:text-black"
                    onClick={(event) => handleSetQuantity(event, false)}
                  >
                    <IoIosArrowDown />
                  </button>
                </div>
              </form>
              <Button
                text={"Add to basket"}
                handleClick={handleAddItemToBasket}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailView;
