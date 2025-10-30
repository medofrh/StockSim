import { Quote } from './Quote';
import { Ticker } from './Ticker';

export class Candle {
  public high: number;
  public low: number;
  public close: number;
  public volume = 1;

  constructor(
    public readonly ticker: Ticker,
    public readonly open: number,
    public readonly startTimestamp: number
  ) {
    this.high = open;
    this.low = open;
    this.close = open;
  }

  update(quote: Quote): void {
    if (quote.ticker.symbol !== this.ticker.symbol) {
      return;
    }

    this.high = Math.max(this.high, quote.price);
    this.low = Math.min(this.low, quote.price);
    this.close = quote.price;
    this.volume += 1;
  }
}
