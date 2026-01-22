export class Order {
  constructor(
    public readonly id: string,
    public readonly orderDate: Date,
    public readonly totalAmount: string,
    public readonly userId: string,
    public readonly organizationId: string,
  ) {}
}
