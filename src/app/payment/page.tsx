"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import useSWR from "swr";

import GeneralError from "@/components/errorComponents/GeneralError";
import PaymentForm from "@/components/PaymentForm";
import PaymentSum from "@/components/PaymentSum";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import UpdateShipmentData from "@/components/UpdateShipmentData";
import { useGlobalContext } from "@/context/GlobalContext";
import { BACKEND_API_URL, ORDER_SUM_SESSION_KEY } from "@/constants";
import User from "@/models/user";

const containerStyle = "border p-4 flex flex-col mb-4";
const bolderTextStyle = "text-gray-500 font-bold";
const subTitleStyle = "font-bold text-xl mb-4 text-gray-600";

const postageOptions = [
  { label: "1-3 days", price: 15 },
  { label: "4-9 days", price: 10 },
  { label: "10-30 days", price: 5 },
];

async function userFetcher(userId: number | null): Promise<User | void> {
  return await fetch(`${BACKEND_API_URL}/users/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      return new User(
        data.name.firstname,
        data.name.lastname,
        data.address.city,
        data.address.street,
        data.address.number,
        data.address.zipcode,
        data.email,
        data.phone
      );
    })
    .catch((error) => console.error("Error fetching user data:", error));
}

function getOrderSum(): number {
  if (typeof window !== "undefined") {
    return JSON.parse(sessionStorage.getItem(ORDER_SUM_SESSION_KEY) || "0");
  }
  return 0;
}

function Payment(): JSX.Element {
  const [selectedPostageOption, setSelectedPostageOption] = useState(
    postageOptions[1]
  );
  const [editUserData, setEditUserData] = useState<boolean>(false);
  const [shouldFetchUser, setShouldFetchUSer] = useState<boolean>(false);
  const router = useRouter();
  const { userId } = useGlobalContext();
  const [user, setUserData] = useState<User>(
    new User("", "", "", "", "", "", "", "", "", "")
  );

  const { data, error, isLoading } = useSWR(
    shouldFetchUser ? { userId } : null,
    () => userFetcher(userId)
  );

  useEffect(() => {
    if (getOrderSum() === 0) {
      if (userId === null) {
        setShouldFetchUSer(false);
        router.push("/login");
        return;
      }
      setShouldFetchUSer(false);
      router.push("/");
      //user has an empty basket => redirect to homepage
      return;
    } else {
      setShouldFetchUSer(true);
    }
  }, [userId]);

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  if (error)
    return (
      <GeneralError errorMessage="An errror occurred while loading the payment page." />
    );
  if (isLoading || !data) return <Loading />;

  function handlePostageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = postageOptions.findIndex(
      (option) => option.label === e.target.value
    );
    setSelectedPostageOption(postageOptions[selected]);
  }

  return (
    <div className="mt-[5rem] mb-[4rem]">
      <Title title="Payment" />

      <div className="flex flex-wrap md:px-[5rem]">
        <div
          className="w-[90%] lg:w-[45%] mx-auto order-2 
        lg:order-1 mb-[5rem] lg:mb-0"
        >
          <div className={containerStyle}>
            <h2 className={subTitleStyle}>Shipping address</h2>

            {!editUserData ? (
              <>
                <div className="pe-4 w-fit relative hover:base-secondary">
                  <FiEdit2
                    className="absolute end-0 top-0"
                    onClick={() => setEditUserData(true)}
                    data-testid="editUserBtn"
                  />
                  <p>
                    {user.name} {user.lastName}
                  </p>
                  <p>
                    {user.street} {user.number}
                  </p>
                  <p>
                    {user.zip} {user.city}
                  </p>
                </div>

                <div className="mt-4">{user.email}</div>
                <p>{user.phone}</p>
              </>
            ) : (
              <UpdateShipmentData
                user={user}
                setUserData={setUserData}
                setEditUserData={setEditUserData}
              />
            )}
          </div>

          <div className={containerStyle}>
            <h2 className={subTitleStyle}>Shipping options</h2>
            <form>
              <select
                value={selectedPostageOption.label}
                className="px-2 py-3 bg-gray-50 text-gray-500 mb-4"
                onChange={(e) => handlePostageChange(e)}
                data-testid="selectPostage"
              >
                {postageOptions.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label} ({option.price}€)
                  </option>
                ))}
              </select>
              <div>
                Selected option:{" "}
                <p className={bolderTextStyle}>{selectedPostageOption.label}</p>{" "}
              </div>
              <div>
                Price:{" "}
                <p className={bolderTextStyle}>
                  {selectedPostageOption.price}€
                </p>{" "}
              </div>
            </form>
          </div>

          <div className={containerStyle}>
            <h2 className={subTitleStyle}>Payment</h2>
            <PaymentForm />
          </div>
        </div>

        <div className="order-1 lg:order-2 w-full lg:w-[30%] mb-7 lg:m-0">
          <PaymentSum
            postage={selectedPostageOption.price}
            orderSum={getOrderSum()}
          />
        </div>
      </div>
    </div>
  );
}

export default Payment;
