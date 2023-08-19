"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImBin2 } from "react-icons/im";

import Button from "@/components/Button";
import DiscountModal from "@/components/errorComponents/DiscountModal";
import GeneralError from "@/components/errorComponents/GeneralError";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { LS_KEY_BASKET, SHOPPING_BAG_NUMBER, USERT_ID } from "@/constants";
import { getItemsById } from "@/fetchers/fetchItems";
import { BasketItems, BasketItem } from "@/models/basket";
import { updateBasketData } from "@/utils/updateBasket";

const POSTAGE = 15;

function roundNumber(number: number): number {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

function Basket(): JSX.Element {
  const [basketItems, setBasketItems] = useState<BasketItems | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [[discountValue, validDiscount], setDiscount] = useState<
    [number, boolean]
  >([0, false]);
  const itemIds = basketItems
    ? basketItems?.items.map((item) => item.productId.toString())
    : [];

  useEffect(() => {
    //Initial basket fetch
    fetch(`https://fakestoreapi.com/carts/${SHOPPING_BAG_NUMBER}`)
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
        console.error("Error fetching basket data:", error);
      });
  }, []);

  useEffect(() => {
    //Save all basket items to LS
    localStorage.setItem(
      LS_KEY_BASKET,
      JSON.stringify(basketItems?.items) || "[]"
    );
  }, [basketItems]);

  const { data, error, isLoading } = getItemsById(itemIds); //TODO

  if (error)
    return (
      <GeneralError errorMessage="An error occurred while loading basket items." />
    );
  if (isLoading || !data) return <Loading />;

  function handleQuantityChange(
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ): void {
    if (basketItems) {
      const newQuantity = Number(e.target.value);
      const basketItemsCopy = { ...basketItems };
      basketItemsCopy.items[index].quantity = newQuantity;
      setBasketItems(basketItemsCopy);
      updateBasketData(USERT_ID, SHOPPING_BAG_NUMBER, basketItemsCopy.items);
    }
  }

  function handleDeleteBasketItem(index: number): void {
    if (basketItems) {
      const basketItemsCopy = { ...basketItems };
      basketItemsCopy.items.splice(index, 1);
      setBasketItems(basketItemsCopy);
      updateBasketData(USERT_ID, SHOPPING_BAG_NUMBER, basketItemsCopy.items);
    }
  }

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

  function discountInEur(discount: number): number {
    return roundNumber((discount / 100) * calculateOrderSum());
  }

  function discountedSum(discount: number): number {
    return roundNumber(calculateOrderSum() + POSTAGE - discountInEur(discount));
  }

  return (
    <div className="mt-[5rem]">
      <Title title="shopping bag" />

      <div className="flex flex-wrap md:px-[5rem]">
        <div className="w-[90%] lg:w-[45%] mx-auto">
          {/* Basket items */}
          {basketItems?.items !== undefined &&
            basketItems?.items?.length > 0 && (
              <>
                {data.map((item, index) => (
                  <div key={index}>
                    <div
                      className="flex border border-gray-300 m-auto p-4 
                relative mb-3 h-[8rem]"
                    >
                      <div
                        className="absolute top-1 right-1 p-2 cursor-pointer"
                        onClick={() => handleDeleteBasketItem(index)}
                      >
                        <ImBin2 className="text-[15px] hover:text-gray-500" />
                      </div>
                      <Link href={`item/${item.id}`} className="flex">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={100}
                          height={100}
                          className="object-contain mr-4"
                        />
                      </Link>

                      <div className="w-3/4 flex flex-col justify-between">
                        <Link href={`item/${item.id}`} className="flex">
                          <div className="font-bold text-sm mb-3 text-wrap">
                            {item.title.length > 30
                              ? item.title.slice(0, 25) + "..."
                              : item.title}
                          </div>
                        </Link>
                        <div className="flex justify-between">
                          <form>
                            <select
                              name="quantity"
                              id="quantity"
                              className="px-2 py-1 text-gray-700 border-2
                           bg-transparent rounded-lg me-2"
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
              </>
            )}
        </div>

        {/* modal */}
        <DiscountModal
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          setDiscount={setDiscount}
          discountValue={discountValue}
        />

        {/* total amount to pay */}
        <div
          className="w-[80%] mx-auto my-[2rem] 
          lg:my-0 lg:w-[25%] justify-end"
        >
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

            {validDiscount && (
              <div className="flex justify-between text-red-400">
                <div>Discount</div>
                <div>-{discountValue}% </div>
              </div>
            )}

            {basketItems !== null && basketItems.items.length > 0 && (
              <div className="flex justify-between">
                <div>Postage</div>
                <div>{POSTAGE} €</div>
              </div>
            )}

            <hr className="border-gray-500" />

            <div
              className="flex justify-between text-gray-700 
              font-bold mb-2"
            >
              <div>Sum</div>

              <div>
                {roundNumber(
                  calculateOrderSum() +
                    (basketItems !== null && basketItems.items.length > 0
                      ? POSTAGE
                      : 0)
                )}
                €
              </div>
            </div>

            {validDiscount && (
              <>
                <div className="flex justify-end text-red-400">
                  <div>-{discountInEur(discountValue)}€</div>
                </div>

                <hr />
                <div
                  className="flex justify-between text-gray-700
                   font-bold text-l mb-5"
                >
                  <div>Total Sum</div>
                  <div>{discountedSum(discountValue)}€</div>
                </div>
              </>
            )}
            <Button
              text={"continue with purchase"}
              disabled={basketItems === null || basketItems.items.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Basket;
