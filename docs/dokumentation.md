# StockSim – Kurz-Dokumentation

1. **Einleitung**
StockSim ist eine kleine Konsolenanwendung im Node.js/TypeScript‑Ökosystem, die einen vollständigen Handelskreislauf – Preisstrom, Orderplatzierung, Ausführung und Portfolioverbuchung – simuliert. Kursbewegungen werden automatisch generiert und in der Konsole dargestellt; bei definierten Schwellenwerten erscheinen Preisalarme. Anwender können virtuelle Kauf‑ und Verkaufspositionen überwachen und so sogenanntes Paper Trading betreiben. „Paper trading allows investors to practice buying and selling securities without risking real money“ [1]. Genau dieses Prinzip überträgt StockSim auf eine didaktisch reduzierte Miniatur des globalen Aktienmarkts. Die Simulation kommt ohne externe Marktdaten aus, läuft plattformunabhängig und bleibt damit reproduzierbar.

Ziel des Projekts ist eine sichere und nachvollziehbare Umgebung in der Handelsstrategien ausprobiert, beobachtet und ausgewertet werden können. Der Entwicklungsauftrag war, ein objektorientiertes, wartbares Lernsystem zu schaffen, das den gesamten Ablauf transparent dokumentiert und so einen unmittelbaren Lerneffekt ermöglicht.

2. **Planung**
2.1 **Zielraum**
Mit der Anwendung StockSim wird eine Konsolenanwendung entwickelt, die den Handel mit Aktien in einer kontrollierten Umgebung simuliert. Kursbewegungen werden automatisch generiert und in der Konsole angezeigt, sodass Kursverläufe in Echtzeit beobachtet werden können. Auf Basis dieser Preise eröffnet die simulierte Handelslogik eigenständig virtuelle Kauf‑ und Verkaufspositionen; der Nutzer verfolgt diese Orders und Preisalarme ausschließlich beobachtend.

Das Ziel ist Handelsstrategien ohne reales Risiko zu testen und Marktmechanismen besser zu verstehen. Darauf hinaus leiten sich drei Leitziele ab: (a) realistische, aber kontrollierte Kursbewegungen, (b) reproduzierbare Handelslogiken und (c) eine stabile Auswertung der Handelsfolgen. Um diese Ziele zu erreichen, wurden Teilaufgaben definiert, etwa der Entwurf eines modularen Preissenders, die Implementierung von Beobachtern für Logging, Alerts und Candles sowie eine Strategie-API, über die Algorithmen wie Mean Reversion an den simulierten Markt andocken. Auf dieser Basis konnten Random-Walk, Observer-Landschaft, Matching Engine und Portfolio schrittweise aufgebaut und jeweils getestet werden.

2.2 **Abgrenzung**
Um den Umfang an den schulischen Rahmen anzupassen, verzichtet StockSim bewusst auf eine GUI, persistente Datenhaltung und echte Marktfeeds. Alle Kurse stammen aus einem Random-Walk-Modell, wodurch die Anwendung offline-fähig und datenschutzunkritisch bleibt. Sicherheitsfeatures wie Authentifizierung sind nicht nötig, weil ausschließlich Testdaten verarbeitet werden. Gleichwohl wurden Grenzen dokumentiert, etwa dass Ordergrößen fest auf ein Stück pro Signal eingestellt sind. Ebenso wurde entschieden, nur sechs prominente Aktien zu simulieren (das kann man einfach ändern), um sich auf die Architektur zu konzentrieren. So bleibt die Laufzeit berechenbar und die Logausgabe übersichtlich genug für Unterrichtszwecke.

2.3 **Werkzeuge und Technologien**
Die Anwendung wurde in TypeScript auf Basis von Node.js entwickelt. VS Code diente als IDE, Git/GitHub als Versionsverwaltung. Für Diagramme kamen PlantUML-Skizzen zum Einsatz, und npm-Skripte (z.B. „npm start“) steuern den Ablauf. Diese Toolchain stellt Typsicherheit, schnelle Iteration und eine saubere Nachvollziehbarkeit der Artefakte sicher. Die Wahl bewusst schlanker Werkzeuge – keine externe Datenbank, kein Framework-Overhead – unterstützte das Lernziel, jede Codezeile nachvollziehen zu können.

3. **Analyse**
Die funktionale Analyse ergab drei Kernakteure: 
den Preisstrom, die automatisierte Strategie und das Portfolio. Ein Use-Case-Diagramm (Abbildung 1) visualisiert, wie der Operator die Simulation startet, Limits setzt und Beobachter an- oder abschaltet. Ergänzt wird das Bild durch ein Sequenzdiagramm (Abbildung 2), das die Reise eines Quotes vom Random-Walk über Observer bis hin zur Verbuchung im Portfolio beschreibt. So entstanden klare Schnittstellen und ein besseres Verständnis für Nebenläufigkeiten. Zum Beispiel informiert der "PriceFeed" jeden Beobachter synchron.

