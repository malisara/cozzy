import React from "react";
import { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { wideBtnStyle } from "./utils/style";

const formStyle = "border px-3 h-[3rem] me-2 mb-2";
const inputDivStyle = "flex flex-col w-[45%]";

const onlyLettersMessage = "the field must contain only letters";
const onlyNumbersMessage = "the field must contain only numbers";
const requiredFieldMessage = "This field is required";

type Props = {
  name: string;
  lastName: string;
  street: string;
  number: number;
  zip: number;
  city: string;
  email: string;
  setUserData: Dispatch<
    SetStateAction<[string, string, string, string, number, number, string]>
  >;
  setEditUserData: Dispatch<SetStateAction<boolean>>;
};

type Inputs = {
  name: string;
  lastName: string;
  street: string;
  number: number;
  zip: number;
  city: string;
  email: string;
};

function UpdateShipmentData({
  name,
  lastName,
  street,
  number,
  zip,
  city,
  email,
  setUserData,
  setEditUserData,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setUserData([
      data.name,
      data.lastName,
      data.city,
      data.street,
      data.number,
      data.zip,
      data.email,
    ]);
    setEditUserData(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-5 lg:gap-2 flex-wrap"
    >
      <div className={inputDivStyle}>
        <input
          defaultValue={name}
          {...register("name", {
            required: requiredFieldMessage,
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: onlyLettersMessage,
            },
          })}
          className={formStyle}
        />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div className={inputDivStyle}>
        <input
          defaultValue={lastName}
          {...register("lastName", {
            required: requiredFieldMessage,
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: onlyLettersMessage,
            },
          })}
          className={formStyle}
        />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>

      <div className={inputDivStyle}>
        <input
          defaultValue={street}
          {...register("street", {
            required: requiredFieldMessage,
            pattern: {
              value: /^[a-zA-Z\s]*$/,
              message: "invalid street format",
            },
          })}
          className={formStyle}
        />
        {errors.street && <span>{errors.street.message}</span>}
      </div>

      <div className={inputDivStyle}>
        <input
          defaultValue={number}
          {...register("number", {
            required: requiredFieldMessage,
            pattern: {
              value: /^[0-9]*$/,
              message: onlyNumbersMessage,
            },
          })}
          className={formStyle}
        />
        {errors.number && <span>{errors.number.message}</span>}
      </div>

      <div className={inputDivStyle}>
        <input
          defaultValue={zip}
          {...register("zip", {
            required: requiredFieldMessage,
            pattern: {
              value: /^[0-9]*$/,

              message: onlyNumbersMessage,
            },
          })}
          className={formStyle}
        />
        {errors.zip && <span>{errors.zip.message}</span>}
      </div>

      <div className={inputDivStyle}>
        <input
          defaultValue={city}
          {...register("city", {
            required: requiredFieldMessage,
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: onlyLettersMessage,
            },
          })}
          className={formStyle}
        />
        {errors.city && <span>{errors.city.message}</span>}
      </div>

      <div className={inputDivStyle}>
        <input
          defaultValue={email}
          {...register("email", {
            required: requiredFieldMessage,
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "invalid email format",
            },
          })}
          className={formStyle}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div className={inputDivStyle}>
        <button className={wideBtnStyle}>Update data</button>
      </div>
    </form>
  );
}

export default UpdateShipmentData;
