"use client";

import { Triangle } from "react-loader-spinner";

import { flexCenter } from "./utils/style";

function Loading(): JSX.Element {
  return (
    <div className={`${flexCenter}  mt-[30vh] lg:mt-[40vh]`}>
      <Triangle
        height="90"
        width="90"
        color="#F8B723"
        ariaLabel="triangle-loading"
        visible={true}
      />
    </div>
  );
}

export default Loading;
