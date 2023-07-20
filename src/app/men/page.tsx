import ItemsDisplay from "@/components/itemsDisplay/ItemsDisplay";
import Title from "@/components/title/Title";

function Men(): JSX.Element {
  return (
    <div>
      <div className="bg-white">
        <Title title={"men's clothing"} />
        <ItemsDisplay category={"men's clothing"} />
      </div>
    </div>
  );
}

export default Men;
