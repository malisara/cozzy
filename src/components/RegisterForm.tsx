"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { BACKEND_API_URL, RANDOM_USER_POSITION } from "@/constants";
import Button from "@/components/Button";
import User from "@/models/user";
import {
  houseNumberRegEx,
  invalidMailMessage,
  mailRegEx,
  noBlankSpacesMEssage,
  noBlankSpacesRegEx,
  onlyLettersMessage,
  onlyLettersRegEx,
  onlyNumbersMessage,
  onlyNumbersRegEx,
  phoneRegEx,
  stringWithSpaceRegEx,
} from "@/utils/regExValues";

const formStyle =
  "rounded-md outline-none bg-white h-[3rem] px-3 text-gray-600\
     focus:outline-base-secondary border border-gray-200";
const inputDivStyle = "w-full lg:w-[45%] flex flex-col";
const requiredFieldText = "This field is required";

type Props = {
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

function RegisterForm({ setModalIsOpen }: Props) {
  const [passwordIsVisible, setPasswordIsVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<User>();
  function togglePasswordVisibility() {
    setPasswordIsVisible((previous) => !previous);
  }

  const onSubmit: SubmitHandler<User> = (data) => {
    fetch(`${BACKEND_API_URL}/users`, {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        username: data.username,
        password: data.password,
        name: {
          firstname: data.name,
          lastname: data.lastName,
        },
        address: {
          city: data.city,
          street: data.street,
          number: data.number,
          zipcode: data.zip.toString(),
          geolocation: {
            lat: RANDOM_USER_POSITION[0],
            long: RANDOM_USER_POSITION[0],
          },
        },
        phone: data.phone.toString(),
      }),
    })
      .then((res) => {
        res.json();
        reset(); //deletes form data
        setModalIsOpen(true);
      })
      .catch((error) => {
        console.error("Error unable to register:", error);
      });
  };

  return (
    <form
      className="flex flex-col mx-5 xl:mx-[5rem] mb-3 gap-5 md:gap-10 "
      action="submit"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-wrap gap-4 justify-between">
        {/* First name */}
        <div className={inputDivStyle}>
          <input
            placeholder="First name"
            {...register("name", {
              required: requiredFieldText,
              pattern: {
                value: onlyLettersRegEx,
                message: onlyLettersMessage,
              },
            })}
            className={formStyle}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        {/* Last name */}
        <div className={inputDivStyle}>
          <input
            placeholder="Last name"
            {...register("lastName", {
              required: requiredFieldText,
              pattern: {
                value: onlyLettersRegEx,
                message: onlyLettersMessage,
              },
            })}
            className={formStyle}
          />
          {errors.lastName && <span>{errors.lastName.message}</span>}
        </div>

        {/* Email */}
        <div className={inputDivStyle}>
          <input
            placeholder="Email"
            {...register("email", {
              required: requiredFieldText,
              pattern: {
                value: mailRegEx,
                message: invalidMailMessage,
              },
            })}
            className={formStyle}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        {/* username */}
        <div className={inputDivStyle}>
          <input
            placeholder="Username"
            {...register("username", {
              required: requiredFieldText,
              pattern: {
                value: noBlankSpacesRegEx,
                message: noBlankSpacesMEssage,
              },
            })}
            className={formStyle}
          />
          {errors.username && <span>{errors.username.message}</span>}
        </div>

        {/* password */}
        <div className={`${inputDivStyle} relative`}>
          <input
            placeholder="Password"
            {...register("password", {
              required: requiredFieldText,
              pattern: {
                value: noBlankSpacesRegEx,
                message: noBlankSpacesMEssage,
              },
            })}
            className={formStyle}
            type={passwordIsVisible ? "text" : "password"}
          />
          {errors.password && <span>{errors.password.message}</span>}

          <span
            className="absolute right-3 top-1/2 -translate-y-1/2
               cursor-pointer inline-block"
            onClick={togglePasswordVisibility}
          >
            {passwordIsVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        {/* Confirrm password */}
        <div className={inputDivStyle}>
          <input
            placeholder="Password confirmation"
            {...register("passwordConfirm", {
              required: requiredFieldText,
              validate: (val: string | undefined) => {
                if (watch("password") != val) {
                  return "Passwords do no match";
                }
              },
            })}
            className={formStyle}
            type="password"
          />
          {errors.passwordConfirm && (
            <span>{errors.passwordConfirm.message}</span>
          )}
        </div>

        {/* City */}
        <div className={inputDivStyle}>
          <input
            placeholder="City"
            {...register("city", {
              required: requiredFieldText,
              pattern: {
                value: stringWithSpaceRegEx,
                message: "Invalid city format",
              },
            })}
            className={formStyle}
          />
          {errors.city && <span>{errors.city.message}</span>}
        </div>

        {/* Street */}
        <div className={inputDivStyle}>
          <input
            placeholder="Street"
            {...register("street", {
              required: requiredFieldText,
              pattern: {
                value: stringWithSpaceRegEx,
                message: "invalid street format",
              },
            })}
            className={formStyle}
          />
          {errors.street && <span>{errors.street.message}</span>}
        </div>

        {/* Number */}
        <div className={inputDivStyle}>
          <input
            placeholder="Number"
            {...register("number", {
              required: requiredFieldText,
              pattern: {
                value: houseNumberRegEx,
                message: "Invalid house number",
              },
            })}
            className={formStyle}
          />
          {errors.number && <span>{errors.number.message}</span>}
        </div>

        {/* Zip-code */}
        <div className={inputDivStyle}>
          <input
            placeholder="Zip-code"
            {...register("zip", {
              required: requiredFieldText,
              pattern: {
                value: onlyNumbersRegEx,
                message: onlyNumbersMessage,
              },
            })}
            className={formStyle}
          />
          {errors.zip && <span>{errors.zip.message}</span>}
        </div>

        {/* Phone number */}
        <div className={inputDivStyle}>
          <input
            placeholder="Phone number"
            {...register("phone", {
              required: requiredFieldText,
              pattern: {
                value: phoneRegEx,
                message: "Invalid phone number",
              },
            })}
            className={formStyle}
          />
          {errors.phone && <span>{errors.phone.message}</span>}
        </div>
      </div>

      <Button text={"register"} disabled={!isDirty} />
    </form>
  );
}

export default RegisterForm;
