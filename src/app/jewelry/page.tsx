import ItemsDisplay from "@/components/itemsDisplay/ItemsDisplay";
import Title from "@/components/title/Title";

function Jewelry(): JSX.Element {
  return (
    <div>
      {/* todo */}
      <div className="bg-white">
        <Title title={"jewelry"} />
        <ItemsDisplay category={"jewelery"} />
      </div>
    </div>
  );
}

export default Jewelry;
