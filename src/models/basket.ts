export class Basket {
  constructor(
    public basketId: number | null,
    public userId: number | null,
    public date: Date | null,
    public items: BasketItem[]
  ) {}
}

export class BasketItem {
  constructor(public productId: number, public quantity: number) {}
}
