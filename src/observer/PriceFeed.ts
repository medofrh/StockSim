import { PriceEvent } from '../domain/PriceEvent';
import { Quote } from '../domain/Quote';
import { SimpleSubject } from './SimpleSubject';

export class PriceFeed extends SimpleSubject<PriceEvent> {
  push(quote: Quote): void {
    const event = new PriceEvent(quote);
    this.notify(event);
  }
}
