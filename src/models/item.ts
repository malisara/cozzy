export default class Item {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public image: string,
    public rate?: number,
    public rate_count?: number,
    public description?: string,
    public category?: string
  ) {}
}
