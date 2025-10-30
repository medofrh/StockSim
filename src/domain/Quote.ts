import { Ticker } from './Ticker';

export class Quote {
  constructor(
    public readonly ticker: Ticker,
    public readonly price: number,
    public readonly timestamp: number
  ) {}
}
