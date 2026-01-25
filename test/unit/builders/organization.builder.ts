import { Organization } from "@modules/organization/domain/entities/organization.entity";

export class OrganizationBuilder {
  private id = crypto.randomUUID() as string;
  private name = "Acme Sp. z o.o.";
  private industry = "SaaS";
  private dateFounded = new Date("2015-01-01T00:00:00.000Z");

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withIndustry(industry: string): this {
    this.industry = industry;
    return this;
  }

  withDateFounded(date: Date): this {
    this.dateFounded = date;
    return this;
  }

  build(): Organization {
    return new Organization(
      this.id,
      this.name,
      this.industry,
      this.dateFounded,
    );
  }
}
