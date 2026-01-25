import { User } from "@modules/user/domain/entities/user.entity";

export class UserBuilder {
  private id = crypto.randomUUID() as string;
  private firstName = "John";
  private lastName = "Doe";
  private email = "john@example.com";
  private organizationId = crypto.randomUUID() as string;
  private dateCreated = new Date("2020-01-01T00:00:00.000Z");

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withEmail(email: string): this {
    this.email = email;
    return this;
  }

  withOrganizationId(organizationId: string): this {
    this.organizationId = organizationId;
    return this;
  }

  build(): User {
    return new User(
      this.id,
      this.firstName,
      this.lastName,
      this.email,
      this.organizationId,
      this.dateCreated,
    );
  }
}
