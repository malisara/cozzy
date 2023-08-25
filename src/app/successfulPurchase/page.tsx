"use client";

import React, { useRef } from "react";
import Confetti from "react-confetti";

import { flexCenter } from "@/components/utils/style";

function successfulPurchase() {
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  return (
    <div
      className={`${flexCenter} mt-[15rem] text-3xl px-5 flex-wrap 
      text-center text-gray-600`}
    >
      Thank you for your purchase
      <Confetti width={windowSize.current[0]} height={windowSize.current[1]} />
    </div>
  );
}

export default successfulPurchase;
