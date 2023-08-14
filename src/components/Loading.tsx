import { PiCoatHanger } from "react-icons/pi";

import { flexCenter } from "./utils/style";

function Loading(): JSX.Element {
  return (
    <div className={`${flexCenter}  mt-[30vh] lg:mt-[40vh]`}>
      <PiCoatHanger
        className="animate-spin text-[7rem]
       text-base-secondary"
      />
    </div>
  );
}

export default Loading;
