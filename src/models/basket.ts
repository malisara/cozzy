export class BasketItems {
  userId: number;
  date: Date;
  items: BasketItem[];

  constructor(userId: number, date: Date, items: BasketItem[]) {
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
