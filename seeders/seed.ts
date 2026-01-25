import { faker } from "@faker-js/faker";
import { Config } from "@infrastructure/config/config";
import { schema } from "@infrastructure/config/env.schema";
import { sequelize } from "@infrastructure/db/sequelize.instance";
import { UserModel } from "@modules/user/adapters/persistence/sequelize/models/user.model";
import { OrganizationModel } from "@modules/organization/adapters/sequelize/models/organization.model";
import { OrderModel } from "@modules/order/adapters/sequelize/models/order.model";
import { registerSequelizeModels } from "@infrastructure/db/sequelize.register-modules";

async function seed() {
  // Load env's
  Config.register({ schema });

  // Register sequelize models
  registerSequelizeModels(sequelize);

  const transaction = await sequelize.transaction();
  try {
    // --- ORGANIZATIONS ---
    const organizations = await Promise.all(
      Array.from({ length: 2 }).map(() =>
        OrganizationModel.create(
          {
            id: crypto.randomUUID(),
            name: faker.company.name(),
            industry: faker.company.buzzPhrase(),
            dateFounded: faker.date.past({ years: 20 }),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { transaction },
        ),
      ),
    );

    // --- USERS ---
    const users = await Promise.all(
      Array.from({ length: 10 }).map(() => {
        const organization = faker.helpers.arrayElement(organizations);
        return UserModel.create(
          {
            id: crypto.randomUUID(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email().toLowerCase(),
            organizationId: organization.id,
            dateCreated: faker.date.past({ years: 2 }),
            updatedAt: new Date(),
          },
          { transaction },
        );
      }),
    );

    // --- ORDERS ---
    await Promise.all(
      Array.from({ length: 20 }).map(() => {
        const user = faker.helpers.arrayElement(users);
        return OrderModel.create(
          {
            id: crypto.randomUUID(),
            userId: user.id,
            organizationId: user.organizationId,
            totalAmount: faker.number.float({
              min: 50,
              max: 5000,
              fractionDigits: 2,
            }),
            orderDate: faker.date.past({ years: 1 }),
            updatedAt: new Date(),
          },
          { transaction },
        );
      }),
    );

    await transaction.commit();
    console.log("Database seeding completed successfully");
  } catch (e) {
    await transaction.rollback();
    console.error("Seeding failed, rolled back:", e);
    throw e;
  } finally {
    await sequelize.close();
  }
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
