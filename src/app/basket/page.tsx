"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImBin2 } from "react-icons/im";

import DiscountModal from "@/components/errorComponents/DiscountModal";
import GeneralError from "@/components/errorComponents/GeneralError";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { SHOPPING_BAG_NUMBER } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContext";

import { getItemsById } from "@/fetchers/fetchItems";
import { BasketItems, BasketItem } from "@/models/basket";
import { updateBasketData } from "@/utils/updateBasket";
import PaymentSum from "@/components/PaymentSum";

function Basket(): JSX.Element {
  const { basketItems, setBasketItems, userId, setOrderSum } =
    useGlobalContext();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const itemIds = basketItems
    ? basketItems?.items.map((item) => item.productId.toString())
    : [];

  useEffect(() => {
    //Initial basket fetch
    if (userId !== 0) {
      fetch(`https://fakestoreapi.com/carts/${SHOPPING_BAG_NUMBER}`)
        .then((res) => res.json())
        .then((json) => {
          let items = json.products.map((item: any) => {
            return new BasketItem(item.productId, item.quantity);
          });

          if (items === undefined) {
            items = [];
          }

          setBasketItems(new BasketItems(null, json.userId, json.date, items)); //todo basket id
        })
        .catch((error) => {
          console.error("Error fetching basket data:", error);
        });
    } else {
      const basketItemsCopy = { ...basketItems };
      basketItemsCopy.items = [];
      setBasketItems(basketItemsCopy);
    }
  }, [userId]);

  const { data, error, isLoading } = getItemsById(itemIds);

  useEffect(() => {
    //update total sum
    let sum = 0;
    if (data !== undefined) {
      {
        data.map(
          (item, index) =>
            (sum += basketItems.items[index].quantity * item.price)
        );
      }
    }
    setOrderSum(sum);
  }, [data, basketItems]);

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
      updateBasketData(userId, SHOPPING_BAG_NUMBER, basketItemsCopy.items);
    }
  }

  function handleDeleteBasketItem(index: number): void {
    const basketItemsCopy = { ...basketItems };
    basketItemsCopy.items.splice(index, 1);
    setBasketItems(basketItemsCopy);
    updateBasketData(userId, SHOPPING_BAG_NUMBER, basketItemsCopy.items);
  }

  return (
    <div className="mt-[5rem]">
      <Title title="shopping bag" />

      <div className="flex flex-wrap md:px-[5rem]">
        <div className="w-[90%] lg:w-[45%] mx-auto">
          {/* Basket items */}
          {basketItems.items?.length > 0 && (
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
        />

        <PaymentSum setModalIsOpen={setModalIsOpen} />
      </div>
    </div>
  );
}

export default Basket;
