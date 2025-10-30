export class RandomWalkGenerator {
  constructor(private readonly drift = 0.0002, private readonly volatility = 0.03) {}

  next(previousPrice: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const exponent =
      this.drift - 0.5 * this.volatility * this.volatility + this.volatility * z;
    const price = previousPrice * Math.exp(exponent);
    return Math.max(0.1, Number(price.toFixed(4)));
  }
}
