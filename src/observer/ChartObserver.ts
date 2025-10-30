import { Candle } from '../domain/Candle';
import { PriceEvent } from '../domain/PriceEvent';
import { Observer } from './Observer';

export class ChartObserver implements Observer<PriceEvent> {
  private readonly candles = new Map<string, Candle>();

  update(event: PriceEvent): void {
    const { quote } = event;
    const symbol = quote.ticker.symbol;
    let candle = this.candles.get(symbol);

    if (!candle) {
      candle = new Candle(quote.ticker, quote.price, quote.timestamp);
      this.candles.set(symbol, candle);
    }

    candle.update(quote);
  }

  getCandle(symbol: string): Candle | undefined {
    return this.candles.get(symbol);
  }

  snapshot(): Record<string, Candle> {
    const entries: [string, Candle][] = Array.from(this.candles.entries());
    return Object.fromEntries(entries);
  }
}
