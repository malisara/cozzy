"use client";

import Link from "next/link";
import React, { useState } from "react";
import { BsBasket3 } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineUser } from "react-icons/ai";

import useMediaQuery from "../hooks/useMediaQuery";
import { links } from "./routes";

type Props = {
  transparentNav: boolean;
};

function Navbar({ transparentNav }: Props): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 1060px)");
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const navbarBg = transparentNav
    ? "bg-transparent"
    : "bg-stone-50 drop-shadow-lg";

  const iconStyle = "hover:text-base-secondary text-lg";

  return (
    <nav
      className={`fixed top-0 w-full h-16 
      flex items-center px-10 ${navbarBg}`}
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

        {!isDesktop && <RxHamburgerMenu className={`${iconStyle}`} />}
      </div>
    </nav>
  );
}

export default Navbar;
