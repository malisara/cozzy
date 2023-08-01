import BannerText from "@/components/BannerText";
import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import ExploreItems from "@/components/ExploreItems";
import Title from "@/components/Title";
import { ITEM_DISPLAY_LIMIT } from "@/constants";

export default function Home(): JSX.Element {
  return (
    <main className="mt-16">
      <Hero />
      <BannerText />
      <Title title={"explore our categories"} />
      <Categories />
      <ExploreItems limit={ITEM_DISPLAY_LIMIT} />
    </main>
  );
}
