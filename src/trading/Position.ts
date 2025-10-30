export class Position {
  constructor(
    public readonly symbol: string,
    public quantity = 0,
    public averageCost = 0
  ) {}

  applyBuy(price: number, quantity: number): void {
    if (this.quantity >= 0) {
      const currentValue = this.averageCost * this.quantity;
      const newValue = currentValue + price * quantity;
      this.quantity += quantity;
      this.averageCost = this.quantity === 0 ? 0 : newValue / this.quantity;
    } else {
      const shortQty = Math.abs(this.quantity);
      if (quantity > shortQty) {
        const remaining = quantity - shortQty;
        this.quantity = remaining;
        this.averageCost = remaining === 0 ? 0 : price;
      } else if (quantity === shortQty) {
        this.quantity = 0;
        this.averageCost = 0;
      } else {
        this.quantity = -(shortQty - quantity);
        // Maintain average cost for remaining short position.
      }
    }
  }

  applySell(price: number, quantity: number): void {
    if (this.quantity <= 0) {
      const shortQty = Math.abs(this.quantity);
      const currentValue = this.averageCost * shortQty;
      const newValue = currentValue + price * quantity;
      this.quantity -= quantity;
      const totalShort = Math.abs(this.quantity);
      this.averageCost = totalShort === 0 ? 0 : newValue / totalShort;
    } else {
      if (quantity < this.quantity) {
        this.quantity -= quantity;
        // Average cost remains the same while still long.
      } else if (quantity === this.quantity) {
        this.quantity = 0;
        this.averageCost = 0;
      } else {
        const remainingShort = quantity - this.quantity;
        this.quantity = -remainingShort;
        this.averageCost = price;
      }
    }
  }
}
