import { Order, Side } from './Order';

const BUY: Side = 'BUY';

export class OrderBook {
  private bids: Order[] = [];
  private asks: Order[] = [];

  add(order: Order): void {
    if (order.side === BUY) {
      this.bids.push(order);
      this.bids.sort((a, b) => {
        if (b.limit === a.limit) {
          return a.timestamp - b.timestamp;
        }
        return b.limit - a.limit;
      });
    } else {
      this.asks.push(order);
      this.asks.sort((a, b) => {
        if (a.limit === b.limit) {
          return a.timestamp - b.timestamp;
        }
        return a.limit - b.limit;
      });
    }
  }

  takeMatchingOrders(
    side: Side,
    symbol: string,
    predicate: (order: Order) => boolean
  ): Order[] {
    const source = side === BUY ? this.bids : this.asks;
    const matched: Order[] = [];
    const remaining: Order[] = [];

    for (const order of source) {
      if (order.symbol !== symbol) {
        remaining.push(order);
        continue;
      }

      if (predicate(order)) {
        matched.push(order);
      } else {
        remaining.push(order);
      }
    }

    if (side === BUY) {
      this.bids = remaining;
    } else {
      this.asks = remaining;
    }

    return matched;
  }

  snapshot(): { bids: Order[]; asks: Order[] } {
    return {
      bids: [...this.bids],
      asks: [...this.asks]
    };
  }
}