Nicht-funktional dominierten Zuverlässigkeit (Ticker müssen im Sekundentakt aktualisiert werden), Nachvollziehbarkeit (jede Order wird geloggt) und Testbarkeit (die Logik sollte isoliert über Einheiten wie "RandomWalkGenerator" prüfbar bleiben). Hinzu kam die Forderung nach Erweiterbarkeit: Strategien sollten austauschbar sein, ohne Kernkomponenten anzupassen. Schließlich musste die Simulation deterministisch reproduzierbar bleiben, wenn identische Seeds verwendet werden, damit Unterrichtsbeispiele wiederholbar sind. Damit entstand eine klare Anforderungsmatrix, an der spätere Implementierungsentscheidungen gespiegelt werden konnten.

4. **Modellierung**
Die Modellierung orientiert sich klar an objektorientierten Prinzipien. Domain-Objekte wie `Stock`, `Ticker` und `Quote` halten Stammdaten und Zustände, während Services wie `MatchingEngine` und `Portfolio` das Verhalten bündeln. Im Zentrum steht das Observer-Pattern im Paket `observer`: `PriceFeed` fungiert als Subjekt und informiert Logger‑, Alert‑, Chart‑ und Strategie‑Komponenten entkoppelt über neue Preise. „Observer defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.“ [2] Dieses Zitat aus der GoF-Literatur beschreibt die gewünschte lose Kopplung.

StockSim lässt sich in drei Schichten einteilen:
- **Simulation** (`sim Ordner`): Der `RandomWalkGenerator` erzeugt mit Drift und Volatilität synthetische Preise, die von der `MarketClock` getaktet werden. Die Parameter sind so gewählt, dass Kurse sichtbar schwanken, aber nicht unkontrolliert explodieren; dadurch bleiben Alerts sinnvoll interpretierbar.
- **Beobachtung & Strategie** (`observer Ordner` und  `trading/Strategy` Datei): Beobachter reagieren auf `PriceEvent`s. `AlertObserver` löst z.B. Preiswarnungen bei etwa ±5 % Schwankung aus, während `MeanReversionStrategy` Orders an die `MatchingEngine` übergibt. Die Trennung von Beobachtung und Aktion erleichtert das Ergänzen weiterer Strategien wie Momentum oder VWAP.
- **Marktlogik** (`trading/*`): Das `OrderBook` verwaltet Gebote und Angebote, die `MatchingEngine` vergleicht sie mit neuen Quotes, und das `Portfolio` bucht resultierende Trades und erzeugt regelmäßig Snapshots. Die Preis‑Zeit‑Priorität im Orderbuch sorgt für ein nachvollziehbares, marktähnliches Verhalten.

Abbildung 1 versiuallsiert das Zusammenspiel dieser Klassen anhand des Klassendiagramms, das die Pakete Domain, Observer, Simulation und Trading klar trennt. Die Visualisierung wurde bewusst früh erstellt, um Schnittstellen zu schärfen und den OOP-Fokus in der Dokumentation sichtbar zu machen. Darüber hinaus dokumentiert das Sequenzdiagramm, wie `MeanReversionStrategy` im Falle eines Preisrückgangs einen Kaufauftrag generiert, der an die Matching-Engine weitergeleitet wird und anschließend als Trade im Portfolio erscheint (Abbildung 2).

5. **Reflexion und Ausblick**
Das Ergebnis erfüllt das Lernziel: Kursbewegungen wirken dynamisch, Benachrichtigungen machen größere Schwankungen sofort sichtbar, und die Strategie erzeugt regelmäßig Orders, die das Portfolio nachhaltig verändern. Die Architektur ist erweiterbar. Zusätzliche Strategien können `Strategy` problemlos erweitern, und weitere Ausgabekanäle können den `PriceFeed` abonnieren. Der Entwicklungsprozess zeigte außerdem, wie wichtig strukturierte Protokolle sind: Erst durch das Zusammenspiel von `[LOG]`, `[ALERT]` und `[TRADE]` ließ sich jeder Simulationslauf nachvollziehen und in der Nachbesprechung besprechen.

Dabei ist klar, dass reales Trading deutlich komplexere und vielfältigere Strategien kennt. Für StockSim wurde bewusst eine einfache Mean-Reversion-Strategie gewählt, weil sie sich gut erklären und im Unterricht einsetzen lässt. Die Anwendung versteht sich damit ausdrücklich als Lernumgebung und nicht als vollwertiges Handelssystem.

