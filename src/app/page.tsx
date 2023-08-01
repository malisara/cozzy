import BannerText from "@/components/bannerText/BannerText";
import Categories from "@/components/categories/Categories";
import Hero from "@/components/hero/Hero";
import ItemsAndTitle from "@/components/itemsAndTitle/ItemsAndTitle";
import Title from "@/components/title/Title";
import { ITEM_DISPLAY_LIMIT } from "@/constants";

export default function Home(): JSX.Element {
  return (
    <main className="mt-16">
      <Hero />
      <BannerText />
      <Title title={"explore our categories"} />
      <Categories />
      <ItemsAndTitle title={"all items"} limit={ITEM_DISPLAY_LIMIT} />
    </main>
  );
}
