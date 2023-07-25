import { PiCoatHanger } from "react-icons/pi";

import { flexCenter } from "../utils/style";

function Loading(): JSX.Element {
  return (
    <div className={`${flexCenter} mt-[10rem] lg:mt-[15rem]`}>
      <PiCoatHanger
        className="animate-spin text-[7rem]
       text-base-secondary"
      />
    </div>
  );
}

export default Loading;