Gleichzeitig zeigte der Testbetrieb Einschränkungen auf. Ohne Persistenz können keine Datenreihen gespeichert werden, und es fehlt ein Risikomanagement (z.B. Stop-Loss oder Positionslimits pro Symbol). Zudem läuft die Simulation derzeit in einer Endlosschleife. Eine parametrisierte Laufzeit wäre für Lehrzwecke hilfreich. Denkbar sind weitere Ausbaustufen: 
1. konfigurierbare Ordergrößen 
2. ein CSV-Export von Portfolio-Snapshots
3. das Einbinden echter Marktdaten über geeignete Schnittstellen
4. eine Datenbank zur Speicherung und Analyse von Kursreihen sowie zur Erstellung einfacher Prognosen und
5. eine Web-Oberfläche, die die Kerzendaten aus `ChartObserver` visualisiert und die Beobachtung erleichtert. Solche Erweiterungen würden den Lerneffekt weiter steigern und die Nutzung über die reine Konsolenanwendung hinaus öffnen.

6. **Glossar**
StockSim**: Name der Lernanwendung.
Konsolenanwendung**: Programm ohne grafische Oberfläche.
GUI (grafische Benutzeroberfläche)**: grafische Oberfläche mit Fenstern und Buttons.
Node.js**: Laufzeitumgebung für JavaScript und TypeScript.
TypeScript**: typsichere Variante der Programmiersprache JavaScript.
VS Code (Visual Studio Code)**: Entwicklungsumgebung für Quellcode.
Git/GitHub**: System und Plattform zur Versionsverwaltung von Code.
Paper Trading**: Handel mit virtuellen Beträgen ohne echtes Geld.
Aktienkurs**: aktueller Preis einer Aktie.
Kursbewegung**: Veränderung des Aktienkurses im Zeitverlauf.
Portfolio**: Zusammenstellung aller Positionen und des Bargelds.
Order**: Auftrag zum Kauf oder Verkauf einer Aktie.
Orderbuch (OrderBook)**: Liste offener Kauf- und Verkaufsaufträge.
Matching Engine**: Baustein, der Kauf- und Verkaufsorders zusammenführt.
Trade**: tatsächlich ausgeführtes Geschäft zwischen Käufer und Verkäufer.
Preisalarm / Alert**: Meldung, wenn ein Kurs eine Grenze erreicht.
Snapshot**: Momentaufnahme des aktuellen Systemzustands.
CSV-Export**: Speichern von Daten in einer Tabellen-Textdatei.
Random Walk**: zufällige Bewegung eines Werts über die Zeit.
RandomWalkGenerator**: Programmteil, der solche Zufallsverläufe erzeugt.
Mean Reversion**: Strategie, die auf eine Rückkehr zum Durchschnitt setzt.
Strategie (Strategy)**: feste Regel, wann gekauft oder verkauft würde.
Observer Pattern**: Entwurfsmuster zur Benachrichtigung mehrerer Beobachter.
PriceFeed**: Komponente, die neue Preise an Beobachter verteilt.
Quote / PriceEvent**: einzelne Meldung mit einem aktuellen Preis.
Ticker**: Kurzname einer Aktie (z.B. „AAPL“).
Ordergröße**: Stückzahl einer Order.
Persistenz**: dauerhaftes Speichern von Daten.
Risikomanagement**: Begrenzung möglicher Verluste beim Handel.
Stop-Loss**: automatische Verkaufsorder bei Unterschreiten eines Kurses.
Positionslimit**: festgelegte Obergrenze für die Stückzahl einer Aktie.
Endlosschleife**: Schleife in einem Programm ohne automatisches Ende.
parametrisierte Laufzeit**: einstellbare Dauer der Simulation.
Web-Oberfläche**: einfache Webseite zur Anzeige und Bedienung.

7. **Quellenverzeichnis**
[1] Investopedia: „Paper Trading Definition“. Verfügbar unter: https://www.investopedia.com/terms/p/papertrade.asp (abgerufen am 20.11.2024).
[2] Gamma, E.; Helm, R.; Johnson, R.; Vlissides, J.: *Design Patterns – Elements of Reusable Object-Oriented Software*. Addison-Wesley, 1994.

8. **Anhang**
- Abbildung 1: Klassendiagramm (Datei `docs/classDiagram.png`).
- Abbildung 2: Sequenzdiagramm der Orderausführung (`docs/sequenceDiagram.png`).
- Abbildung 3: Use-Case-Visualisierung (`docs/userCase.png`).
