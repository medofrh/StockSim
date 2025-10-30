import { PriceEvent } from '../domain/PriceEvent';
import { Observer } from './Observer';

export class LoggerObserver implements Observer<PriceEvent> {
  update(event: PriceEvent): void {
    const { ticker, price } = event.quote;
    console.log(`[LOG] ${ticker.symbol} ${price.toFixed(2)}`);
  }
}
