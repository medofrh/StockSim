import { Stock } from './domain/Stock';
import { Ticker } from './domain/Ticker';
import { Quote } from './domain/Quote';
import { PriceFeed } from './observer/PriceFeed';
import { AlertObserver } from './observer/AlertObserver';
import { ChartObserver } from './observer/ChartObserver';
import { LoggerObserver } from './observer/LoggerObserver';
import { MarketClock } from './sim/MarketClock';
import { RandomWalkGenerator } from './sim/RandomWalkGenerator';
import { MatchingEngine } from './trading/MatchingEngine';
import { Portfolio } from './trading/Portfolio';
import { MeanReversionStrategy } from './trading/MeanReversionStrategy';

declare const process: {
  on(event: string, listener: (...args: unknown[]) => void): void;
  exit(code?: number): void;
};

const clock = new MarketClock();
const engine = new MatchingEngine();
const portfolio = new Portfolio(10000);
const feed = new PriceFeed();

const logger = new LoggerObserver();
const alert = new AlertObserver();
const chart = new ChartObserver();
const strategy = new MeanReversionStrategy(engine, clock);

feed.subscribe(logger);
feed.subscribe(alert);
feed.subscribe(chart);
feed.subscribe(strategy);

const generator = new RandomWalkGenerator();

const stocks: Stock[] = [
  new Stock(new Ticker('AAPL'), 'Apple Inc.', 'Technology'),
  new Stock(new Ticker('MSFT'), 'Microsoft Corp.', 'Technology'),
  new Stock(new Ticker('GOOGL'), 'Alphabet Inc.', 'Communication Services'),
  new Stock(new Ticker('AMZN'), 'Amazon.com Inc.', 'Consumer Discretionary'),
  new Stock(new Ticker('TSLA'), 'Tesla Inc.', 'Consumer Discretionary'),
  new Stock(new Ticker('NVDA'), 'NVIDIA Corp.', 'Technology')
];

const lastPrices = new Map<string, number>();
stocks.forEach((stock) => {
  lastPrices.set(stock.ticker.symbol, 100 + Math.random() * 20);
});

let tickCount = 0;

const interval = setInterval(() => {
  tickCount += 1;

  for (const stock of stocks) {
    const symbol = stock.ticker.symbol;
    const previousPrice = lastPrices.get(symbol) ?? 100;
    const nextPrice = generator.next(previousPrice);
    lastPrices.set(symbol, nextPrice);

    const quote = new Quote(stock.ticker, nextPrice, clock.now());
    feed.push(quote);

    const trades = engine.onQuote(quote);
    trades.forEach((trade) => portfolio.applyTrade(trade));
  }

  if (tickCount % 25 === 0) {
    const snapshot = portfolio.snapshot();
    console.log('--- Portfolio Snapshot ---');
    console.log(`cash=${snapshot.cash.toFixed(2)}`);
    const positions = Object.entries(snapshot.positions);
    if (positions.length === 0) {
      console.log('positions: {}');
    } else {
      for (const [symbol, position] of positions) {
        console.log(
          `positions: ${symbol} qty=${position.quantity} avg=${position.averageCost.toFixed(2)}`
        );
      }
    }
  }
}, 800);

process.on('SIGINT', () => {
  clearInterval(interval);
  const snapshot = portfolio.snapshot();
  console.log('\nSummary:');
  console.log(`  cash=${snapshot.cash.toFixed(2)}`);
  console.log('  positions:', snapshot.positions);
  process.exit(0);
});
