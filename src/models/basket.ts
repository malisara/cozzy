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
  itemId: number;
  quantity: number;

  constructor(itemId: number, quantity: number) {
    this.itemId = itemId;
    this.quantity = quantity;
  }
}
