"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsBasket3 } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineUser, AiOutlineClose } from "react-icons/ai";

import useMediaQuery from "../hooks/useMediaQuery";
import { links } from "./routes";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

function Navbar(): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 1060px)");
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [navOnTop, setNavOnTop] = useState<boolean>(true);
  const router = usePathname();
  const navbarBg =
    navOnTop && router === "/"
      ? "bg-transparent"
      : "bg-stone-50 border-b-2 border-b-base-secondary";
  const iconStyle = "hover:text-base-secondary text-lg";

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY === 0 ? setNavOnTop(true) : setNavOnTop(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <div>
      <div
        className={`fixed top-0 w-full h-16 flex items-center 
        px-10 z-10 transtion-all duration-300 ${navbarBg}`}
      >
        {/* navbar */}
        <Link href="/" className="pe-5">
          LOGO
        </Link>

        {/* links */}
        {isDesktop && (
          <div className="flex gap-5">
            {links.map((link) => {
              return (
                <Link
                  key={link.id}
                  href={link.url}
                  className={`hover:text-base-secondary
                  ${router === link.url && "text-base-secondary"}
                  `}
                >
                  {link.title.toUpperCase()}
                </Link>
              );
            })}
          </div>
        )}

        {/* icons */}
        <div className="flex gap-5 ml-auto">
          <Link href={"/"}>
            <BsBasket3 className={`${iconStyle}`} />
          </Link>

          <Link href={"/"}>
            <AiOutlineUser className={`${iconStyle}`} />
          </Link>

          {!isDesktop && (
            <button onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              <RxHamburgerMenu className={`${iconStyle}`} />
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
              <Link href="/">LOGO</Link>

              <button onClick={() => setMobileNavOpen(!mobileNavOpen)}>
                <AiOutlineClose className="text-gray-400" />
              </button>
            </div>

            <div className="flex flex-col gap-10">
              {links.map((link) => {
                return (
                  <Link
                    key={link.id}
                    href={link.url}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {link.title.toUpperCase()}
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
