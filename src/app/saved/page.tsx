"use client";

import GeneralError from "@/components/errorComponents/GeneralError";
import { useGlobalContext } from "@/context/GlobalContext";
import { flexCenter } from "@/components/utils/style";
import Items from "@/components/Items";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { useGetItemsById } from "@/fetchers/fetchItems";

function Saved(): JSX.Element {
  const { savedItems } = useGlobalContext();
  const { data, error, isLoading } = useGetItemsById(savedItems);

  if (error) return <GeneralError errorMessage="unable to load saved items" />;
  if (isLoading || !data) return <Loading />;

  return (
    <div className="mt-[5rem">
      <Title title={"Saved items"} />
      {data.length > 0 ? (
        <Items data={data} />
      ) : (
        <p className={flexCenter}>You don&apos;t have any items saved yet.</p>
      )}
    </div>
  );
}

export default Saved;
