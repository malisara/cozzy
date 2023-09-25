import BannerText from "@/components/BannerText";
import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import ItemsByCategory from "@/components/ItemsByCategory";
import Title from "@/components/Title";
import { ITEM_DISPLAY_LIMIT } from "@/constants";

export default function Home(): JSX.Element {
  return (
    <main className="mt-16">
      <Hero />
      <BannerText />
      <div className="text-center">
        <Title title={"explore our categories"} />
      </div>
      <Categories />
      <ItemsByCategory limit={ITEM_DISPLAY_LIMIT} />
    </main>
  );
}
