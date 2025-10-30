import { Quote } from '../domain/Quote';
import { Order, Side } from './Order';
import { OrderBook } from './OrderBook';
import { Trade } from './Trade';

export class MatchingEngine {
  private readonly book = new OrderBook();

  submit(order: Order): void {
    this.book.add(order);
  }

  onQuote(quote: Quote): Trade[] {
    const symbol = quote.ticker.symbol;
    const trades: Trade[] = [];

    const filledBuys = this.book.takeMatchingOrders(
      'BUY',
      symbol,
      (order) => order.limit >= quote.price
    );

    for (const order of filledBuys) {
      trades.push(
        new Trade(order.symbol, quote.price, order.quantity, order.side, quote.timestamp)
      );
    }

    const filledSells = this.book.takeMatchingOrders(
      'SELL',
      symbol,
      (order) => order.limit <= quote.price
    );

    for (const order of filledSells) {
      trades.push(
        new Trade(order.symbol, quote.price, order.quantity, order.side, quote.timestamp)
      );
    }

    return trades;
  }

  pendingOrders(): { bids: Order[]; asks: Order[] } {
    return this.book.snapshot();
  }
}
