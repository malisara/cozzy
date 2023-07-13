"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsBasket3 } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineUser, AiOutlineClose } from "react-icons/ai";

import useMediaQuery from "../hooks/useMediaQuery";
import { links } from "./routes";

// todo
//hover
//transparent bg

type Props = {
  // transparentNav: boolean;
};

function Navbar({}: Props): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 1060px)");
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [navOnTop, setNavOnTop] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY === 0 ? setNavOnTop(true) : setNavOnTop(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const navbarBg = navOnTop ? "bg-transparent" : "bg-stone-50 drop-shadow-lg";

  const iconStyle = "hover:text-base-secondary text-lg";

  return (
    <div>
      <div
        className={`fixed top-0 w-full h-16 
      flex items-center px-10 z-10 ${navbarBg}`}
      >
        {/* navbar */}
        <div className="pe-5">LOGO</div>

        {/* links */}
        {isDesktop && (
          <div className="flex gap-5">
            {links.map((link) => {
              return (
                <Link
                  key={link.id}
                  href={link.url}
                  className="hover:text-base-secondary"
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
      {!isDesktop && mobileNavOpen && (
        <div
          className=" fixed top-0 w-[50vw] h-[100vh] z-30 
        bg-stone-50 drop-shadow-lg ps-10 "
        >
          <div className="pe-10 flex py-10 justify-between items-center">
            LOGO
            <button onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              <AiOutlineClose className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-col gap-10">
            {links.map((link) => {
              return (
                <Link key={link.id} href={link.url}>
                  {link.title.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
