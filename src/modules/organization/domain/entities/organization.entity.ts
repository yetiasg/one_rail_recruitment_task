export class Organization {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly industry: string,
    public readonly dateFounded: Date,
  ) {}
}
