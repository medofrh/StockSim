```plantUML
@startuml
hide footbox
skinparam sequenceMessageAlign center

participant "Main Loop" as Main
participant RandomWalkGenerator as Generator
participant MarketClock as Clock
participant PriceFeed as Feed
participant LoggerObserver as Logger
participant AlertObserver as Alert
participant ChartObserver as Chart
participant MeanReversionStrategy as Strategy
participant MatchingEngine as Engine
participant OrderBook as Book
participant Portfolio as Portfolio
participant Position as Position

Main -> Generator: next(previousPrice)
Generator --> Main: nextPrice

Main -> Clock: now()
Clock --> Main: timestamp

Main -> Feed: push(Quote)

Feed -> Feed: create PriceEvent
Feed -> Logger: update(event)
Logger --> Feed: log quote

Feed -> Alert: update(event)
Alert --> Feed: optional alert

Feed -> Chart: update(event)
Chart -> Chart: ensure Candle(symbol)
Chart --> Feed: update candle

Feed -> Strategy: update(event)
Strategy -> Strategy: compute change
alt threshold met
  Strategy -> Strategy: create Order
  Strategy -> Engine: submit(order)
  Engine -> Book: add(order)
end

Main -> Engine: onQuote(quote)

Engine -> Book: takeMatchingOrders('BUY', symbol, price >= limit)
Book --> Engine: matchedBuys

Engine -> Engine: build Trade objects
Engine -> Book: takeMatchingOrders('SELL', symbol, price <= limit)
Book --> Engine: matchedSells
Engine --> Main: trades[]

loop trade in trades
  Main -> Portfolio: applyTrade(trade)
  Portfolio -> Portfolio: getOrCreate(symbol)
  Portfolio -> Position: applyBuy/applySell(price, qty)
  Position --> Portfolio: updated state
  Portfolio --> Main: cash/positions updated
end
@enduml
```