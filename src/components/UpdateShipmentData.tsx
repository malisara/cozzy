import { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

import { useGlobalContext } from "@/context/GlobalContext";
import { BACKEND_API_URL, RANDOM_USER_POSITION } from "@/constants";
import User from "@/models/user";
import { wideBtnStyle } from "./utils/style";
import {
  houseNumberRegEx,
  invalidMailMessage,
  mailRegEx,
  onlyLettersMessage,
  onlyLettersRegEx,
  phoneRegEx,
  stringWithSpaceRegEx,
  zipRegEx,
} from "@/utils/regExValues";

const formStyle = "border px-3 h-[3rem] me-2 mb-2";
const inputDivStyle = "flex flex-col w-[45%]";
const requiredFieldMessage = "This field is required";

type Props = {
  user: User;
  setUserData: Dispatch<SetStateAction<User>>;
  setEditUserData: Dispatch<SetStateAction<boolean>>;
};

type Inputs = {
  name: string;
  lastName: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
};

function UpdateShipmentData({
  user,
  setUserData,
  setEditUserData,
}: Props): JSX.Element {
  const { userId } = useGlobalContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const userCopy = { ...user };
    userCopy.name = data.name;
    userCopy.lastName = data.lastName;
    userCopy.street = data.street;
    userCopy.number = data.number;
    userCopy.zip = data.zip;
    userCopy.city = data.city;
    userCopy.email = data.email;
    userCopy.phone = data.phone;

    setUserData(userCopy);
    setEditUserData(false);
    await updateUserData(data);
    toast.success("Shipping data was successfully updated.");
  };

  async function updateUserData(data: Inputs) {
    fetch(`${BACKEND_API_URL}/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify({
        email: data.email,
        username: user.username,
        password: user.password,
        name: {
          firstname: data.name,
          lastname: data.lastName,
        },
        address: {
          city: data.city,
          street: data.street,
          number: data.number,
          zipcode: data.zip,
          geolocation: {
            lat: RANDOM_USER_POSITION[0],
            long: RANDOM_USER_POSITION[1],
          },
        },
        phone: data.phone,
      }),
    })
      .then((res) => res.json())
      .catch((error) =>
        console.error("Error unable to update user's data:", error)
      );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-5 lg:gap-2 flex-wrap"
      data-testid="updateUserForm"
    >
      {/* name */}
      <div className={inputDivStyle}>
        <input
          defaultValue={user.name}
          {...register("name", {
            required: requiredFieldMessage,
            pattern: {
              value: onlyLettersRegEx,
              message: onlyLettersMessage,
            },
          })}
          className={formStyle}
        />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      {/* last name */}
      <div className={inputDivStyle}>
        <input
          defaultValue={user.lastName}
          {...register("lastName", {
            required: requiredFieldMessage,
            pattern: {
              value: onlyLettersRegEx,
              message: onlyLettersMessage,
            },
          })}
          className={formStyle}
        />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>

      {/* street */}
      <div className={inputDivStyle}>
        <input
          defaultValue={user.street}
          {...register("street", {
            required: requiredFieldMessage,
            pattern: {
              value: stringWithSpaceRegEx,
              message: "invalid street format",
            },
          })}
          className={formStyle}
        />
        {errors.street && <span>{errors.street.message}</span>}
      </div>

      {/* number */}
      <div className={inputDivStyle}>
        <input
          defaultValue={user.number}
          {...register("number", {
            required: requiredFieldMessage,
            pattern: {
              value: houseNumberRegEx,
              message: "Invalid house number format",
            },
          })}
          className={formStyle}
        />
        {errors.number && <span>{errors.number.message}</span>}
      </div>

      {/* zip code */}
      <div className={inputDivStyle}>
        <input
          defaultValue={user.zip}
          {...register("zip", {
            required: requiredFieldMessage,
            pattern: {
              value: zipRegEx,
              message: "Invalid zip-code",
            },
          })}
          className={formStyle}
        />
        {errors.zip && <span>{errors.zip.message}</span>}
      </div>

      {/* city */}
      <div className={inputDivStyle}>
        <input
          defaultValue={user.city}
          {...register("city", {
            required: requiredFieldMessage,
            pattern: {
              value: stringWithSpaceRegEx,
              message: "invalid city format",
            },
          })}
          className={formStyle}
        />
        {errors.city && <span>{errors.city.message}</span>}
      </div>

      {/* email */}
      <div className={inputDivStyle}>
        <input
          defaultValue={user.email}
          {...register("email", {
            required: requiredFieldMessage,
            pattern: {
              value: mailRegEx,
              message: invalidMailMessage,
            },
          })}
          className={formStyle}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      {/* phone */}
      <div className={inputDivStyle}>
        <input
          defaultValue={user.phone}
          {...register("phone", {
            required: requiredFieldMessage,
            pattern: {
              value: phoneRegEx,
              message: "Invalid phone number format",
            },
          })}
          className={formStyle}
        />
        {errors.phone && <span>{errors.phone.message}</span>}
      </div>

      <div className={inputDivStyle}>
        <button className={wideBtnStyle}>Update data</button>
      </div>
    </form>
  );
}

export default UpdateShipmentData;
