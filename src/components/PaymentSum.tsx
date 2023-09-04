"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { roundNumber } from "@/utils/functions";

type Props = {
  setModalIsOpen?: (modalIsOpen: boolean) => void;
  postage?: number;
  orderSum: number;
};

function PaymentSum({
  setModalIsOpen,
  postage = 0,
  orderSum,
}: Props): JSX.Element {
  const { basketItems, discount } = useGlobalContext();

  function discountInEur(discount: number): number {
    return roundNumber((discount / 100) * orderSum);
  }

  function discountedSum(discount: number): number {
    return roundNumber(orderSum + postage - discountInEur(discount));
  }

  return (
    <div
      className="w-[80%] mb-[2rem]
          lg:my-0 mx-auto"
    >
      {setModalIsOpen !== undefined && orderSum > 0 && (
        <div className="flex justify-between text-sm mb-10">
          <div>discount</div>
          <div
            className="underline hover:cursor-pointer"
            onClick={() => setModalIsOpen(true)}
          >
            add a discount
          </div>
        </div>
      )}

      <div className="text-gray-500 flex flex-col gap-3">
        <div className="flex justify-between">
          <div>Order value</div>
          <div>{roundNumber(orderSum)} €</div>
        </div>

        {discount > 0 && orderSum > 0 && (
          <div className="flex justify-between text-red-400">
            <div>Discount</div>
            <div>-{discount}% </div>
          </div>
        )}

        {basketItems.items.length > 0 && postage !== 0 && (
          <div className="flex justify-between">
            <div>Postage</div>
            <div>{postage} €</div>
          </div>
        )}

        <hr className="border-gray-500" />

        <div
          className="flex justify-between text-gray-700 
              font-bold mb-2"
        >
          <div>Sum</div>
          <div>{roundNumber(orderSum + postage)}€</div>
        </div>

        {discount > 0 && orderSum > 0 && (
          <>
            <div className="flex justify-end text-red-400">
              <div>-{discountInEur(discount)}€</div>
            </div>

            <hr />
            <div
              className="flex justify-between text-gray-700
                   font-bold text-l mb-5"
            >
              <div>Total Sum</div>
              <div>{discountedSum(discount)}€</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentSum;
