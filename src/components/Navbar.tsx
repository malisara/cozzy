"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AiOutlineUser,
  AiOutlineClose,
  AiOutlineHeart,
  AiOutlineLogout,
} from "react-icons/ai";
import { BsBasket3 } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { toast } from "react-toastify";

import { SESSION_TOKEN, USER_ID } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContext";
import useMediaQuery from "./hooks/useMediaQuery";
import { urlData } from "./utils/routes";
import { flexCenter } from "./utils/style";
import logo from "@/../public/logo.png";

const iconStyle = "hover:text-base-secondary text-lg";

function Navbar(): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 1060px)");
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [navOnTop, setNavOnTop] = useState<boolean>(true);
  const currentPath = usePathname();
  const { basketItems, userId, setUserId } = useGlobalContext();
  const [basketItemsCOunt, setBasketItemsCount] = useState(0);

  const navbarBg =
    navOnTop && currentPath === "/"
      ? "bg-transparent"
      : "bg-stone-50 border-b-2 border-b-base-secondary";

  useEffect(() => {
    //handle scroll
    const handleScroll = () => {
      window.scrollY === 0 ? setNavOnTop(true) : setNavOnTop(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  function logout(): void {
    //todo
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_TOKEN, "");
      sessionStorage.setItem(USER_ID, JSON.stringify(0));
    }
    setUserId(0);
    toast.success("you're logegd out");
  }

  useEffect(() => {
    //calculate number of items in basket
    const basketItemsCount = basketItems.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setBasketItemsCount(basketItemsCount);
  }, [basketItems]);

  return (
    <div>
      <div
        className={`fixed top-0 w-full h-16 flex items-center 
        px-10 z-10 transtion-all duration-300 ${navbarBg}`}
      >
        <Link href="/" className="pe-5">
          <p className="font-bold text-2xl mr-4">COZZY </p>
        </Link>

        {/* links */}
        {isDesktop && (
          <div className="flex gap-5">
            {urlData.map((link) => {
              return (
                <Link
                  key={link.id}
                  href={link.url}
                  className={`hover:text-base-secondary
                  ${currentPath === link.url && "text-base-secondary"}
                  `}
                >
                  {link.nav_title.toUpperCase()}
                </Link>
              );
            })}
          </div>
        )}

        {/* icons */}
        <div className="flex gap-5 ml-auto">
          <Link href={"/saved"}>
            <AiOutlineHeart className={iconStyle} />
          </Link>

          <Link href="/basket" className="relative">
            <BsBasket3 className={iconStyle} />

            {basketItemsCOunt > 0 && userId !== 0 && (
              <div
                className={`absolute top-0 right-0 bg-yellow-500
                 text-white font-bold rounded-full w-5 h-5 text-xs 
                 -translate-y-2 translate-x-2 ${flexCenter}`}
              >
                {basketItemsCOunt}
              </div>
            )}
          </Link>

          {userId === 0 ? (
            <Link href={"/login"}>
              <AiOutlineUser className={iconStyle} />
            </Link>
          ) : (
            <button onClick={logout}>
              <AiOutlineLogout className={iconStyle} />
            </button>
          )}

          {!isDesktop && (
            <button onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              <RxHamburgerMenu className={iconStyle} />
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {!isDesktop && mobileNavOpen && (
          <motion.div
            className="fixed top-0 w-[50vw] h-[100vh] z-20
        bg-stone-50 drop-shadow-lg ps-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pe-10 flex py-10 justify-between items-center">
              <Link href="/" className="pe-5">
                <p className="font-bold text-2xl">COZZY </p>
              </Link>

              <button onClick={() => setMobileNavOpen(!mobileNavOpen)}>
                <AiOutlineClose className="text-gray-400" />
              </button>
            </div>

            <div className="flex flex-col gap-10">
              {urlData.map((link) => {
                return (
                  <Link
                    key={link.id}
                    href={link.url}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {link.nav_title.toUpperCase()}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
