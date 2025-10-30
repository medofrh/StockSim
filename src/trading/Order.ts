export type Side = 'BUY' | 'SELL';

export class Order {
  private static nextId = 1;
  public readonly id: number;

  constructor(
    public readonly symbol: string,
    public readonly side: Side,
    public readonly quantity: number,
    public readonly limit: number,
    public readonly timestamp: number
  ) {
    this.id = Order.nextId++;
  }
}
