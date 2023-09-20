"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useGlobalContext } from "@/context/GlobalContext";
import RegisterForm from "@/components/RegisterForm";
import RegisterModal from "@/components/RegisterModal";
import { imageCover } from "@/components/utils/style";
import registerImage from "@/../public/register.png";

function Register(): JSX.Element {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const { userId } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    //redirect logged-in user to homepage
    if (userId !== null) {
      router.push("/");
    }
  }, []);

  return (
    <div
      className="mt-[5rem] md:mt-[10rem] flex flex-col 
    md:flex-row px-2 md:px-10 mb-[6rem]"
    >
      <RegisterModal
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
      />

      <div className="flex-1 text-center">
        <h2 className="mt-4 md:mt-0 text-3xl pb-3 md:pb-10 font-semibold">
          Create an account and join our community today
        </h2>
        <p className=" text-l md:text-xl pb-8">
          We&apos;re thrilled to have you onboard!
        </p>

        <RegisterForm setModalIsOpen={setModalIsOpen} />

        <Link
          href="/login"
          className="text-s underline
         hover:text-base-secondary"
        >
          Already have an account?
        </Link>
      </div>
      <div className="bg-yellow-200 flex-1 order-first">
        <Image src={registerImage} alt="" className={imageCover} />
      </div>
    </div>
  );
}

export default Register;
