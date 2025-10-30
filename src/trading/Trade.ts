import { Side } from './Order';

export class Trade {
  constructor(
    public readonly symbol: string,
    public readonly price: number,
    public readonly quantity: number,
    public readonly side: Side,
    public readonly timestamp: number
  ) {}
}
