"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImBin2 } from "react-icons/im";

import DiscountModal from "@/components/errorComponents/DiscountModal";
import GeneralError from "@/components/errorComponents/GeneralError";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import PaymentSum from "@/components/PaymentSum";
import { wideBtnStyle } from "@/components/utils/style";
import { SHOPPING_BAG_NUMBER } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContext";
import { getItemsById } from "@/fetchers/fetchItems";
import { roundNumber, shortenTitle } from "@/utils/functions";
import { updateBasketData } from "@/utils/updateBasket";

const optionsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Basket(): JSX.Element {
  const { basketItems, setBasketItems, userId, setOrderSum } =
    useGlobalContext();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const itemIds = basketItems.items.map((item) => item.productId.toString());

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
    if (basketItems && userId !== null) {
      const newQuantity = Number(e.target.value);
      const basketItemsCopy = { ...basketItems };
      basketItemsCopy.items[index].quantity = newQuantity;
      setBasketItems(basketItemsCopy);
      updateBasketData(userId, SHOPPING_BAG_NUMBER, basketItemsCopy.items);
    }
  }

  function handleDeleteBasketItem(index: number, userId: number): void {
    const basketItemsCopy = { ...basketItems };
    basketItemsCopy.items.splice(index, 1);
    setBasketItems(basketItemsCopy);
    updateBasketData(userId, SHOPPING_BAG_NUMBER, basketItemsCopy.items);
  }

  function handleRedirect() {
    router.push("/payment");
  }

  return (
    <div className="mt-[5rem]">
      <Title title="shopping bag" />

      <div className="flex flex-wrap md:px-[5rem]">
        <div className="w-[90%] lg:w-[45%] mx-auto order-2 lg:order-1">
          {/* Basket items */}
          {basketItems.items?.length > 0 && userId !== null && (
            <>
              {data.map((item, index) => (
                <div key={index}>
                  <div
                    className="flex border border-gray-300 m-auto p-4 
                relative mb-7 h-[8rem]"
                  >
                    <div
                      className="absolute top-1 right-1 p-2 cursor-pointer"
                      onClick={() => handleDeleteBasketItem(index, userId)}
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
                          {shortenTitle(item.title, 30)}
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
                            {optionsArray.map((value: number) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                            {/* API doesn't provide available quantity of items */}
                          </select>
                        </form>

                        <div className="font-bold text-l text-gray-600">
                          {roundNumber(
                            basketItems.items[index].quantity * item.price
                          )}
                          €
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {basketItems.items?.length > 0 && (
            <button className={wideBtnStyle} onClick={handleRedirect}>
              Continue with purchase
            </button>
          )}
        </div>

        {/* modal */}
        <DiscountModal
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
        />
        <div className="order-1 lg:order-2 w-full lg:w-[30%] mb-7 lg:mb-0">
          <PaymentSum setModalIsOpen={setModalIsOpen} />
        </div>
      </div>
    </div>
  );
}

export default Basket;
