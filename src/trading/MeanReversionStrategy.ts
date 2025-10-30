import { PriceEvent } from '../domain/PriceEvent';
import { MarketClock } from '../sim/MarketClock';
import { MatchingEngine } from './MatchingEngine';
import { Order } from './Order';
import { Strategy } from './Strategy';

export class MeanReversionStrategy extends Strategy {
  private readonly lastPrice = new Map<string, number>();
  private readonly buyThreshold = -0.01;
  private readonly sellThreshold = 0.015;

  constructor(engine: MatchingEngine, clock: MarketClock) {
    super(engine, clock);
  }

  update(event: PriceEvent): void {
    const { quote } = event;
    const symbol = quote.ticker.symbol;
    const previous = this.lastPrice.get(symbol);

    if (previous !== undefined) {
      const change = (quote.price - previous) / previous;
      if (change <= this.buyThreshold) {
        const limit = Number((quote.price * 0.999).toFixed(2));
        const order = new Order(symbol, 'BUY', 1, limit, this.clock.now());
        this.engine.submit(order);
      } else if (change >= this.sellThreshold) {
        const limit = Number((quote.price * 1.001).toFixed(2));
        const order = new Order(symbol, 'SELL', 1, limit, this.clock.now());
        this.engine.submit(order);
      }
    }

    this.lastPrice.set(symbol, quote.price);
  }
}
