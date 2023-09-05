"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FaCcDinersClub,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcJcb,
} from "react-icons/fa";

import { BASKET_SESSION_KEY, ORDER_SUM_SESSION_KEY } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContext";
import { disabledWideBtnStyle, wideBtnStyle } from "./utils/style";
import { Basket } from "@/models/basket";

const formStyle = "border px-3 h-[3rem]";
const inputDivStyle = "flex flex-col w-full";
const dateRegEx = /^([0-9]{2})\/?(0[1-9]|1[0-2])$/;
const creditCardsPattern =
  /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
// Taken from: https://stackoverflow.com/questions/9315647/regex-credit-card-number-tests

type Inputs = {
  cardNumber: number;
  date: number;
  cvv: number;
};

function PaymentForm(): JSX.Element {
  const router = useRouter();
  const { setBasket, userId } = useGlobalContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    //Function doesn't execute payments
    //TODO use stripe
    const card = data.cardNumber;
    const date = data.date;
    const cvv = data.cvv;
    router.push("/successfulPurchase");
    resetBasketData();
  };

  function resetBasketData() {
    sessionStorage.removeItem(BASKET_SESSION_KEY);
    sessionStorage.removeItem(ORDER_SUM_SESSION_KEY);
    setBasket(new Basket(null, userId, null, []));
  }

  return (
    <div>
      <div className="flex gap-4 my-5 px-2 text-3xl text-gray-500">
        <FaCcVisa />
        <FaCcMastercard />
        <FaCcDinersClub />
        <FaCcAmex />
        <FaCcDiscover />
        <FaCcJcb />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-5 lg:gap-2 flex-wrap"
      >
        {/* credit card */}
        <div className={`${inputDivStyle} lg:w-[40%]`}>
          <input
            placeholder="Card number"
            {...register("cardNumber", {
              required: "This field is required",
              pattern: {
                value: creditCardsPattern,
                message: "Invalid card format",
              },
            })}
            className={formStyle}
          />
          {errors.cardNumber && <span>{errors.cardNumber.message}</span>}
        </div>

        {/* exp date */}
        <div className={`${inputDivStyle} lg:w-[30%]`}>
          <input
            placeholder="Exp.Date (YY/MM)"
            {...register("date", {
              required: "This field is required",
              maxLength: 5,
              pattern: {
                value: dateRegEx,
                message: "Invalid date format",
              },
            })}
            className={formStyle}
          />
          {errors.date && <span>{errors.date.message}</span>}
        </div>

        {/* cvv */}
        <div className={`${inputDivStyle} lg:w-[20%] mb-5`}>
          <input
            placeholder="CVV"
            {...register("cvv", {
              required: "This field is required",
              minLength: 3,
              maxLength: 3,
              pattern: {
                value: /^[0-9]{3}$/,
                message: "Invalid cvv format",
              },
            })}
            className={formStyle}
          />
          {errors.cvv && <span>{errors.cvv.message}</span>}
        </div>

        <button
          type="submit"
          className={!isDirty ? disabledWideBtnStyle : wideBtnStyle}
        >
          Pay
        </button>
      </form>
    </div>
  );
}

export default PaymentForm;
