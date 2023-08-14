"use client";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { getItemsById } from "@/fetchers/fetchItems";
import { BasketItems, BasketItem } from "@/models/basket";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImBin2 } from "react-icons/im";
import GeneralError from "@/components/errorComponents/GeneralError";
import Link from "next/link";
import { flexCenter } from "@/components/utils/style";
import Button from "@/components/Button";
import ReactModal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";

const POSTAGE = 15;
const DISCOUNT_CODES = { goodDiscount: 20, betterDiscount: 40 };

type Props = {};

function Basket({}: Props): JSX.Element {
  const [basketItems, setBasketItems] = useState<BasketItems | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const modalBtnStyle = btnDisabled
    ? "bg-gray-400"
    : "border-base-secondary bg-base-secondary hover:opacity-75 rounded-md \
    transtion-all duration-500 border";

  useEffect(() => {
    fetch("https://fakestoreapi.com/carts/5")
      .then((res) => res.json())
      .then((json) => {
        let items = json.products.map((item: any) => {
          return new BasketItem(item.productId, item.quantity);
        });

        if (items === undefined) {
          items = [];
        }
        setBasketItems(new BasketItems(json.userId, json.date, items));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function handleQuantityChange(
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) {
    if (basketItems) {
      const basketItemsCopy = { ...basketItems };
      basketItemsCopy.items[index].quantity = Number(e.target.value);
      setBasketItems(basketItemsCopy);
    }
  }

  function handleDeleteBasketItem(index: number) {
    if (basketItems) {
      const basketItemsCopy = { ...basketItems };
      basketItemsCopy.items.splice(index, 1);
      setBasketItems(basketItemsCopy);
    }
  }

  useEffect(() => {}, [basketItems]);
  const itemIds = basketItems
    ? basketItems?.items.map((item) => item.itemId.toString())
    : [];

  function handleDiscountCodeChange(
    e: React.FormEvent<HTMLInputElement>
  ): void {
    if (e.currentTarget.value.trim().length > 0) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }

  function handleDiscountCodeSubmit(
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    e.preventDefault();
    const inputValue = inputRef.current?.value;
    //TODO
  }

  const { data, error, isLoading } = getItemsById(itemIds);

  if (error)
    return (
      <GeneralError errorMessage="An error occurred while loading basket items." />
    );
  if (isLoading || !data) return <Loading />;

  function calculateOrderSum(): number {
    let sum = 0;

    if (data !== undefined && basketItems !== null) {
      {
        data.map(
          (item, index) =>
            (sum += basketItems.items[index].quantity * item.price)
        );
      }
    }
    return sum;
  }

  return (
    <div className="mt-[5rem]">
      <Title title="shopping bag" />
      {basketItems === null ? (
        <div className={`${flexCenter} flex-col gap-5 mt-5`}>
          <div>Your shopping bag is currently empty</div>
          <Link href={"/"} className="text-base-secondary underline font-light">
            Find something cozy here
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap md:px-[5rem] ">
          {/* listed items */}
          <div className="w-[90%] lg:w-[45%] m-auto">
            {data.map((item, index) => (
              <div key={index}>
                <div className="flex border border-gray-300 m-auto p-4 relative mb-3 h-[8rem]">
                  <div
                    className="absolute top-1 right-1 p-2 cursor-pointer"
                    onClick={() => handleDeleteBasketItem(index)}
                  >
                    <ImBin2 className="text-[15px] hover:text-gray-500" />
                  </div>

                  <Image
                    src={item.image}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="object-contain mr-4"
                  />

                  <div className="w-3/4 flex flex-col justify-between">
                    <div className="font-bold text-sm mb-3 text-wrap">
                      {item.title.length > 30
                        ? item.title.slice(0, 25) + "..."
                        : item.title}
                    </div>

                    <div className="flex justify-between">
                      <form>
                        <select
                          name="quantity"
                          id="quantity"
                          className="px-2 py-1 text-gray-700
                border-2 bg-transparent rounded-lg me-2"
                          value={basketItems.items[index].quantity}
                          onChange={(e) => handleQuantityChange(e, index)}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          {/* API doesn't support available quantity of items */}
                        </select>
                      </form>

                      <div className="font-bold text-l text-gray-600">
                        {basketItems.items[index].quantity * item.price}€
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* modal */}
          <ReactModal
            isOpen={modalIsOpen}
            className="transition-opacity ease-in-out duration-600"
            ariaHideApp={false}
          >
            <div
              className="px-4 py-10 bg-white/60 w-[70%] lg:w-[25%] top-[15rem]
           rounded-lg border border-gray-400 absolute left-1/2 transform
             -translate-x-1/2 text-center"
            >
              <button
                className="absolute top-4 right-4 hover:text-base-secondary
             text-gray-700 text-2xl"
                onClick={() => {
                  setModalIsOpen(false);
                }}
              >
                <AiOutlineClose />
              </button>

              <div className="text-xl mb-2">Discount</div>
              <div className="mb-2 text-sm">Enter the discount code</div>

              <form action="" className="flex flex-wrap mt-5">
                <input
                  ref={inputRef}
                  className="border border-gray-400 h-[2.5rem] rounded-lg 
                w-[95%] lg:w-[75%] mx-auto px-2"
                  onChange={(e) => handleDiscountCodeChange(e)}
                />
                <button
                  disabled={btnDisabled}
                  className={` ${modalBtnStyle} w-[95%] lg:w-[20%] py-1
                   text-white mt-2 lg:mt-0 mx-auto`}
                  onClick={(e) => handleDiscountCodeSubmit(e)}
                >
                  add
                </button>
              </form>
            </div>
          </ReactModal>

          {/* total amount to pay */}

          <div className="w-[80%] mx-auto my-[2rem] lg:my-0 lg:w-[25%] justify-end">
            <div className="flex justify-between text-sm mb-10">
              <div>discount</div>
              <div
                className="underline hover:cursor-pointer"
                onClick={() => setModalIsOpen(true)}
              >
                add a discount
              </div>
            </div>

            <div className="text-gray-500 flex flex-col gap-3">
              <div className="flex justify-between">
                <div>Order value</div>
                <div>{calculateOrderSum()} €</div>
              </div>

              <div className="flex justify-between">
                <div>Postage</div>
                <div>{POSTAGE} €</div>
              </div>
              <hr className="border-gray-500" />

              <div className="flex justify-between text-gray-700 font-bold mb-10">
                <div>Sum</div>
                <div>
                  {Math.round(
                    (calculateOrderSum() + POSTAGE + Number.EPSILON) * 100
                  ) / 100}{" "}
                  €
                </div>
              </div>
              <Button text={"continue with purchase"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Basket;
