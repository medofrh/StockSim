```plantUML
@startuml
hide empty members
skinparam classAttributeIconSize 0

package "domain" {
  class Ticker {
    +symbol: string
  }
  class Stock {
    +ticker: Ticker
    +name: string
    +sector: string
  }
  class Quote {
    +ticker: Ticker
    +price: number
    +timestamp: number
  }
  class Candle {
    +ticker: Ticker
    +open: number
    +startTimestamp: number
    -high: number
    -low: number
    -close: number
    -volume: number
    +update(quote: Quote)
  }
  class PriceEvent {
    +quote: Quote
  }
}

package "observer" {
  interface Observer<T> {
    +update(data: T)
  }
  class SimpleSubject<T> {
    -observers: Set<Observer<T>>
    +subscribe(observer: Observer<T>)
    +unsubscribe(observer: Observer<T>)
    #notify(data: T)
  }
  class PriceFeed {
    +push(quote: Quote)
  }
  class AlertObserver {
    -lastPrices: Map<string, number>
    -threshold: number
    +update(event: PriceEvent)
  }
  class LoggerObserver {
    +update(event: PriceEvent)
  }
  class ChartObserver {
    -candles: Map<string, Candle>
    +update(event: PriceEvent)
    +getCandle(symbol: string)
    +snapshot()
  }
}

package "sim" {
  class MarketClock {
    +now(): number
  }
  class RandomWalkGenerator {
    -drift: number
    -volatility: number
    +next(previousPrice: number): number
  }
}

package "trading" {
  enum Side {
    BUY
    SELL
  }
  class Order {
    {static} -nextId: number
    +id: number
    +symbol: string
    +side: Side
    +quantity: number
    +limit: number
    +timestamp: number
  }
  class OrderBook {
    -bids: Order[]
    -asks: Order[]
    +add(order: Order)
    +takeMatchingOrders(side: Side, symbol: string, predicate)
    +snapshot()
  }
  class MatchingEngine {
    -book: OrderBook
    +submit(order: Order)
    +onQuote(quote: Quote): Trade[]
    +pendingOrders()
  }
  class Trade {
    +symbol: string
    +price: number
    +quantity: number
    +side: Side
    +timestamp: number
  }
  class Position {
    +symbol: string
    +quantity: number
    +averageCost: number
    +applyBuy(price: number, quantity: number)
    +applySell(price: number, quantity: number)
  }
  class Portfolio {
    -positions: Map<string, Position>
    +cash: number
    +applyTrade(trade: Trade)
    +getPosition(symbol: string)
    +snapshot()
  }
  abstract class Strategy {
    #engine: MatchingEngine
    #clock: MarketClock
    +update(event: PriceEvent)
  }
  class MeanReversionStrategy {
    -lastPrice: Map<string, number>
    -buyThreshold: number
    -sellThreshold: number
    +update(event: PriceEvent)
  }
}

SimpleSubject <|-- PriceFeed
Observer <|.. Strategy
Observer <|.. AlertObserver
Observer <|.. LoggerObserver
Observer <|.. ChartObserver

Strategy <|-- MeanReversionStrategy
Strategy o--> MatchingEngine
Strategy o--> MarketClock
MeanReversionStrategy --> Order

PriceFeed --> PriceEvent
PriceFeed --> Observer : notifies
PriceFeed ..> Quote : consumes
PriceEvent --> Quote
Quote --> Ticker
Stock --> Ticker
Candle --> Quote
Candle --> Ticker
ChartObserver *-- Candle

SimpleSubject o--> Observer
MatchingEngine *-- OrderBook
MatchingEngine --> Trade
MatchingEngine --> Quote
MatchingEngine --> Order
OrderBook --> Order
Order --> Side
Trade --> Side

Portfolio *-- Position
Portfolio --> Trade
Portfolio --> Side
@enduml
```