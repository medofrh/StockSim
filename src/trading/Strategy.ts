import { PriceEvent } from '../domain/PriceEvent';
import { MarketClock } from '../sim/MarketClock';
import { Observer } from '../observer/Observer';
import { MatchingEngine } from './MatchingEngine';

export abstract class Strategy implements Observer<PriceEvent> {
  protected constructor(
    protected readonly engine: MatchingEngine,
    protected readonly clock: MarketClock
  ) {}

  abstract update(event: PriceEvent): void;
}
