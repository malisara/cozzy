import ItemList from "@/components/ItemList";
import Title from "@/components/Title";

function Saved(): JSX.Element {
  return (
    <div className="mt-[5rem">
      <Title title={"Saved items"} />
      <ItemList />
    </div>
  );
}

export default Saved;
