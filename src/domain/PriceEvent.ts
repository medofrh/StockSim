import { Quote } from './Quote';

export class PriceEvent {
  constructor(public readonly quote: Quote) {}
}
