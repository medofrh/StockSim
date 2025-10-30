import { Position } from './Position';
import { Side } from './Order';
import { Trade } from './Trade';

export class Portfolio {
  private readonly positions = new Map<string, Position>();

  constructor(public cash = 10000) {}

  applyTrade(trade: Trade): void {
    const position = this.getOrCreate(trade.symbol);
    const notional = trade.price * trade.quantity;

    if (trade.side === 'BUY') {
      this.cash -= notional;
      position.applyBuy(trade.price, trade.quantity);
    } else {
      this.cash += notional;
      position.applySell(trade.price, trade.quantity);
    }

    console.log(
      `[TRADE] ${trade.side} ${trade.symbol} ${trade.quantity} @ ${trade.price.toFixed(
        2
      )} cash=${this.cash.toFixed(2)}`
    );
  }

  getPosition(symbol: string): Position | undefined {
    return this.positions.get(symbol);
  }

  snapshot(): { cash: number; positions: Record<string, { quantity: number; averageCost: number }> } {
    const positions: Record<string, { quantity: number; averageCost: number }> = {};
    for (const [symbol, position] of this.positions.entries()) {
      if (position.quantity !== 0) {
        positions[symbol] = {
          quantity: position.quantity,
          averageCost: position.averageCost
        };
      }
    }

    return {
      cash: this.cash,
      positions
    };
  }

  private getOrCreate(symbol: string): Position {
    let position = this.positions.get(symbol);
    if (!position) {
      position = new Position(symbol);
      this.positions.set(symbol, position);
    }
    return position;
  }
}
