import Link from "next/link";

const margins = "mt-10 lg:mt-10";

function NoItemsError(): JSX.Element {
  return (
    <div className="mt-[8rem] text-center text-xl px-4">
      <div className="font-semibold text-3xl text-base-secondary">
        No results found
      </div>

      <div className={`font-normal text-xl ${margins}`}>
        Oops! We couldn't find any items matching your search.
      </div>

      <div className={margins}>
        <Link href={"/"} className="text-base-secondary underline font-light">
          go to homepage
        </Link>
      </div>
    </div>
  );
}

export default NoItemsError;
