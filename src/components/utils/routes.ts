import HeroMen from "@/../public/hero-men.png";
import HeroWomen from "@/../public/hero-women.png";
import HeroJewelry from "@/../public/hero-jewelry.png";

import CategoryMen from "@/../public/category-men.png";
import CategoryWomen from "@/../public/category-women.png";
import CategoryJewelry from "@/../public/category-jewelry.png";

export const urlData = [
  {
    id: 0,
    src: HeroWomen,
    nav_title: "women",
    alt: "women's clothing",
    title: "Comfort",
    url: "/women",
    category_image: CategoryWomen,
  },
  {
    id: 1,
    src: HeroMen,
    nav_title: "men",
    alt: "men's clothing",
    title: "Elegance",
    url: "/men",
    category_image: CategoryMen,
  },
  {
    id: 2,
    src: HeroJewelry,
    nav_title: "jewelry",
    alt: "jewelery", //typo in docs
    title: "Timeless pieces",
    url: "/jewelry",
    category_image: CategoryJewelry,
  },
];
