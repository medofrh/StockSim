import { Observer } from './Observer';

export class SimpleSubject<T> {
  private readonly observers = new Set<Observer<T>>();

  subscribe(observer: Observer<T>): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  protected notify(data: T): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}
