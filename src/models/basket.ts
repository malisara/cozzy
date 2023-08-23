export class BasketItems {
  basketId: number | null;
  userId: number | null;
  date: Date | null;
  items: BasketItem[];

  constructor(
    basketId: number | null,
    userId: number | null,
    date: Date | null,
    items: BasketItem[]
  ) {
    this.basketId = basketId;
    this.userId = userId;
    this.date = date;
    this.items = items;
  }
}

export class BasketItem {
  productId: number;
  quantity: number;

  constructor(productId: number, quantity: number) {
    this.productId = productId;
    this.quantity = quantity;
  }
}
