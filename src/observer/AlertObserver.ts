import { PriceEvent } from '../domain/PriceEvent';
import { Observer } from './Observer';

export class AlertObserver implements Observer<PriceEvent> {
  private readonly lastPrices = new Map<string, number>();
  private readonly threshold = 0.05;

  update(event: PriceEvent): void {
    const { ticker, price } = event.quote;
    const symbol = ticker.symbol;
    const previous = this.lastPrices.get(symbol);

    if (previous !== undefined) {
      const diff = (price - previous) / previous;
      if (Math.abs(diff) >= this.threshold) {
        const sign = diff >= 0 ? '+' : '';
        console.log(
          `[ALERT] Large move in ${symbol} (${sign}${(diff * 100).toFixed(1)}%)`
        );
      }
    }

    this.lastPrices.set(symbol, price);
  }
}
