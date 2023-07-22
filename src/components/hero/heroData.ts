import HeroMen from "../../../public/hero-men.png";
import HeroWomen from "../../../public/hero-women.png";
import HeroJewelry from "../../../public/hero-jewelry.png";

import CategoryMen from "../../../public/category-men.png";
import CategoryWomen from "../../../public/category-women.png";
import CategoryJewelry from "../../../public/category-jewelry.png";

export const urlData = [
  {
    id: 0,
    src: HeroWomen,
    alt: "women's clothing",
    title: "Comfort",
    buttonContent: "women",
    url: "/women",
    category_image: CategoryWomen,
  },
  {
    id: 1,
    src: HeroMen,
    alt: "men's clothing",
    title: "Elegance",
    buttonContent: "men",
    url: "/men",
    category_image: CategoryMen,
  },
  {
    id: 2,
    src: HeroJewelry,
    alt: "jewelry",
    title: "Timeless pieces",
    buttonContent: "jewelry",
    url: "/jewelry",
    category_image: CategoryJewelry,
  },
];
