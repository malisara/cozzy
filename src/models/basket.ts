export class BasketItems {
  userId: number | null;
  date: Date | null;
  items: BasketItem[];

  constructor(userId: number | null, date: Date | null, items: BasketItem[]) {
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
