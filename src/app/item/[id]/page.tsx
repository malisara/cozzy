"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import useSWR from "swr";

import BasketPopover from "@/components/BasketPopover";
import Button from "@/components/Button";
import NoItemsError from "@/components/errorComponents/NoItemsError";
import Loading from "@/components/Loading";
import Reviews from "@/components/Reviews";
import { urlData } from "@/components/utils/routes";
import Sizes from "@/components/Sizes";
import { BACKEND_API_URL, SIZES } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContext";
import { itemFetcher } from "@/fetchers/fetchItems";
import { BasketItem } from "@/models/basket";
import { updateBasketData } from "@/utils/updateBasket";

function DetailView(): JSX.Element {
  const [quantity, setQuantity] = useState<number>(1);
  const [chosenSize, setChosenSize] = useState<number>(2);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [inStock, setInstock] = useState<boolean[]>(
    new Array(SIZES.length).fill(false)
  );

  const params = useParams();
  const router = useRouter();
  const { basket, setBasket, userId, setItemCategory } = useGlobalContext();

  const itemId = params.id;
  const { data, error, isLoading } = useSWR({ itemId }, () =>
    itemFetcher(itemId)
  );

  useEffect(() => {
    //Set item catgory for navbar display
    if (data !== undefined) {
      for (const urlItem of urlData) {
        if (data.category === urlItem.alt) {
          setItemCategory(urlItem.url);
          break;
        }
      }
    }
  }, [data]);

  if (error) return <NoItemsError />;
  if (isLoading || !data) return <Loading />;

  function handleSetQuantity(e: React.FormEvent, increase: boolean) {
    e.preventDefault();
    if (increase) {
      setQuantity((prev) => prev + 1);
      return;
    }
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }

  async function handleAddItemToBasket() {
    if (userId === null) {
      router.push("/login");
      toast.info("Please login to continue with the purchase.");
      return;
    }

    const itemInBasketIndex = basket.items.findIndex(
      (item) => item.productId === Number(itemId)
    );

    if (basket.basketId === null) {
      // initially basket attributes are set to null
      await initializeBasket(userId);
    } else if (itemInBasketIndex === -1) {
      addNewItem(basket.basketId, userId);
    } else {
      updateExistingItem(itemInBasketIndex, basket.basketId, userId);
    }

    setShowPopover(true);
    setTimeout(() => {
      setShowPopover(false);
    }, 3000);
  }

  async function initializeBasket(userId: number): Promise<void> {
    const basketCopy = { ...basket };
    const date = new Date();
    const items = new BasketItem(Number(itemId), quantity);
    const basketId = await createNewBasket(date, items);

    basketCopy.basketId = basketId;
    basketCopy.date = date;
    basketCopy.items.push(items);

    setBasket(basketCopy);
    updateBasketData(userId, basketId, basketCopy.items);
  }

  async function createNewBasket(
    date: Date,
    products: BasketItem
  ): Promise<number> {
    return fetch(`${BACKEND_API_URL}/carts`, {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        date: date,
        products: products,
      }),
    })
      .then((res) => res.json())
      .then((data) => data.id) //returns basket Id
      .catch((error) => {
        console.error("Error updating basket data:", error);
      });
  }

  function addNewItem(basketId: number, userId: number): void {
    const updatedBasket = {
      ...basket,
      items: [...basket.items, new BasketItem(Number(itemId), quantity)],
    };
    updateBasketData(userId, basketId, updatedBasket.items);
    setBasket(updatedBasket);
  }

  function updateExistingItem(
    index: number,
    basketId: number,
    userId: number
  ): void {
    const itemsCopy = [...basket.items];
    itemsCopy[index].quantity += quantity;

    const updatedBasket = { ...basket, items: itemsCopy };
    updateBasketData(userId, basketId, updatedBasket.items);
    setBasket(updatedBasket);
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
              {(data.category == "men's clothing" ||
                data.category === "women's clothing") && (
                <Sizes
                  chosenSize={chosenSize}
                  setChosenSize={setChosenSize}
                  inStock={inStock}
                />
              )}
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
                      data-testid="increaseQuantity"
                    >
                      <IoIosArrowUp />
                    </button>
                    <button
                      className="hover:text-black"
                      onClick={(event) => handleSetQuantity(event, false)}
                      data-testid="decreaseQuantity"
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
