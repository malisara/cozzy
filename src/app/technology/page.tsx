import ItemsDisplay from "@/components/itemsDisplay/ItemsDisplay";
import Title from "@/components/title/Title";

function Technology(): JSX.Element {
  return (
    <div>
      <div className="bg-white">
        <Title title={"technology"} />
        <ItemsDisplay category={"electronics"} />
      </div>
    </div>
  );
}

export default Technology;
