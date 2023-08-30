"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import Button from "@/components/Button";
import Loading from "@/components/Loading";
import NoItemsError from "@/components/errorComponents/NoItemsError";
import Reviews from "@/components/Reviews";
import Sizes from "@/components/Sizes";
import { getItem } from "@/fetchers/fetchItems";
import { BasketItem } from "@/models/basket";
import { updateBasketData } from "@/utils/updateBasket";
import { useGlobalContext } from "@/context/GlobalContext";
import BasketPopover from "@/components/BasketPopover";

function DetailView(): JSX.Element {
  const params = useParams();
  const [quantity, setQuantity] = useState<number>(1);
  const [chosenSize, setChosenSize] = useState<number>(0);
  const { basketItems, setBasketItems, userId } = useGlobalContext();
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const router = useRouter();

  const { data, error, isLoading } = getItem(params.id);

  if (error) return <NoItemsError />;
  if (isLoading || !data) return <Loading />;

  function handleSetQuantity(e: React.FormEvent, increase: boolean) {
    e.preventDefault();
    if (increase) {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  }

  async function handleAddItemToBasket() {
    if (userId === null) {
      //check if user auth token is missing
      //redirect user to login when he's not authenticated
      router.push("/login");
      return;
    }

    const existingItemIndex = basketItems.items.findIndex(
      (item) => item.productId === Number(params.id)
    );

    if (basketItems.basketId === null) {
      // initially basketItems attributes are set to null
      // when user first adds an item, basketItems attributes values are set
      await initializeBasket();
    } else if (existingItemIndex === -1) {
      addNewItem(basketItems.basketId, userId);
    } else {
      updateExistingItem(existingItemIndex, basketItems.basketId, userId);
    }

    setShowPopover(true);
    setTimeout(() => {
      setShowPopover(false);
    }, 3000);
  }

  async function createNewBasket(
    date: Date,
    products: BasketItem
  ): Promise<number> {
    return fetch("https://fakestoreapi.com/carts", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        date: date,
        products: products,
      }),
    })
      .then((res) => res.json())
      .then((json) => json.id) //returns basket Id
      .catch((error) => {
        console.error("Error updating basket data:", error);
      });
  }

  async function initializeBasket(): Promise<void> {
    const basketItemsCopy = { ...basketItems };
    const date = new Date();
    const items = new BasketItem(Number(params.id), quantity);

    basketItemsCopy.basketId = await createNewBasket(date, items);
    basketItemsCopy.date = date;
    basketItemsCopy.userId = userId;
    basketItemsCopy.items.push(items);
    setBasketItems(basketItemsCopy);
  }

  function updateExistingItem(
    index: number,
    basketId: number,
    userId: number
  ): void {
    const itemsCopy = [...basketItems.items];
    itemsCopy[index].quantity += quantity;

    const updatedBasket = { ...basketItems, items: itemsCopy };
    updateBasketData(userId, basketId, updatedBasket.items);
    setBasketItems(updatedBasket);
  }

  function addNewItem(basketId: number, userId: number): void {
    const newItem = new BasketItem(Number(params.id), quantity);
    const updatedBasket = {
      ...basketItems,
      items: [...basketItems.items, newItem],
    };
    updateBasketData(userId, basketId, updatedBasket.items);
    setBasketItems(updatedBasket);
  }

  return (
    <>
      {showPopover && <BasketPopover item={data} quantity={quantity} />}
      <div
        className="mt-[10rem] mx-5 lg:mx-auto lg:w-[60%]
       overflow-x-hidden mb-[7rem]"
      >
        <div className="flex flex-col md:flex-row items-center">
          {/* left side  */}
          <div className="basis-1/2 flex justify-center">
            <Image src={data.image} alt={data.title} width={250} height={250} />
          </div>

          {/* right side */}
          <div
            className="basis-1/2 flex flex-wrap flex-col items-center
            lg:items-start text-center lg:text-start"
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
                  className="border-2 w-[55%] py-auto px-2 flex 
                items-center mx-auto lg:mx-1"
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
    </>
  );
}

export default DetailView;
