```plantUML
@startuml
left to right direction

actor Trader
actor "Strategy Developer" as Dev
actor "Synthetic Market" as Market

rectangle "StockSim" {
  usecase "Start Simulation" as UC_Start
  usecase "Monitor Market Data" as UC_Monitor
  usecase "Visualize Candles" as UC_Chart
  usecase "Receive Alerts" as UC_Alert
  usecase "Run Automated Strategy" as UC_Strategy
  usecase "Submit Orders" as UC_Order
  usecase "Manage Portfolio" as UC_Portfolio
  usecase "Review Trade Log" as UC_Log
}

Trader --> UC_Start
Trader --> UC_Monitor
Trader --> UC_Portfolio
Trader --> UC_Log

Dev --> UC_Strategy

Market --> UC_Start
Market --> UC_Monitor

UC_Monitor ..> UC_Chart : <<include>>
UC_Monitor ..> UC_Alert : <<extend>>
UC_Strategy ..> UC_Order : <<include>>
UC_Order ..> UC_Portfolio : <<include>>
UC_Monitor ..> UC_Log : <<include>>
UC_Start ..> UC_Strategy : <<include>>

@enduml
```
