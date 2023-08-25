import Link from "next/link";

const margins = "mt-10 lg:mt-10";

type Props = { errorMessage: string };

function GeneralError({ errorMessage }: Props): JSX.Element {
  return (
    <div className="mt-[8rem] text-center text-xl px-4">
      <div className="font-semibold text-3xl text-base-secondary">Ooops!</div>

      <div className={`font-normal text-xl ${margins}`}>
        {errorMessage}
        <p>Please try again later or contact customer support.</p>
      </div>

      <div className={margins}>
        <Link href={"/"} className="text-base-secondary underline font-light">
          go to homepage
        </Link>
      </div>
    </div>
  );
}

export default GeneralError;
