import { Ticker } from './Ticker';

export class Stock {
  constructor(
    public readonly ticker: Ticker,
    public readonly name: string,
    public readonly sector: string
  ) {}
}
