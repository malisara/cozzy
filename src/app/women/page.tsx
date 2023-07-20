import ItemsDisplay from "@/components/itemsDisplay/ItemsDisplay";
import Title from "@/components/title/Title";

function Women(): JSX.Element {
  return (
    <div>
      <div className="bg-white">
        <Title title={"women's clothing"} />
        <ItemsDisplay category={"women's clothing"} />
      </div>
    </div>
  );
}

export default Women;
