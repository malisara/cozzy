export default class Item {
  id: number;
  title: string;
  price: number;
  image: string;
  rate?: number;
  rate_count?: number;

  constructor(
    id: number,
    title: string,
    price: number,
    image: string,
    rate?: number,
    rate_count?: number
  ) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.image = image;
    this.rate = rate;
    this.rate_count = rate_count;
  }
}
